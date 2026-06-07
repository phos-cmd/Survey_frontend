import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { surveyAPI } from '../services/api';

export default function Home() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    surveyAPI.list()
      .then(r => setSurveys(r.data))
      .catch(() => setError('Не удалось загрузить опросы'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page fade-in">
      {/* Hero */}
      <div className="hero">
        <h1>Добро пожаловать в <span className="hero-gradient-text">SurveyProject</span></h1>
        <p>Проходите опросы, голосуйте и узнавайте свои сильные стороны</p>
        <div className="hero-actions">
          <Link to="/polls" className="btn btn-outline btn-lg">🗳️ Голосования</Link>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Доступные опросы</h2>
        <span className="badge badge-blue">{surveys.length} опросов</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {surveys.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>Опросы пока не добавлены</h3>
          <p>Загляните позже</p>
        </div>
      ) : (
        <div className="card-grid">
          {surveys.map(s => (
            <Link to={`/surveys/${s.id}`} key={s.id} style={{ textDecoration: 'none' }}>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-green">● Активен</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(s.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>{s.title}</h3>
                {s.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {s.description.slice(0, 100)}{s.description.length > 100 ? '…' : ''}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span>❓ {s.question_count} вопросов</span>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <span className="btn btn-primary btn-sm">Пройти →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
