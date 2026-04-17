export function TetrisFall({ children, delay = 0, className = '' }) {
  return (
    <div
      className={`animate-tetris-fall ${className}`.trim()}
      style={{
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
