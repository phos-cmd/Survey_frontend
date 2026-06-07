import { Routes, Route } from 'react-router-dom';
import Navbar      from './components/Navbar';
import Home        from './pages/Home';
import SurveyDetail from './pages/SurveyDetail';
import SurveyResult from './pages/SurveyResult';
import PollList    from './pages/PollList';
import PollDetail  from './pages/PollDetail';
import Login       from './pages/Login';
import Register    from './pages/Register';

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"                       element={<Home />} />
          <Route path="/surveys/:id"            element={<SurveyDetail />} />
          <Route path="/surveys/:id/result"     element={<SurveyResult />} />
          <Route path="/polls"                  element={<PollList />} />
          <Route path="/polls/:id"              element={<PollDetail />} />
          <Route path="/login"                  element={<Login />} />
          <Route path="/register"               element={<Register />} />
          <Route path="*"                       element={
            <div className="page" style={{ textAlign: 'center', paddingTop: '5rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</div>
              <h2>Страница не найдена</h2>
              <a href="/" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                На главную
              </a>
            </div>
          } />
        </Routes>
      </main>
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '1.25rem 1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.82rem'
      }}>
        © {new Date().getFullYear()} SurveyProject — Опросы &amp; Голосования
      </footer>
    </>
  );
}
