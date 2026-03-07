const EMOTION_CONFIG = {
  joy: {
    icon: '😊',
    color: '#FFD700',
    label: '기쁨',
    bgColor: '#FFF9E6'
  },
  sadness: {
    icon: '😢',
    color: '#4169E1',
    label: '슬픔',
    bgColor: '#E6F0FF'
  },
  anger: {
    icon: '😠',
    color: '#FF4500',
    label: '분노',
    bgColor: '#FFE6E6'
  },
  fear: {
    icon: '😨',
    color: '#9370DB',
    label: '두려움',
    bgColor: '#F3E6FF'
  },
  surprise: {
    icon: '😲',
    color: '#32CD32',
    label: '놀라움',
    bgColor: '#E6FFE6'
  },
  neutral: {
    icon: '😐',
    color: '#808080',
    label: '중립',
    bgColor: '#F5F5F5'
  }
}

const EmotionResult = ({ emotion, score, advice, icon }) => {
  const emotionKey = emotion?.toLowerCase() || 'neutral'
  const config = EMOTION_CONFIG[emotionKey] || EMOTION_CONFIG.neutral
  const displayIcon = icon || config.icon
  const displayScore = (score || 0) * 100

  return (
    <div
      className="emotion-result"
      style={{ backgroundColor: config.bgColor }}
    >
      <div className="emotion-header">
        <span className="emotion-icon" style={{ fontSize: '4rem' }}>
          {displayIcon}
        </span>
        <div className="emotion-info">
          <h2>{config.label}</h2>
          <p>{emotionKey}</p>
        </div>
      </div>

      <div className="emotion-metrics">
        <div className="metric">
          <label>감정 강도</label>
          <div className="score-bar-large">
            <div
              className="score-fill"
              style={{
                width: `${displayScore}%`,
                backgroundColor: config.color
              }}
            >
              <span className="score-text">{displayScore.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {advice && (
        <div className="advice-section">
          <h3>💡 AI 조언</h3>
          <p>{advice}</p>
        </div>
      )}

      <div className="emotion-meanings">
        <h4>감정의 의미</h4>
        <p>
          {emotionKey === 'joy' && '긍정적인 감정입니다. 이 기분을 유지하고 공유하세요.'}
          {emotionKey === 'sadness' && '힘든 시간입니다. 자신을 위로하고 필요하면 도움을 청하세요.'}
          {emotionKey === 'anger' && '강한 감정입니다. 깊게 숨을 쉬고 차분해질 때까지 기다리세요.'}
          {emotionKey === 'fear' && '불안감을 느끼고 있습니다. 작은 단계부터 시작하세요.'}
          {emotionKey === 'surprise' && '예상치 못한 상황입니다. 새로운 관점을 받아들이세요.'}
          {emotionKey === 'neutral' && '평온한 상태입니다. 안정적인 감정 상태를 유지하세요.'}
        </p>
      </div>
    </div>
  )
}

export default EmotionResult
