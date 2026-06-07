import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          📊 SurveyProject
        </NavLink>

        <div className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
          >
            Опросы
          </NavLink>
          <NavLink
            to="/polls"
            className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
          >
            Голосования
          </NavLink>
        </div>

        <div className="navbar-auth">
          {user ? (
            <>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                👤 {user.username}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login"    className="btn btn-ghost btn-sm">Войти</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">Регистрация</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
