import { useState, useEffect } from 'react'
import { getDiaries, deleteDiary } from '../services/api'

const DiaryHistory = () => {
  const [diaries, setDiaries] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState('list') // list or calendar

  useEffect(() => {
    fetchDiaries()
  }, [selectedMonth])

  const fetchDiaries = async () => {
    try {
      setError(null)
      setIsLoading(true)
      const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1)
      const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0)

      const result = await getDiaries({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })
      setDiaries(result.data || [])
    } catch (err) {
      setError(err.message || '일기 조회 실패')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return

    try {
      await deleteDiary(id)
      setDiaries(diaries.filter(diary => diary._id !== id))
    } catch (err) {
      setError(err.message || '삭제 실패')
    }
  }

  const previousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const EMOTION_ICONS = {
    joy: '😊',
    sadness: '😢',
    anger: '😠',
    fear: '😨',
    surprise: '😲',
    neutral: '😐'
  }

  if (isLoading) {
    return (
      <div className="diary-history loading">
        <div className="spinner"></div>
        <p>일기를 불러오는 중입니다...</p>
      </div>
    )
  }

  return (
    <div className="diary-history">
      <div className="history-header">
        <h2>일기 기록</h2>
        <div className="view-mode-toggle">
          <button
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'active' : ''}
          >
            📝 목록
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={viewMode === 'calendar' ? 'active' : ''}
          >
            📅 캘린더
          </button>
        </div>
      </div>

      <div className="month-selector">
        <button onClick={previousMonth} className="btn btn-small">◀</button>
        <h3>
          {selectedMonth.getFullYear()}년 {selectedMonth.getMonth() + 1}월
        </h3>
        <button onClick={nextMonth} className="btn btn-small">▶</button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {diaries.length === 0 ? (
        <div className="empty-state">
          <p>이 기간에 작성한 일기가 없습니다.</p>
        </div>
      ) : (
        <div className={`diary-view diary-${viewMode}`}>
          {viewMode === 'list' ? (
            <div className="diary-list">
              {diaries.map((diary) => (
                <div key={diary._id} className="diary-item">
                  <div className="diary-header">
                    <div className="diary-emotion">
                      <span className="emotion-icon">
                        {EMOTION_ICONS[diary.emotion?.toLowerCase()] || '😐'}
                      </span>
                      <span className="emotion-label">{diary.emotion}</span>
                    </div>
                    <span className="diary-date">{formatDate(diary.createdAt)}</span>
                  </div>

                  <div className="diary-content">
                    <p className="diary-text">{diary.text.substring(0, 150)}...</p>
                    {diary.image && (
                      <div className="diary-thumbnail">
                        <img src={diary.image} alt="diary" />
                      </div>
                    )}
                  </div>

                  {diary.score && (
                    <div className="diary-score">
                      <div className="score-bar">
                        <div
                          className="score-fill"
                          style={{ width: `${diary.score * 100}%` }}
                        ></div>
                      </div>
                      <span>{(diary.score * 100).toFixed(0)}%</span>
                    </div>
                  )}

                  <div className="diary-actions">
                    <button className="btn btn-small btn-info">👁️ 보기</button>
                    <button
                      onClick={() => handleDelete(diary._id)}
                      className="btn btn-small btn-danger"
                    >
                      🗑️ 삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="diary-calendar">
              <p>캘린더 보기 (개발 중)</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DiaryHistory
