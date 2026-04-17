export function PageShell({ children, className = '' }) {
  return (
    <div className={`page-root ${className}`.trim()}>
      <div className="page-glows" />
      <div className="page-grid" />

      <div className="page-container">
        <div className="page-shell-inner">
          <div className="inner-glow-overlay" />
          <div className="top-accent-line" />
          <div className="left-accent-line" />
          <div className="bottom-glow" />
          <div className="relative z-10 min-h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
