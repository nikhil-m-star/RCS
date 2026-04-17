export function FogBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="fog-layer fog-layer-1" />
      <div className="fog-layer fog-layer-2" />
    </div>
  );
}
