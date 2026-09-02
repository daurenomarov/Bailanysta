export function Skeleton() { return <div aria-label="Загрузка" className="stack">{[1,2,3].map((n) => <div className="card skeleton-card" key={n}><i/><div><i/><i/><i/></div></div>)}</div>; }
