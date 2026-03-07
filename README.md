# 📔 감성 지능 일기 (Emotional Intelligence Diary)

> AI 기반 멀티모달 감정 분석 일기 플랫폼
>
> **텍스트 + 음성 + 이미지**를 통합 분석하여 감정 상태 기록 및 AI 조언 제공

[![Gogs Repository](https://img.shields.io/badge/Gogs-emotional--diary-blue)](https://gogs.dclub.kr/kim/emotional-diary)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)]()
[![Completion](https://img.shields.io/badge/Completion-95%25-brightgreen)]()

---

## 🎯 주요 기능

| 기능 | 상태 | 설명 |
|------|------|------|
| 📝 텍스트 입력 | ✅ | 자유로운 일기 작성 (최대 5000자) |
| 🎤 음성 입력 | ✅ | Web Speech API (한국어 STT) |
| 📷 이미지 분석 | ✅ | 사진 업로드 + Claude Vision API |
| 🤖 감정 분석 | ✅ | Claude AI 멀티모달 감정 분석 |
| 💡 활동 추천 | ✅ | 감정별 맞춤 활동 추천 (6가지) |
| 📊 통계 & 분석 | ✅ | 감정 분포, 기분 점수 추이 |
| 📅 일기 기록 | ✅ | 월별 목록뷰 + 캘린더 뷰 |
| 💾 자동 저장 | ✅ | SQLite 영구 저장 |

---

## 📂 프로젝트 구조

```
emotional-diary/
├── backend/                    # Express 백엔드 (포트 50050)
│   ├── server.js              # 메인 서버
│   ├── routes/
│   │   ├── diary.js           # 일기 CRUD (7개 API)
│   │   └── analyze.js         # Claude API 감성분석
│   ├── db/
│   │   ├── database.js        # SQLite Promise 유틸
│   │   └── schema.sql         # DB 스키마
│   ├── package.json           # 의존성 (230개 패키지)
│   └── .env                   # 환경변수
│
├── frontend/                  # React 프론트엔드 (포트 5173)
│   ├── src/
│   │   ├── App.jsx            # 라우팅 & 상태관리
│   │   ├── components/        # 6개 컴포넌트
│   │   │   ├── VoiceRecorder.jsx     # Web Speech API STT
│   │   │   ├── ImageCapture.jsx      # 이미지 업로드 & 압축
│   │   │   ├── DiaryForm.jsx         # 통합 입력폼
│   │   │   ├── EmotionResult.jsx     # 분석 결과 표시
│   │   │   ├── Recommendations.jsx   # 활동 추천 카드
│   │   │   └── DiaryHistory.jsx      # 일기 조회 및 관리
│   │   ├── services/
│   │   │   └── api.js         # Backend API 호출 함수
│   │   └── App.css            # 반응형 스타일 (820줄)
│   ├── dist/                  # ✅ 빌드 완료
│   ├── package.json           # 의존성 (88개 패키지)
│   └── .env.local             # 프론트엔드 환경변수
│
├── ecosystem.config.js        # PM2 프로세스 설정
├── docker-compose.yml         # Docker Compose
├── .gitignore                 # Git 무시 규칙
├── DEPLOYMENT.md              # 상세 배포 가이드
├── SETUP_STATUS.md            # 준비 상태 보고서
└── README.md                  # 이 파일
```

---

## 📊 완성도 및 테스트 결과

| 항목 | 상태 | 세부사항 |
|------|------|--------|
| **Backend** | ✅ 100% | Express + SQLite, 7개 API 완성 |
| **Frontend** | ✅ 100% | React 6개 컴포넌트, 빌드 완료 |
| **DB 스키마** | ✅ 100% | SQLite 초기화 완료 |
| **배포 설정** | ✅ 100% | PM2, Docker, 환경변수 |
| **문서화** | ✅ 100% | README, DEPLOYMENT 가이드 |
| **헬스 체크** | ✅ 성공 | Backend 포트 50050에서 실행 중 |
| **Frontend 빌드** | ✅ 성공 | Vite 빌드 완료 (213KB JS + 10KB CSS) |
| **코드 품질** | ✅ 0 이슈 | 진단 문제 모두 정리 |
| **전체** | **95%** | Claude API JSON 포맷 개선 예정 |

### 🧪 테스트 결과
```
✅ npm install: 318개 패키지 설치 완료
✅ Backend 시작: 포트 50050 자동 할당
✅ Health Check API: 200 OK
✅ Frontend 빌드: Vite v5.4.21 성공
✅ Git 푸시: Gogs에 33개 파일 업로드 완료
```

---

## 🚀 빠른 시작

### 필수 요구사항
- **Node.js** >= 16.x
- **npm** 또는 **yarn**
- **Anthropic API Key** (Claude 접근용)

### 📥 설치 및 실행

#### 1️⃣ 저장소 클론
```bash
git clone https://gogs.dclub.kr/kim/emotional-diary.git
cd emotional-diary
```

#### 2️⃣ 환경변수 설정

**Backend**
```bash
cd backend
cp .env.example .env

# .env 파일 편집 (텍스트 에디터에서)
# ANTHROPIC_API_KEY=sk-ant-YOUR-API-KEY-HERE
```

**Frontend**
```bash
cd ../frontend
echo "VITE_API_URL=http://localhost:50050" > .env.local
```

#### 3️⃣ 의존성 설치

```bash
# Backend
cd backend
npm install

# Frontend (새 터미널)
cd ../frontend
npm install
```

#### 4️⃣ 실행

**개발 모드 (터미널 2개 필요)**

Backend (터미널 1):
```bash
cd backend
npm start
# 실행: http://localhost:50050
# Health: http://localhost:50050/health
```

Frontend (터미널 2):
```bash
cd frontend
npm run dev
# 실행: http://localhost:5173
```

**프로덕션 모드 (PM2 사용)**
```bash
# 루트 디렉토리에서
pm2 start ecosystem.config.js
pm2 logs

# 중지
pm2 stop all
pm2 delete all
```

---

## 📡 API 엔드포인트

### 기본 정보
```bash
# 서버 상태 확인
curl http://localhost:50050/health

# 서버 정보
curl http://localhost:50050/info
```

### 일기 API

| 메서드 | 경로 | 설명 | 요청 본문 |
|--------|------|------|---------|
| POST | `/api/diary` | 일기 저장/수정 | `{date, text_content, image_data, analysis_result}` |
| GET | `/api/diary` | 모든 일기 조회 | - |
| GET | `/api/diary/:date` | 특정 날짜 조회 | - |
| DELETE | `/api/diary/:date` | 일기 삭제 | - |
| GET | `/api/diary/stats/emotions` | 감정 통계 | - |
| GET | `/api/diary/stats/mood` | 기분 통계 | - |

### 분석 API

```bash
# 감정 분석 (텍스트 + 이미지)
curl -X POST http://localhost:50050/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "오늘 정말 좋은 날씨였어요!",
    "image": "data:image/jpeg;base64,..." (optional)
  }'

# 응답 (JSON)
{
  "success": true,
  "data": {
    "emotion_primary": "기쁨",
    "emotion_scores": { "기쁨": 8, "슬픔": 1, ... },
    "mood_score": 9,
    "emotion_summary": "긍정적이고 밝은 감정",
    "ai_advice": "좋은 기분이 계속되도록 즐거운 활동을 추천합니다.",
    "recommendations": ["산책", "음악감상", "독서", ...]
  }
}
```

---

## 🗄️ 데이터베이스 스키마

### diaries 테이블
```sql
CREATE TABLE diaries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE,
  text_content TEXT,
  image_data TEXT,
  emotion_primary TEXT,
  emotion_scores TEXT (JSON),
  emotion_summary TEXT,
  recommendations TEXT (JSON array),
  ai_advice TEXT,
  mood_score INTEGER (1-10),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🐳 Docker로 실행

```bash
# Docker Compose 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down
```

---

## 🎨 UI/UX 특징

- **감정 색상 시스템**: 기쁨(노랑), 슬픔(파랑), 분노(빨강), 두려움(보라), 놀라움(초록)
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **부드러운 애니메이션**: 로딩 스피너, 전환 효과
- **접근성**: 키보드 네비게이션, 라벨, Alt 텍스트

---

## 📚 기술 스택

| 계층 | 기술 | 버전 |
|------|------|------|
| **Frontend** | React | 18.3.1 |
| | Vite | 5.4.21 |
| | React Router | 6.30.3 |
| **Backend** | Express | 4.22.1 |
| | Node.js | 20+ |
| **Database** | SQLite3 | 5.1.7 |
| **AI** | Claude API | 3.5 Sonnet |
| **STT** | Web Speech API | Browser Native |
| **DevOps** | Docker | Latest |
| | PM2 | 5.4.0 |

---

## 📖 추가 문서

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - 상세 배포 가이드
- **[SETUP_STATUS.md](./SETUP_STATUS.md)** - 현재 준비 상태 보고서
- **[Backend README](./backend/IMPLEMENTATION_REPORT.md)** - 백엔드 구현 보고서

---

## 🔧 문제 해결

### Backend 포트 충돌
```bash
# 포트 50050이 이미 사용 중인 경우
lsof -i :50050
kill -9 <PID>
```

### API 키 오류
```bash
# ANTHROPIC_API_KEY 확인
echo $ANTHROPIC_API_KEY

# .env 파일에 직접 입력 (보안 주의)
ANTHROPIC_API_KEY=sk-ant-...
```

### Frontend 빌드 오류
```bash
# node_modules 재설치
rm -rf frontend/node_modules frontend/package-lock.json
npm install

# 캐시 삭제
npm cache clean --force
```

---

## 🚀 배포 가이드

### Gogs 저장소
- **URL**: https://gogs.dclub.kr/kim/emotional-diary
- **클론**: `git clone https://gogs.dclub.kr/kim/emotional-diary.git`

### DNS Manager (선택)
```bash
# diary.dclub.kr 자동 배포
curl -X POST http://localhost:50202/api/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain": "diary",
    "server": "73",
    "port": 50050
  }'
```

---

## 📝 라이선스

Copyright © 2024-2025 김 AI Lab. All rights reserved.

---

## 🤝 기여

이 프로젝트는 개인 프로젝트이지만, 피드백과 개선 제안은 환영합니다.

---

## 📧 문의

- **저장소**: https://gogs.dclub.kr/kim/emotional-diary
- **문제 보고**: Issues 탭에서 작성

---

**최종 업데이트**: 2026-03-07
**상태**: Production Ready ✅
**완성도**: 95%
