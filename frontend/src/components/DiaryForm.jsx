import { useState } from 'react'
import VoiceRecorder from './VoiceRecorder'
import ImageCapture from './ImageCapture'
import { analyzeEntry, saveDiary } from '../services/api'

const DiaryForm = ({ onSuccess }) => {
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [error, setError] = useState(null)
  const [step, setStep] = useState('input') // input, analyzing, result

  const handleVoiceTranscript = (transcript) => {
    setText(prev => prev + (prev ? ' ' : '') + transcript)
  }

  const handleImageSelect = (base64) => {
    setImage(base64)
  }

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('일기 내용을 입력해주세요.')
      return
    }

    try {
      setError(null)
      setIsLoading(true)
      setStep('analyzing')

      const result = await analyzeEntry(text, image)
      setAnalysisResult(result)
      setStep('result')
    } catch (err) {
      setError(err.message || '분석 중 오류가 발생했습니다.')
      setStep('input')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setError(null)
      setIsLoading(true)

      const diaryData = {
        text,
        image,
        emotion: analysisResult?.emotion,
        score: analysisResult?.score,
        advice: analysisResult?.advice,
        analyzedAt: new Date().toISOString()
      }

      await saveDiary(diaryData)
      onSuccess?.()

      // 초기화
      setText('')
      setImage(null)
      setAnalysisResult(null)
      setStep('input')
    } catch (err) {
      setError(err.message || '저장 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setText('')
    setImage(null)
    setAnalysisResult(null)
    setStep('input')
    setError(null)
  }

  if (step === 'analyzing') {
    return (
      <div className="diary-form analyzing">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>감정을 분석 중입니다...</p>
        </div>
      </div>
    )
  }

  if (step === 'result' && analysisResult) {
    return (
      <div className="diary-form result">
        <div className="analysis-result">
          <h2>분석 결과</h2>
          <div className="emotion-display">
            <div className="emotion-icon">
              {analysisResult.emotion_icon || '😊'}
            </div>
            <h3>{analysisResult.emotion}</h3>
            <div className="emotion-score">
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${(analysisResult.score || 0) * 100}%`,
                    backgroundColor: analysisResult.color
                  }}
                ></div>
              </div>
              <span>{((analysisResult.score || 0) * 100).toFixed(0)}%</span>
            </div>
          </div>

          {analysisResult.advice && (
            <div className="advice-box">
              <h4>💡 조언</h4>
              <p>{analysisResult.advice}</p>
            </div>
          )}

          <div className="form-actions">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="btn btn-primary"
            >
              💾 저장
            </button>
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="btn btn-secondary"
            >
              🔄 다시 입력
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="diary-form">
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      <div className="form-section">
        <h2>일기 작성</h2>

        <div className="input-group">
          <h3>텍스트 입력</h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="오늘의 감정과 생각을 자유롭게 입력하세요..."
            className="diary-textarea"
            rows="8"
          />
          <div className="char-count">
            {text.length} / 5000
          </div>
        </div>

        <div className="input-group">
          <h3>음성 입력</h3>
          <VoiceRecorder
            onTranscript={handleVoiceTranscript}
            onError={(err) => setError(`음성 인식 오류: ${err}`)}
          />
        </div>

        <div className="input-group">
          <h3>사진 추가</h3>
          <ImageCapture
            onImageSelect={handleImageSelect}
            onError={(err) => setError(err)}
          />
        </div>

        <div className="form-actions">
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !text.trim()}
            className="btn btn-primary btn-large"
          >
            🔍 감정 분석
          </button>
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="btn btn-secondary"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  )
}

export default DiaryForm
