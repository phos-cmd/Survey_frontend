import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function SurveyResult() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const { id }    = useParams();

  const result = state?.result;

  if (!result) {
    return (
      <div className="page fade-in" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤔</div>
        <h2>Результаты не найдены</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Пройдите опрос, чтобы увидеть результаты.
        </p>
        <Link to="/" className="btn btn-primary">На главную</Link>
      </div>
    );
  }

  const { top_skills = [], survey, message } = result;

  const confettiColors = ['🎊', '🎉', '✨', '🌟', '🎈'];
  const randomConfetti = confettiColors[Math.floor(Math.random() * confettiColors.length)];

  return (
    <div className="page fade-in" style={{ maxWidth: 600, textAlign: 'center' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem', animation: 'fadeIn 0.5s ease' }}>
        {randomConfetti}
      </div>
      <h1 style={{ marginBottom: '0.4rem' }}>Опрос завершён!</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
        «{survey}» — ваши результаты готовы
      </p>

      {top_skills.length > 0 ? (
        <>
          <h2 style={{ marginBottom: '1.25rem', fontSize: '1.3rem' }}>
            🏆 Ваш топ-3 навыков
          </h2>
          <div style={{ marginBottom: '2.5rem' }}>
            {top_skills.map((item, idx) => (
              <div key={idx} className="skill-medal" style={{
                animation: `fadeIn ${0.3 + idx * 0.15}s ease forwards`,
                opacity: 0,
                animationFillMode: 'forwards'
              }}>
                <span className="skill-medal-emoji">{item.medal}</span>
                <div>
                  <div className="skill-medal-name">{item.skill}</div>
                  <div className="skill-medal-score">Очков: {item.score}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          marginBottom: '2.5rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
          <p>Ответы успешно записаны!</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            В этом опросе нет навыков для анализа.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-outline btn-lg">
          ← К опросам
        </Link>
        <Link to="/polls" className="btn btn-primary btn-lg">
          🗳️ Голосования
        </Link>
      </div>
    </div>
  );
}
