export function PageShell({ children, className = '' }) {
  return (
    <div
      className={`relative min-h-screen overflow-hidden px-4 pb-28 pt-5 ${className}`.trim()}
      style={{ background: '#0a0a0f' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background: [
            'radial-gradient(circle at 50% 12%, rgba(124,58,237,0.22), transparent 34%)',
            'radial-gradient(circle at 14% 26%, rgba(167,139,250,0.08), transparent 20%)',
            'radial-gradient(circle at 84% 34%, rgba(96,165,250,0.08), transparent 18%)',
          ].join(','),
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(circle at center, black, transparent 82%)',
        }}
      />

      <div className="relative z-10 mx-auto min-h-[calc(100vh-2.5rem)] max-w-[430px]">
        <div
          className="relative min-h-full overflow-hidden rounded-[34px] border px-4 pb-24 pt-5 shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
          style={{
            background:
              'linear-gradient(180deg, rgba(18,18,26,0.96) 0%, rgba(13,13,20,0.96) 48%, rgba(9,9,14,0.98) 100%)',
            borderColor: 'rgba(167,139,250,0.16)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-[34px]"
            style={{
              boxShadow:
                'inset 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 50px rgba(124,58,237,0.08)',
            }}
          />
          <div className="pointer-events-none absolute inset-x-7 top-3 h-px bg-gradient-to-r from-transparent via-[#a78bfa55] to-transparent" />
          <div className="pointer-events-none absolute inset-x-10 bottom-0 h-16 bg-gradient-to-t from-[#7c3aed12] to-transparent" />
          <div className="relative z-10 min-h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
