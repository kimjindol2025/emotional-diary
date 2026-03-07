const RECOMMENDATIONS = {
  joy: [
    { icon: '🎉', title: '축하합니다', description: '긍정적인 감정을 주변 사람과 나누세요' },
    { icon: '📸', title: '순간 기록', description: '이 행복한 순간을 사진으로 남기세요' },
    { icon: '🙏', title: '감사 표현', description: '당신을 행복하게 해준 것들에 감사하세요' }
  ],
  sadness: [
    { icon: '🤗', title: '자기 돌봄', description: '충분한 휴식과 편안함을 가져보세요' },
    { icon: '👥', title: '사람과의 연결', description: '신뢰하는 사람과 대화하세요' },
    { icon: '🌿', title: '자연 산책', description: '신선한 공기를 마시며 산책해보세요' }
  ],
  anger: [
    { icon: '🧘', title: '명상', description: '깊은 호흡으로 마음을 진정하세요' },
    { icon: '💪', title: '운동', description: '에너지를 건강하게 발산해보세요' },
    { icon: '📝', title: '감정 쓰기', description: '감정을 종이에 써서 표현하세요' }
  ],
  fear: [
    { icon: '📋', title: '계획 세우기', description: '구체적인 계획을 세워 불안감을 줄이세요' },
    { icon: '👂', title: '조언 구하기', description: '신뢰할 수 있는 사람에게 이야기하세요' },
    { icon: '✨', title: '긍정 확언', description: '자신을 격려하는 말을 반복하세요' }
  ],
  surprise: [
    { icon: '🔍', title: '이해하기', description: '새로운 상황을 차분히 분석해보세요' },
    { icon: '💭', title: '성찰', description: '이 경험이 의미하는 바를 생각해보세요' },
    { icon: '🚀', title: '기회 포착', description: '새로운 가능성을 탐색해보세요' }
  ],
  neutral: [
    { icon: '🎯', title: '목표 설정', description: '오늘의 작은 목표를 정해보세요' },
    { icon: '🌱', title: '성장 활동', description: '새로운 것을 배워보세요' },
    { icon: '🎨', title: '창의적 활동', description: '취미 활동을 즐겨보세요' }
  ]
}

const Recommendations = ({ emotion }) => {
  const emotionKey = emotion?.toLowerCase() || 'neutral'
  const recommendations = RECOMMENDATIONS[emotionKey] || RECOMMENDATIONS.neutral

  return (
    <div className="recommendations">
      <h2>추천 활동</h2>
      <div className="recommendations-grid">
        {recommendations.map((rec, index) => (
          <div key={index} className="recommendation-card">
            <div className="rec-icon">{rec.icon}</div>
            <h3>{rec.title}</h3>
            <p>{rec.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Recommendations
