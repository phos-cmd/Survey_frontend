import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pollAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PollDetail() {
  const { id }  = useParams();
  const { user } = useAuth();

  const [poll,      setPoll]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [voting,    setVoting]    = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [selected,  setSelected]  = useState(null);

  const fetchPoll = () => {
    pollAPI.detail(id)
      .then(r => setPoll(r.data))
      .catch(() => setError('Голосование не найдено'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPoll(); }, [id]);

  const handleVote = async () => {
    if (!selected) return;
    setVoting(true);
    setError('');
    try {
      const res = await pollAPI.vote(id, { option_id: selected });
      setPoll(res.data.poll);
      setSuccess('✅ Ваш голос принят!');
    } catch (e) {
      setError(e.response?.data?.error || 'Ошибка при голосовании');
    } finally {
      setVoting(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!poll && error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!poll) return null;

  const showResults = poll.user_voted || !poll.is_active;
  const maxVotes    = Math.max(...poll.options.map(o => o.vote_count), 1);

  return (
    <div className="page fade-in" style={{ maxWidth: 680 }}>
      {/* Header */}
      <div style={{ marginBottom: '0.75rem' }}>
        <Link to="/polls" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          ← Все голосования
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <h1>{poll.title}</h1>
        {poll.is_active
          ? <span className="badge badge-green">● Активно</span>
          : <span className="badge badge-orange">✓ Завершено</span>
        }
      </div>
      {poll.description && (
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{poll.description}</p>
      )}

      {/* Stats bar */}
      <div style={{
        display: 'flex', gap: '1.5rem', padding: '0.75rem 1rem',
        background: 'var(--bg-card)', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)', marginBottom: '1.5rem',
        fontSize: '0.875rem', color: 'var(--text-secondary)'
      }}>
        <span>🗳️ Голосов: <strong style={{ color: 'var(--text-primary)' }}>{poll.total_votes}</strong></span>
        {poll.ends_at && (
          <span>⏰ До: <strong style={{ color: 'var(--text-primary)' }}>
            {new Date(poll.ends_at).toLocaleDateString('ru-RU')}
          </strong></span>
        )}
        {poll.user_voted && (
          <span style={{ color: 'var(--success)' }}>✓ Вы уже голосовали</span>
        )}
      </div>

      {/* Alerts */}
      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      {/* Options */}
      <div style={{ marginBottom: '1.5rem' }}>
        {poll.options.map(opt => {
          const isVoted    = poll.user_vote_option_id === opt.id;
          const isSelected = selected === opt.id;
          const pct        = opt.percentage;

          return (
            <div
              key={opt.id}
              className={`poll-option${isVoted ? ' voted' : ''}`}
              onClick={() => {
                if (!showResults && poll.is_active && user) setSelected(opt.id);
              }}
              style={{
                cursor: showResults || !user || !poll.is_active ? 'default' : 'pointer',
                border: isSelected && !showResults
                  ? '1px solid var(--accent)'
                  : isVoted
                  ? '1px solid var(--success)'
                  : undefined,
                background: isSelected && !showResults ? 'var(--accent-dim)' : undefined,
              }}
            >
              <div className="poll-option-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {!showResults && user && poll.is_active && (
                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => setSelected(opt.id)}
                      style={{ accentColor: 'var(--accent)', flexShrink: 0 }}
                    />
                  )}
                  <span className="poll-option-text">{opt.text}</span>
                  {isVoted && <span style={{ color: 'var(--success)', fontSize: '0.85rem' }}>← ваш голос</span>}
                </div>
                {showResults && (
                  <span className="poll-option-count">{opt.vote_count} / {pct}%</span>
                )}
              </div>

              {showResults && (
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${pct}%`,
                      background: isVoted
                        ? 'var(--success)'
                        : opt.vote_count === maxVotes && opt.vote_count > 0
                        ? 'var(--gradient-accent)'
                        : 'var(--border)'
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      {!showResults && poll.is_active && (
        user ? (
          <button
            className="btn btn-primary btn-lg"
            onClick={handleVote}
            disabled={!selected || voting}
            style={{ width: '100%' }}
          >
            {voting ? '⏳ Голосуем...' : '🗳️ Проголосовать'}
          </button>
        ) : (
          <div className="alert alert-info">
            <Link to="/login">Войдите</Link>, чтобы проголосовать
          </div>
        )
      )}

      {!poll.is_active && (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', paddingTop: '0.5rem', fontSize: '0.9rem' }}>
          Голосование завершено. Показаны итоговые результаты.
        </div>
      )}
    </div>
  );
}
