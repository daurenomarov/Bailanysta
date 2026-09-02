export function Avatar({ initials, large = false }: { initials: string; large?: boolean }) { return <span className={`avatar ${large ? 'avatar-large' : ''}`} aria-hidden="true">{initials}</span>; }
