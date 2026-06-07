import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pollAPI } from '../services/api';

export default function PollList() {
  const [polls,   setPolls]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    pollAPI.list()
      .then(r => setPolls(r.data))
      .catch(() => setError('Не удалось загрузить голосования'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  const active   = polls.filter(p => p.is_active);
  const finished = polls.filter(p => !p.is_active);

  const PollCard = ({ poll }) => (
    <Link to={`/polls/${poll.id}`} style={{ textDecoration: 'none' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          {poll.is_active
            ? <span className="badge badge-green">● Активно</span>
            : <span className="badge badge-orange">✓ Завершено</span>
          }
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            {new Date(poll.created_at).toLocaleDateString('ru-RU')}
          </span>
        </div>
        <h3 style={{ marginBottom: '0.5rem' }}>{poll.title}</h3>
        {poll.description && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {poll.description.slice(0, 100)}{poll.description.length > 100 ? '…' : ''}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            🗳️ {poll.total_votes} голосов
          </span>
          <span className={`btn btn-sm ${poll.is_active ? 'btn-primary' : 'btn-ghost'}`}>
            {poll.is_active ? 'Голосовать →' : 'Результаты →'}
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="page fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1>🗳️ Голосования</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
          Участвуйте в актуальных голосованиях и смотрите результаты
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {polls.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🗳️</div>
          <h3>Голосований пока нет</h3>
          <p>Загляните позже</p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <>
              <div className="section-header">
                <h2 className="section-title">Активные</h2>
                <span className="badge badge-green">{active.length}</span>
              </div>
              <div className="card-grid">
                {active.map(p => <PollCard key={p.id} poll={p} />)}
              </div>
            </>
          )}
          {finished.length > 0 && (
            <>
              <div className="section-header" style={{ marginTop: '2.5rem' }}>
                <h2 className="section-title">Завершённые</h2>
                <span className="badge badge-orange">{finished.length}</span>
              </div>
              <div className="card-grid">
                {finished.map(p => <PollCard key={p.id} poll={p} />)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
