import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Компонент Field определен СНАРУЖИ, чтобы не пересоздаваться при обновлении состояния родителя
const Field = ({ name, label, type = 'text', placeholder, value, onChange, error }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input
      className="form-input"
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={error ? { borderColor: 'var(--danger)' } : {}}
      required
    />
    {error && (
      <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{error}</span>
    )}
  </div>
);

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '', email: '', password: '', password2: ''
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    // Очищаем ошибку для этого поля при вводе
    if (errors[e.target.name]) {
      setErrors(err => ({ ...err, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.username) e.username = 'Введите имя пользователя';
    if (form.password.length < 6) e.password = 'Минимум 6 символов';
    if (form.password !== form.password2) e.password2 = 'Пароли не совпадают';
    return e;
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await register(form);
      await login({ username: form.username, password: form.password });
      navigate('/');
    } catch (err) {
      const data = err.response?.data || {};
      const mapped = {};
      Object.entries(data).forEach(([k, v]) => {
        mapped[k] = Array.isArray(v) ? v[0] : v;
      });
      setErrors(mapped);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page fade-in">
      <div className="auth-box">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚀</div>
          <h2>Создать аккаунт</h2>
          <p className="subtitle">Присоединяйтесь и начните голосовать</p>
        </div>

        {errors.non_field_errors && (
          <div className="alert alert-error">{errors.non_field_errors}</div>
        )}

        <form onSubmit={handleSubmit}>
          <Field 
            name="username" 
            label="Имя пользователя" 
            placeholder="cool_username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
          />
          <Field 
            name="email" 
            label="Email (необязательно)" 
            type="email" 
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Field 
            name="password" 
            label="Пароль" 
            type="password" 
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Field 
            name="password2" 
            label="Подтвердите пароль" 
            type="password" 
            placeholder="••••••••"
            value={form.password2}
            onChange={handleChange}
            error={errors.password2}
          />

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? '⏳ Регистрация...' : '🚀 Создать аккаунт'}
          </button>
        </form>

        <div className="divider">или</div>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Уже есть аккаунт?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Войти</Link>
        </p>
      </div>
    </div>
  );
}
