import { auth, db } from '../firebaseClient.js';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  setDoc,
  getDocs,
  query,
  where,
  collection,
  deleteDoc
} from 'firebase/firestore';
import useProgressStore from '../store/useProgressStore.js';
import useNotesStore from '../store/useNotesStore.js';
import useRevisionStore from '../store/useRevisionStore.js';

let isHydrating = false;
let authUser = null;

// Initialize synchronization listeners
export function initDbSync(onStatusChange) {
  if (!auth || !db) {
    if (onStatusChange) onStatusChange('local-only', null);
    return;
  }

  // Notify loading state immediately
  if (onStatusChange) onStatusChange('loading', null);

  // Listen for Firebase Authentication state changes
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      authUser = user;
      if (onStatusChange) onStatusChange('syncing', user);
      await hydrateFromCloud(user);
      if (onStatusChange) onStatusChange('synced', user);
    } else {
      authUser = null;
      if (onStatusChange) onStatusChange('unauthenticated', null);
    }
  });

  // Subscribe to local useProgressStore changes
  useProgressStore.subscribe(async (state, prevState) => {
    if (isHydrating || !authUser) return;

    const activeProfileId = state.activeProfileId;
    const profile = state.profiles[activeProfileId];
    const prevProfile = prevState.profiles[activeProfileId];
    if (!profile) return;

    // 1. Sync custom questions changes
    if (JSON.stringify(profile.customQuestions) !== JSON.stringify(prevProfile?.customQuestions)) {
      await syncCustomQuestions(profile.customQuestions, activeProfileId);
    }

    // 2. Sync question status (solved, etc.) and bookmarks
    const statusKeys = Object.keys(profile.questionStatus);
    const prevStatusKeys = Object.keys(prevProfile?.questionStatus || {});
    const bookmarks = profile.bookmarks || [];
    const prevBookmarks = prevProfile?.bookmarks || [];

    const allKeys = [...new Set([...statusKeys, ...prevStatusKeys, ...bookmarks, ...prevBookmarks])];
    
    for (const qId of allKeys) {
      const numId = parseInt(qId);
      if (isNaN(numId)) continue;
      const status = profile.questionStatus[numId] || null;
      const prevStatus = prevProfile?.questionStatus?.[numId] || null;
      const bookmarked = bookmarks.includes(numId);
      const prevBookmarked = prevBookmarks.includes(numId);

      if (status !== prevStatus || bookmarked !== prevBookmarked) {
        const docId = `${authUser.uid}_${activeProfileId}_${numId}`;
        await setDoc(doc(db, 'user_progress', docId), {
          userId: authUser.uid,
          profileKey: activeProfileId,
          questionId: numId,
          status,
          bookmarked,
          updatedAt: new Date().toISOString()
        });
      }
    }

    // 3. Sync profile metadata changes (avatar, name)
    const allProfileKeys = Object.keys(state.profiles);
    for (const key of allProfileKeys) {
      const p = state.profiles[key];
      const prevP = prevState.profiles[key];
      if (p && (p.name !== prevP?.name || p.avatar !== prevP?.avatar)) {
        const docId = `${authUser.uid}_${key}`;
        await setDoc(doc(db, 'profiles', docId), {
          userId: authUser.uid,
          profileKey: key,
          name: p.name,
          avatar: p.avatar,
          createdAt: new Date().toISOString()
        });
      }
    }
  });

  // Subscribe to local useNotesStore changes
  useNotesStore.subscribe(async (state, prevState) => {
    if (isHydrating || !authUser) return;

    const activeProfileId = useProgressStore.getState().activeProfileId;
    const notes = state.profiles[activeProfileId] || {};
    const prevNotes = prevState.profiles[activeProfileId] || {};

    const allKeys = [...new Set([...Object.keys(notes), ...Object.keys(prevNotes)])];
    for (const qId of allKeys) {
      const numId = parseInt(qId);
      if (isNaN(numId)) continue;
      const noteData = notes[numId];
      const prevNoteData = prevNotes[numId];

      if (JSON.stringify(noteData) !== JSON.stringify(prevNoteData)) {
        const docId = `${authUser.uid}_${activeProfileId}_${numId}`;
        await setDoc(doc(db, 'user_notes', docId), {
          userId: authUser.uid,
          profileKey: activeProfileId,
          questionId: numId,
          note: noteData?.notes || '',
          code: noteData?.code || '',
          why: noteData?.why || '',
          updatedAt: new Date().toISOString()
        });
      }
    }
  });

  // Subscribe to local useRevisionStore changes
  useRevisionStore.subscribe(async (state, prevState) => {
    if (isHydrating || !authUser) return;

    const activeProfileId = useProgressStore.getState().activeProfileId;
    const revisions = state.profiles[activeProfileId] || {};
    const prevRevisions = prevState.profiles[activeProfileId] || {};

    const allKeys = [...new Set([...Object.keys(revisions), ...Object.keys(prevRevisions)])];
    for (const qId of allKeys) {
      const numId = parseInt(qId);
      if (isNaN(numId)) continue;
      const rev = revisions[numId];
      const prevRev = prevRevisions[numId];

      if (JSON.stringify(rev) !== JSON.stringify(prevRev)) {
        const docId = `${authUser.uid}_${activeProfileId}_${numId}`;
        await setDoc(doc(db, 'user_revisions', docId), {
          userId: authUser.uid,
          profileKey: activeProfileId,
          questionId: numId,
          revisionCount: rev?.revisionCount || 0,
          nextRevisionDate: rev?.nextRevisionDate || null,
          completed: rev?.completed || false,
          updatedAt: new Date().toISOString()
        });
      }
    }
  });
}

// Sync custom questions helper
async function syncCustomQuestions(customQuestions, profileId) {
  if (!authUser) return;
  
  for (const q of customQuestions) {
    const docId = `${authUser.uid}_${profileId}_${q.id}`;
    await setDoc(doc(db, 'custom_questions', docId), {
      userId: authUser.uid,
      profileKey: profileId,
      id: q.id,
      num: q.num,
      title: q.title,
      url: q.url,
      videoUrl: q.videoUrl || null,
      difficulty: q.difficulty,
      topic: q.topic,
      pattern: q.pattern,
      importance: q.importance,
      why: q.why,
      companies: q.companies || [],
      createdAt: new Date().toISOString()
    });
  }
}

// Hydrate local store state from Firebase Firestore
async function hydrateFromCloud(user) {
  isHydrating = true;
  try {
    // 1. Fetch profiles
    const profilesQuery = query(collection(db, 'profiles'), where('userId', '==', user.uid));
    const profilesSnap = await getDocs(profilesQuery);

    // 2. Fetch progress
    const progressQuery = query(collection(db, 'user_progress'), where('userId', '==', user.uid));
    const progressSnap = await getDocs(progressQuery);

    // 3. Fetch custom questions
    const customQuery = query(collection(db, 'custom_questions'), where('userId', '==', user.uid));
    const customSnap = await getDocs(customQuery);

    // 4. Fetch notes
    const notesQuery = query(collection(db, 'user_notes'), where('userId', '==', user.uid));
    const notesSnap = await getDocs(notesQuery);

    // 5. Fetch revisions
    const revisionsQuery = query(collection(db, 'user_revisions'), where('userId', '==', user.uid));
    const revisionsSnap = await getDocs(revisionsQuery);

    const progressStoreState = { ...useProgressStore.getState() };
    const notesStoreState = { ...useNotesStore.getState() };
    const revisionStoreState = { ...useRevisionStore.getState() };

    // Initialize local stores based on dbProfiles
    if (profilesSnap.empty) {
      // Save default local profile for new user
      const activeProfileId = progressStoreState.activeProfileId || 'default';
      const localProfile = progressStoreState.profiles[activeProfileId];
      if (localProfile) {
        const docId = `${user.uid}_${activeProfileId}`;
        await setDoc(doc(db, 'profiles', docId), {
          userId: user.uid,
          profileKey: activeProfileId,
          name: user.displayName || localProfile.name || 'Danush',
          avatar: localProfile.avatar || '🦊',
          createdAt: new Date().toISOString()
        });
      }
    } else {
      profilesSnap.forEach(docSnap => {
        const p = docSnap.data();
        const pk = p.profileKey;
        if (!progressStoreState.profiles[pk]) {
          progressStoreState.profiles[pk] = {
            name: p.name,
            avatar: p.avatar,
            questionStatus: {},
            dailySolves: {},
            bookmarks: [],
            currentStreak: 0,
            longestStreak: 0,
            lastSolveDate: null,
            customQuestions: []
          };
        } else {
          progressStoreState.profiles[pk].name = p.name;
          progressStoreState.profiles[pk].avatar = p.avatar;
        }

        if (!notesStoreState.profiles[pk]) notesStoreState.profiles[pk] = {};
        if (!revisionStoreState.profiles[pk]) revisionStoreState.profiles[pk] = {};
      });
    }

    // Hydrate progress
    progressSnap.forEach(docSnap => {
      const row = docSnap.data();
      const pk = row.profileKey;
      if (!progressStoreState.profiles[pk]) return;

      if (row.status) {
        progressStoreState.profiles[pk].questionStatus[row.questionId] = row.status;
      } else {
        delete progressStoreState.profiles[pk].questionStatus[row.questionId];
      }

      const bIdx = progressStoreState.profiles[pk].bookmarks.indexOf(row.questionId);
      if (row.bookmarked && bIdx === -1) {
        progressStoreState.profiles[pk].bookmarks.push(row.questionId);
      } else if (!row.bookmarked && bIdx > -1) {
        progressStoreState.profiles[pk].bookmarks.splice(bIdx, 1);
      }
    });

    // Hydrate custom questions
    const customQGroups = {};
    customSnap.forEach(docSnap => {
      const row = docSnap.data();
      const pk = row.profileKey;
      if (!customQGroups[pk]) customQGroups[pk] = [];
      customQGroups[pk].push({
        id: row.id,
        num: row.num,
        title: row.title,
        url: row.url,
        videoUrl: row.videoUrl || undefined,
        difficulty: row.difficulty,
        topic: row.topic,
        pattern: row.pattern,
        importance: row.importance,
        why: row.why,
        companies: row.companies || [],
        isCustom: true
      });
    });

    Object.entries(customQGroups).forEach(([pk, qs]) => {
      if (progressStoreState.profiles[pk]) {
        progressStoreState.profiles[pk].customQuestions = qs;
      }
    });

    // Hydrate notes
    notesSnap.forEach(docSnap => {
      const row = docSnap.data();
      const pk = row.profileKey;
      if (!notesStoreState.profiles[pk]) notesStoreState.profiles[pk] = {};
      notesStoreState.profiles[pk][row.questionId] = {
        notes: row.note,
        code: row.code,
        why: row.why,
        updatedAt: row.updatedAt
      };
    });

    // Hydrate revisions
    revisionsSnap.forEach(docSnap => {
      const row = docSnap.data();
      const pk = row.profileKey;
      if (!revisionStoreState.profiles[pk]) revisionStoreState.profiles[pk] = {};
      revisionStoreState.profiles[pk][row.questionId] = {
        revisionCount: row.revisionCount,
        nextRevisionDate: row.nextRevisionDate,
        completed: row.completed
      };
    });

    // Set updated Zustand store states
    useProgressStore.setState(progressStoreState);
    useNotesStore.setState(notesStoreState);
    useRevisionStore.setState(revisionStoreState);

  } catch (err) {
    console.error("Hydration from Firebase Cloud failed:", err);
  } finally {
    isHydrating = false;
  }
}

// Delete all cloud data for a user (cascading deletion)
export async function deleteUserCloudData(user) {
  if (!db || !user) return;
  
  const collections = ['profiles', 'user_progress', 'user_notes', 'user_revisions', 'custom_questions'];
  
  for (const collName of collections) {
    try {
      const q = query(collection(db, collName), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const deletePromises = [];
      snap.forEach((docSnap) => {
        deletePromises.push(deleteDoc(docSnap.ref));
      });
      await Promise.all(deletePromises);
    } catch (err) {
      console.error(`Failed to delete collection ${collName} for user:`, err);
    }
  }
}

// Clear all local Zustand store caches and localStorage entries
export function clearAllLocalStores() {
  useProgressStore.getState().clearStore();
  useNotesStore.getState().clearStore();
  useRevisionStore.getState().clearStore();
  localStorage.removeItem('dsa-progress-v2');
  localStorage.removeItem('dsa-notes-v2');
  localStorage.removeItem('dsa-revisions-v2');
}

