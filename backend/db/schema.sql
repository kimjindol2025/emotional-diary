-- 감성 일기 테이블
CREATE TABLE IF NOT EXISTS diaries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE,
  text_content TEXT NOT NULL,
  image_data TEXT,
  emotion_primary TEXT,
  emotion_scores TEXT,
  emotion_summary TEXT,
  recommendations TEXT,
  ai_advice TEXT,
  mood_score INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_diaries_date ON diaries(date);
CREATE INDEX IF NOT EXISTS idx_diaries_emotion ON diaries(emotion_primary);
CREATE INDEX IF NOT EXISTS idx_diaries_created_at ON diaries(created_at);
