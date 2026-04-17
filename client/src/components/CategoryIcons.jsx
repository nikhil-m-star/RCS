export function TransportIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="4" fill="currentColor" />
      <line x1="24" y1="6" x2="24" y2="42" stroke="currentColor" strokeWidth="2" />
      <line x1="6" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function FoodIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M24 6C24 6 8 18 8 28C8 36 15 42 24 42C33 42 40 36 40 28C40 18 24 6 24 6Z"
        stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"
      />
      <path d="M24 14V34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 22C28 18 32 20 32 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function EnergyIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M28 4L12 26H24L20 44L36 22H24L28 4Z"
        stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"
      />
    </svg>
  );
}

export function WaterIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M24 4L10 28C10 36 16 42 24 42C32 42 38 36 38 28L24 4Z"
        stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"
      />
      <path d="M18 30C18 34 20 36 24 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function WasteIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M16 10L8 24L24 32L16 10Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 10L40 24L24 32L32 10Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 32L16 40H32L24 32Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export function NatureIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M24 42V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M24 22C24 22 14 20 12 12C10 4 24 6 24 6C24 6 38 4 36 12C34 20 24 22 24 22Z"
        stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"
      />
      <path d="M18 36C18 36 20 30 24 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 36C30 36 28 30 24 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export const CategoryIcon = ({ category, size = 48 }) => {
  const icons = {
    transport: TransportIcon,
    food: FoodIcon,
    energy: EnergyIcon,
    water: WaterIcon,
    waste: WasteIcon,
    nature: NatureIcon,
  };
  const Icon = icons[category];
  return Icon ? <Icon size={size} /> : null;
};
