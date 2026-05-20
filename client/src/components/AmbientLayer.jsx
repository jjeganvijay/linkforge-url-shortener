/** Persistent ambient light — subtle, professional, no route flicker. */
export default function AmbientLayer() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <div
        className="ambient-orb -left-32 -top-28 h-[28rem] w-[28rem]"
        style={{
          opacity: 0.35,
          background:
            'radial-gradient(circle, rgba(167, 139, 250, 0.4) 0%, rgba(124, 58, 237, 0.12) 50%, transparent 70%)',
        }}
      />
      <div
        className="ambient-orb -right-32 top-0 h-[26rem] w-[26rem]"
        style={{
          opacity: 0.28,
          animationDelay: '1.5s',
          background:
            'radial-gradient(circle, rgba(244, 114, 182, 0.28) 0%, rgba(192, 132, 252, 0.1) 50%, transparent 72%)',
        }}
      />
      <div
        className="ambient-orb bottom-[-4rem] left-1/2 h-[18rem] w-[36rem] -translate-x-1/2"
        style={{
          opacity: 0.22,
          animationDelay: '2.5s',
          background:
            'radial-gradient(ellipse, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
