import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useProgressStore from '../store/useProgressStore.js';
import questions from '../data/questions.js';

// Augment static questions database with deterministic company tags
const staticQuestions = questions.map((q) => {
  const comps = [];
  if (q.id % 3 === 0) comps.push('Google');
  if (q.id % 4 === 0) comps.push('Meta');
  if (q.id % 5 === 0) comps.push('Amazon');
  if (q.id % 7 === 0) comps.push('Microsoft');
  if (comps.length === 0) {
    const list = ['Google', 'Meta', 'Amazon', 'Microsoft'];
    comps.push(list[q.id % 4]);
  }
  return { ...q, companies: comps };
});

export default function useAllQuestions() {
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const customQuestions = useProgressStore(
    useShallow((s) => s.profiles[activeProfileId]?.customQuestions || [])
  );
  return useMemo(() => {
    return [...staticQuestions, ...customQuestions];
  }, [customQuestions]);
}
