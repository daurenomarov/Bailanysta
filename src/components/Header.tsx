import { NavLink } from 'react-router-dom';
export function Header({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  return <header className="header"><div className="header-inner"><NavLink className="brand" to="/posts">B<span>ai</span>lanysta</NavLink><nav aria-label="Основная навигация"><NavLink to="/posts">Лента</NavLink><NavLink to="/profile">Профиль</NavLink><button className="icon-button" onClick={toggleTheme} aria-label="Переключить тему">{theme === 'dark' ? '☀' : '☾'}</button></nav></div></header>;
}
