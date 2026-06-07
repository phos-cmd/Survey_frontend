import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { surveyAPI } from '../services/api';

export default function SurveyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [survey,  setSurvey]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [answers, setAnswers] = useState({});
  const [step,    setStep]    = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    surveyAPI.detail(id)
      .then(r => setSurvey(r.data))
      .catch(() => setError('Опрос не найден'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSelect = (questionId, optionId, type) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (type === 'single') {
        return { ...prev, [questionId]: [optionId] };
      }
      if (current.includes(optionId)) {
        return { ...prev, [questionId]: current.filter(x => x !== optionId) };
      }
      return { ...prev, [questionId]: [...current, optionId] };
    });
  };

  const handleTextChange = (questionId, text) => {
    const maxLength = 2000;
    if (text.length <= maxLength) {
      setAnswers(prev => ({ ...prev, [`text_${questionId}`]: text }));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        answers: survey.questions.map(q => ({
          question_id: q.id,
          selected_option_ids: answers[q.id] || [],
          text_answer: answers[`text_${q.id}`] || '',
        }))
      };
      const res = await surveyAPI.submit(id, payload);
      navigate(`/surveys/${id}/result`, { state: { result: res.data } });
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Ошибка при отправке ответов. Попробуйте снова.';
      setError(errorMsg);
      console.error('Survey submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (error)   return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!survey) return null;

  if (!survey.is_active) {
    return (
      <div className="page" style={{ maxWidth: 680, textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏻</div>
        <h2>Опрос завершен</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Этот опрос больше не доступен для заполнения.
        </p>
        <a href="/" className="btn btn-primary">← На главную</a>
      </div>
    );
  }

  const questions  = survey.questions || [];
  const total      = questions.length;
  const currentQ   = questions[step];
  const answered   = Object.keys(answers).filter(k => !k.startsWith('text_') && answers[k]?.length > 0).length;

  return (
    <div className="page fade-in" style={{ maxWidth: 680 }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.4rem' }}>{survey.title}</h1>
        {survey.description && (
          <p style={{ color: 'var(--text-secondary)' }}>{survey.description}</p>
        )}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <span>Вопрос {step + 1} из {total}</span>
        <span>{answered} отвечено</span>
      </div>
      <div className="progress-bar" style={{ marginBottom: '1rem' }}>
        <div className="progress-fill" style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>

      {/* Step dots */}
      <div className="step-bar" style={{ marginBottom: '2rem' }}>
        {questions.map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < total - 1 ? '1' : 'none', gap: '0.5rem' }}>
            <div
              className={`step-dot${i === step ? ' active' : i < step ? ' done' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setStep(i)}
            />
            {i < total - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      {/* Question card */}
      {currentQ && (
        <div className="card" style={{ cursor: 'default' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <span style={{
              background: 'var(--accent-dim)', color: 'var(--accent)',
              borderRadius: '50%', width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
            }}>{step + 1}</span>
            <h3 style={{ paddingTop: '0.15rem' }}>{currentQ.text}</h3>
          </div>

          {currentQ.question_type === 'text' ? (
            <>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Введите ваш ответ..."
                value={answers[`text_${currentQ.id}`] || ''}
                onChange={e => handleTextChange(currentQ.id, e.target.value)}
                maxLength={2000}
                style={{ resize: 'vertical' }}
              />
              <div style={{ 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)', 
                marginTop: '0.5rem',
                textAlign: 'right'
              }}>
                {(answers[`text_${currentQ.id}`] || '').length} / 2000
              </div>
            </>
          ) : (
            <div>
              {currentQ.question_type === 'multiple' && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                  Можно выбрать несколько вариантов
                </p>
              )}
              {currentQ.options.map(opt => {
                const isSelected = (answers[currentQ.id] || []).includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    className={`option-item${isSelected ? ' selected' : ''}`}
                    onClick={() => handleSelect(currentQ.id, opt.id, currentQ.question_type)}
                  >
                    <input
                      type={currentQ.question_type === 'single' ? 'radio' : 'checkbox'}
                      checked={isSelected}
                      onChange={() => {}}
                    />
                    <span>{opt.text}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', gap: '1rem' }}>
        <button
          className="btn btn-ghost"
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
        >
          ← Назад
        </button>

        {step < total - 1 ? (
          <button
            className="btn btn-primary"
            onClick={() => setStep(s => s + 1)}
          >
            Далее →
          </button>
        ) : (
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '⏳ Отправка...' : '✅ Завершить опрос'}
          </button>
        )}
      </div>

      {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>}
    </div>
  );
}
