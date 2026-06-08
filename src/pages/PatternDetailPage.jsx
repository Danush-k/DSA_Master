import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, ChevronUp, Check, X, Sparkles,
  AlertTriangle, ListChecks
} from 'lucide-react';
import useAllQuestions from '../hooks/useAllQuestions.js';
import patterns from '../data/patterns.js';
import { getPatternIcon, getPatternVideoUrl, Youtube } from '../utils/helpers.jsx';
import QuestionTable from '../components/QuestionTable.jsx';

export default function PatternDetailPage() {
  const { patternId } = useParams();
  const pat = patterns[patternId];
  const allQuestions = useAllQuestions();
  const patQs = useMemo(() => allQuestions.filter(q => q.pattern === patternId), [allQuestions, patternId]);
  const [showTheory, setShowTheory] = useState(true);

  if (!pat) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <div className="empty-state-title">Pattern not found</div>
          <Link to="/patterns" className="btn btn-primary" style={{ marginTop: 16 }}>← Back to Patterns</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 8 }}>
        <Link to="/patterns" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>← Back to Patterns</Link>
      </div>

      {/* Pattern Hero */}
      <div className="pattern-hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ color: 'var(--accent-primary)', marginBottom: 12 }}>
            {getPatternIcon(patternId, { size: 36 })}
          </div>
          <h2 className="pattern-hero-title">{pat.name}</h2>
          <p className="pattern-hero-description">{pat.description}</p>

          <div className="pattern-meta">
            {pat.timeComplexity && (
              <div className="pattern-meta-item">
                <span className="pattern-meta-label">Time Complexity</span>
                <span className="pattern-meta-value" style={{ fontFamily: 'var(--font-mono)' }}>{pat.timeComplexity}</span>
              </div>
            )}
            {pat.spaceComplexity && (
              <div className="pattern-meta-item">
                <span className="pattern-meta-label">Space Complexity</span>
                <span className="pattern-meta-value" style={{ fontFamily: 'var(--font-mono)' }}>{pat.spaceComplexity}</span>
              </div>
            )}
            <div className="pattern-meta-item">
              <span className="pattern-meta-label">Problems</span>
              <span className="pattern-meta-value">{patQs.length} questions</span>
            </div>
            <div className="pattern-meta-item">
              <span className="pattern-meta-label">Concept Video</span>
              <a
                href={getPatternVideoUrl(patternId, pat.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="tutorial-link-btn"
                style={{ width: 'fit-content', marginTop: 4 }}
              >
                <Youtube size={14} /> Watch Tutorial
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Theory Section */}
      {pat.recognition && (
        <div style={{ marginBottom: 'var(--space-7)' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowTheory(!showTheory)}
            style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {showTheory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showTheory ? 'Hide' : 'Show'} Pattern Theory
          </button>

          {showTheory && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
              {/* Recognition Clues */}
              <div className="card pattern-section">
                <div className="pattern-section-title">🔍 Recognition Clues</div>
                <ul className="clue-list">
                  {pat.recognition.map((clue, i) => (
                    <li className="clue-item" key={i}>
                      <ChevronRight className="clue-icon" size={16} />
                      <span>{clue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* When to Use / Not Use */}
              <div className="card pattern-section">
                <div className="pattern-section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Check size={16} style={{ color: 'var(--success)' }} />
                  When to Use
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                  {pat.whenToUse}
                </p>
                <div className="pattern-section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <X size={16} style={{ color: 'var(--error)' }} />
                  When NOT to Use
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                  {pat.whenNotToUse}
                </p>
                {pat.interviewTips && (
                  <>
                    <div className="pattern-section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
                      Interview Tips
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--accent-primary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                      {pat.interviewTips}
                    </p>
                  </>
                )}
              </div>

              {/* Common Mistakes */}
              {pat.commonMistakes && (
                <div className="card pattern-section" style={{ gridColumn: 'span 2' }}>
                  <div className="pattern-section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={16} style={{ color: 'var(--error)' }} />
                    Common Mistakes
                  </div>
                  <ul className="clue-list">
                    {pat.commonMistakes.map((m, i) => (
                      <li className="clue-item" key={i} style={{ background: 'var(--error-bg)' }}>
                        <X size={16} style={{ color: 'var(--error)', flexShrink: 0 }} />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Questions */}
      <div className="section-header">
        <div className="section-title">
          <ListChecks size={20} className="section-title-icon" /> Practice Problems ({patQs.length})
        </div>
      </div>
      <QuestionTable questionList={patQs} showTopic={true} showPattern={false} />
    </div>
  );
}
