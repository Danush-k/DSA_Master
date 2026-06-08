export default function SkeletonLoader() {
  return (
    <div className="skeleton-container page-content animate-pulse" style={{ width: '100%' }}>
      {/* Header Skeleton */}
      <div className="skeleton-header-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="skeleton-element" style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="skeleton-element" style={{ width: 140, height: 16, borderRadius: 4 }}></div>
            <div className="skeleton-element" style={{ width: 80, height: 10, borderRadius: 4 }}></div>
          </div>
        </div>
        <div className="skeleton-element" style={{ width: 100, height: 32, borderRadius: 'var(--radius-md)' }}></div>
      </div>

      {/* Hero / Stat Cards Skeleton */}
      <div className="skeleton-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 28 }}>
        <div className="skeleton-card" style={{ height: 140, borderRadius: 'var(--radius-lg)' }}></div>
        <div className="skeleton-card" style={{ height: 140, borderRadius: 'var(--radius-lg)' }}></div>
        <div className="skeleton-card" style={{ height: 140, borderRadius: 'var(--radius-lg)' }}></div>
      </div>

      {/* List / Table Section Skeleton */}
      <div className="skeleton-card" style={{ borderRadius: 'var(--radius-lg)', padding: 20, height: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="skeleton-element" style={{ width: 120, height: 14, borderRadius: 4, marginBottom: 10 }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="skeleton-element" style={{ width: 16, height: 16, borderRadius: 3 }}></div>
              <div className="skeleton-element" style={{ width: 36, height: 12, borderRadius: 3 }}></div>
              <div className="skeleton-element" style={{ flex: 1, height: 12, borderRadius: 3 }}></div>
              <div className="skeleton-element" style={{ width: 50, height: 12, borderRadius: 3 }}></div>
              <div className="skeleton-element" style={{ width: 70, height: 20, borderRadius: 10 }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
