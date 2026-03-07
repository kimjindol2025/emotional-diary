import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import DiaryForm from './components/DiaryForm'
import DiaryHistory from './components/DiaryHistory'
import Recommendations from './components/Recommendations'

function App() {
  const [successMessage, setSuccessMessage] = useState(null)
  const [currentEmotion, _setCurrentEmotion] = useState(null)

  const handleDiarySaved = () => {
    setSuccessMessage('일기가 저장되었습니다! 🎉')
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <Link to="/" className="logo">
              <span className="logo-icon">📔</span>
              <span className="logo-text">감정 지능 일기</span>
            </Link>
            <nav className="nav-menu">
              <Link to="/" className="nav-link">작성</Link>
              <Link to="/history" className="nav-link">기록</Link>
            </nav>
          </div>
        </header>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={
                <div className="home-page">
                  <section className="diary-section">
                    <DiaryForm onSuccess={handleDiarySaved} />
                  </section>
                  {currentEmotion && (
                    <section className="recommendations-section">
                      <Recommendations emotion={currentEmotion} />
                    </section>
                  )}
                </div>
              }
            />
            <Route
              path="/history"
              element={
                <div className="history-page">
                  <DiaryHistory />
                </div>
              }
            />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>© 2024 감정 지능 일기 | AI 기반 감정 분석 서비스</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
