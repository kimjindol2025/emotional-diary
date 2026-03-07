# 감성 지능 일기 (Emotional Intelligence Diary)

감정 분석 AI를 탑재한 일기 작성 및 분석 플랫폼입니다. Claude AI를 활용하여 감정 분석, 심리 상담 조언, 패턴 분석을 제공합니다.

## 📋 프로젝트 구조

```
emotional-diary/
├── backend/
│   ├── server.js              # Express 메인 서버
│   ├── routes/                # API 라우트
│   ├── db/                    # SQLite 데이터베이스
│   ├── package.json
│   ├── .env                   # 환경변수 (git 무시)
│   ├── .env.example           # 환경변수 템플릿
│   └── Dockerfile             # Docker 빌드 설정
├── frontend/
│   ├── src/
│   │   ├── components/        # React 컴포넌트
│   │   ├── pages/            # 페이지 컴포넌트
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.local            # 프론트엔드 환경변수
│   └── Dockerfile
├── ecosystem.config.js         # PM2 설정
├── docker-compose.yml          # Docker Compose
├── .gitignore
└── README.md
```

## 🚀 빠른 시작

### 필수 요구사항
- Node.js >= 16.x
- npm 또는 yarn
- Anthropic API Key (Claude 접근용)

### 1️⃣ 로컬 개발 환경 설정

#### 1-1. 저장소 클론
```bash
cd /home/kimjin/Desktop/kim/
git clone https://gogs.dclub.kr/kim/emotional-diary.git
cd emotional-diary
```

#### 1-2. 환경변수 설정

**백엔드**:
```bash
# backend/.env 파일 편집
export ANTHROPIC_API_KEY="your-api-key-here"
# 또는 backend/.env에 직접 입력
ANTHROPIC_API_KEY=sk-ant-...
```

**프론트엔드**:
```bash
# frontend/.env.local 파일 확인 (이미 설정됨)
VITE_API_URL=http://localhost:50050
```

#### 1-3. 의존성 설치
```bash
# 백엔드
cd backend
npm install

# 프론트엔드
cd ../frontend
npm install
```

### 2️⃣ 로컬 실행 (개발 모드)

**옵션 A: 터미널 분리 실행**

백엔드:
```bash
cd backend
npm start
# 실행: http://localhost:50050
```

프론트엔드 (다른 터미널):
```bash
cd frontend
npm run dev
# 실행: http://localhost:5173
```

**옵션 B: PM2를 사용한 통합 실행**
```bash
# 루트 디렉토리에서
pm2 start ecosystem.config.js
pm2 logs

# 중지
pm2 stop all
pm2 delete all
```

### 3️⃣ API 엔드포인트

#### 기본 정보
```bash
# 서버 상태 확인
curl http://localhost:50050/health

# 서버 정보
curl http://localhost:50050/api/info
```

#### 일기 작성
```bash
# 새 일기 작성
curl -X POST http://localhost:50050/api/diary \
  -H "Content-Type: application/json" \
  -d '{
    "title": "오늘의 감정",
    "content": "오늘은 기쁜 날이었다...",
    "mood": "happy"
  }'
```

#### 일기 조회
```bash
# 모든 일기 조회
curl http://localhost:50050/api/diary

# 특정 일기 조회
curl http://localhost:50050/api/diary/:id

# 감정별 조회
curl http://localhost:50050/api/diary?mood=happy
```

#### 감정 분석
```bash
# AI 감정 분석 요청
curl -X POST http://localhost:50050/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "diaryId": 1,
    "content": "오늘은 매우 불안했다..."
  }'
```

## 🐳 Docker 배포

### Docker Compose 실행
```bash
# 서비스 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 서비스 중지
docker-compose down
```

### 개별 Docker 빌드
```bash
# 백엔드
cd backend
docker build -t emotional-diary-backend:latest .
docker run -d -p 50050:50050 --name diary-backend emotional-diary-backend

# 프론트엔드
cd frontend
docker build -t emotional-diary-frontend:latest .
docker run -d -p 3000:80 --name diary-frontend emotional-diary-frontend
```

## 📦 PM2 배포

### PM2 시작
```bash
# 루트 디렉토리에서
pm2 start ecosystem.config.js --name emotional-diary

# 상태 확인
pm2 status

# 로그 보기
pm2 logs emotional-diary-backend
pm2 logs emotional-diary-frontend
```

### PM2 관리
```bash
# 재시작
pm2 restart emotional-diary-backend

# 중지
pm2 stop emotional-diary-backend

# 삭제
pm2 delete emotional-diary-backend

# 부팅시 자동 시작 설정
pm2 startup
pm2 save
```

## 🌐 프로덕션 배포

### DNS Manager 자동 배포
```bash
# 도메인 자동 할당 및 배포
curl -X POST http://127.0.0.1:50000/api/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain": "diary",
    "server": "253",
    "port": 50050
  }'
```

결과: `diary.dclub.kr` 자동 생성

### Gogs 저장소 연동
```bash
# 코드 푸시
git add .
git commit -m "배포 설정 완료"
git push origin main

# Webhook이 자동으로 재시작함
```

## 📊 데이터베이스 스키마

### diary (일기 테이블)
```sql
CREATE TABLE IF NOT EXISTS diary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  sentiment REAL,
  analysis TEXT
);
```

### analysis (분석 결과 테이블)
```sql
CREATE TABLE IF NOT EXISTS analysis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  diary_id INTEGER NOT NULL,
  emotion TEXT,
  confidence REAL,
  suggestions TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (diary_id) REFERENCES diary(id)
);
```

## 🔑 환경변수 설정

### 백엔드 (.env)
```
ANTHROPIC_API_KEY=sk-ant-...          # Claude API 키
PORT=50050                            # 서버 포트
DB_PATH=./db/diary.sqlite            # 데이터베이스 경로
CORS_ORIGIN=http://localhost:5173    # CORS 허용 도메인
NODE_ENV=development                 # 환경 (development/production)
LOG_LEVEL=info                       # 로그 레벨
```

### 프론트엔드 (.env.local)
```
VITE_API_URL=http://localhost:50050  # 백엔드 API URL
VITE_ENV=development                 # 환경
```

## 🛡️ 보안 주의사항

1. **API 키**: `.env` 파일은 절대 Gogs에 푸시하지 마세요 (.gitignore 설정됨)
2. **데이터베이스**: `*.sqlite` 파일도 .gitignore에 포함됨
3. **HTTPS**: 프로덕션에서는 반드시 HTTPS 사용
4. **CORS**: 신뢰할 수 있는 도메인만 허용

## 🧪 테스트

```bash
# 백엔드 테스트 (jest 설정 시)
cd backend
npm test

# 프론트엔드 테스트 (vitest 설정 시)
cd frontend
npm test
```

## 📖 API 문서

자세한 API 문서는 `/docs/API.md` 참고

## 🐛 문제 해결

### 포트 이미 사용 중
```bash
# 포트 확인
lsof -i :50050

# 프로세스 종료
kill -9 <PID>

# PM2로 관리하면 자동 재시작
pm2 restart emotional-diary-backend
```

### 데이터베이스 오류
```bash
# 데이터베이스 초기화 (주의!)
rm backend/db/diary.sqlite

# 서버 재시작 시 자동 생성됨
npm start
```

### CORS 오류
```bash
# frontend/.env.local과 backend/.env의 CORS_ORIGIN 확인
# 도메인이 일치하는지 확인
```

## 🔄 CI/CD 파이프라인

Gogs Webhook이 자동으로:
1. 코드 푸시 감지
2. npm install 실행
3. 빌드 수행
4. PM2 재시작

## 📝 커밋 컨벤션

```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 스타일 (기능 변경 없음)
refactor: 리팩토링
test: 테스트 추가
chore: 빌드, 의존성 등
```

## 👥 기여

1. 브랜치 생성: `git checkout -b feature/기능명`
2. 커밋: `git commit -m "feat: 기능 설명"`
3. 푸시: `git push origin feature/기능명`
4. PR 생성

## 📄 라이선스

MIT License

## 📞 지원

문제나 질문: https://gogs.dclub.kr/kim/emotional-diary/issues

---

**마지막 업데이트**: 2026-03-07
**상태**: 배포 준비 완료 ✅
