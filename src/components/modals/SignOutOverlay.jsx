import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function SignOutOverlay() {
  return (
    <div className="signout-overlay">
      <div className="signout-card">
        <RefreshCw className="spin signout-spinner" size={40} />
        <h3>Signing out of DSA Mastery</h3>
        <p>Securing your workspace and syncing records...</p>
      </div>
    </div>
  );
}
