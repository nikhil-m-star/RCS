export function PageShell({ children, className = '' }) {
  return (
    <div
      className={`relative min-h-screen overflow-hidden px-4 pb-8 pt-3 sm:px-6 lg:px-8 ${className}`.trim()}
      style={{ background: '#0a0a0f' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background: [
            'radial-gradient(circle at 18% 14%, rgba(124,58,237,0.18), transparent 26%)',
            'radial-gradient(circle at 74% 18%, rgba(96,165,250,0.08), transparent 18%)',
            'radial-gradient(circle at 52% 82%, rgba(167,139,250,0.06), transparent 22%)',
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

      <div className="relative z-10 mx-auto min-h-[calc(100vh-1.5rem)] w-full max-w-[1480px]">
        <div
          className="relative min-h-full overflow-hidden rounded-[28px] border px-4 pb-24 pt-4 shadow-[0_40px_120px_rgba(0,0,0,0.55)] sm:px-6 lg:rounded-[40px] lg:px-8 lg:pb-8 lg:pt-5"
          style={{
            background:
              'linear-gradient(180deg, rgba(18,18,26,0.96) 0%, rgba(12,12,19,0.98) 42%, rgba(8,8,13,0.99) 100%)',
            borderColor: 'rgba(167,139,250,0.16)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-[28px] lg:rounded-[40px]"
            style={{
              boxShadow:
                'inset 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -24px 60px rgba(124,58,237,0.04), 0 0 50px rgba(124,58,237,0.08)',
            }}
          />
          <div className="pointer-events-none absolute inset-x-7 top-3 h-px bg-gradient-to-r from-transparent via-[#a78bfa55] to-transparent" />
          <div className="pointer-events-none absolute left-0 top-24 hidden h-[65%] w-px bg-gradient-to-b from-transparent via-[#a78bfa22] to-transparent lg:block" />
          <div className="pointer-events-none absolute inset-x-10 bottom-0 h-16 bg-gradient-to-t from-[#7c3aed12] to-transparent lg:h-24" />
          <div className="relative z-10 min-h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
