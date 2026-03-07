# 배포 가이드 (Emotional Intelligence Diary)

## 📋 배포 체크리스트

- [ ] 환경변수 설정 (.env 파일)
- [ ] API 키 보안 확인
- [ ] Gogs 저장소 생성
- [ ] DNS Manager에 도메인 할당
- [ ] PM2 또는 Docker 배포
- [ ] HTTPS 인증서 설정
- [ ] 헬스 체크 확인

---

## 1️⃣ 환경 준비

### 1-1. 환경변수 설정

**백엔드 (.env)**
```bash
cd /home/kimjin/Desktop/kim/emotional-diary/backend

# .env 파일 생성 (이미 생성됨)
cat > .env << EOF
ANTHROPIC_API_KEY=sk-ant-YOUR-KEY-HERE
PORT=50050
DB_PATH=./db/diary.sqlite
CORS_ORIGIN=http://localhost:5173,http://diary.dclub.kr,https://diary.dclub.kr
NODE_ENV=development
LOG_LEVEL=info
EOF

# 실제 API 키 설정
# ~/.anthropic_token 파일에서 읽기 또는 환경변수 설정
export ANTHROPIC_API_KEY=$(cat ~/.anthropic_token 2>/dev/null || echo "")
```

### 1-2. 의존성 설치
```bash
cd /home/kimjin/Desktop/kim/emotional-diary

# 백엔드
cd backend && npm install && cd ..

# 프론트엔드
cd frontend && npm install && cd ..
```

---

## 2️⃣ 로컬 테스트

### 2-1. 백엔드 테스트
```bash
cd backend
npm start
# 출력: Server running on port 50050
# 테스트: curl http://localhost:50050/health
```

### 2-2. 프론트엔드 테스트
```bash
cd frontend
npm run dev
# 출력: Local: http://localhost:5173
```

---

## 3️⃣ PM2 배포 (권장)

### 3-1. PM2 설치 및 설정
```bash
# PM2 설치 (이미 설치된 경우 생략)
npm install -g pm2

# 루트 디렉토리에서 PM2 시작
cd /home/kimjin/Desktop/kim/emotional-diary
pm2 start ecosystem.config.js --name emotional-diary

# 상태 확인
pm2 status
pm2 logs emotional-diary-backend

# 부팅 시 자동 시작 (선택)
pm2 startup
pm2 save
```

### 3-2. PM2 관리
```bash
# 재시작
pm2 restart emotional-diary-backend

# 중지
pm2 stop emotional-diary-backend

# 로그 확인
pm2 logs emotional-diary-backend -f

# 모니터링
pm2 monit
```

---

## 4️⃣ Docker 배포

### 4-1. Docker Compose 실행
```bash
cd /home/kimjin/Desktop/kim/emotional-diary

# 서비스 시작
docker-compose up -d

# 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f backend

# 서비스 중지
docker-compose down
```

### 4-2. Docker 명령어
```bash
# 백엔드 이미지 빌드
docker build -t emotional-diary-backend:latest ./backend

# 백엔드 컨테이너 실행
docker run -d \
  --name diary-backend \
  -p 50050:50050 \
  -e ANTHROPIC_API_KEY="your-key" \
  -v $(pwd)/backend/db:/app/db \
  -v $(pwd)/backend/logs:/app/logs \
  emotional-diary-backend:latest

# 프론트엔드 이미지 빌드
docker build -t emotional-diary-frontend:latest ./frontend

# 프론트엔드 컨테이너 실행
docker run -d \
  --name diary-frontend \
  -p 3000:80 \
  emotional-diary-frontend:latest

# 정지 및 제거
docker stop diary-backend diary-frontend
docker rm diary-backend diary-frontend
```

---

## 5️⃣ DNS Manager 배포

### 5-1. Gogs 저장소 생성

```bash
# Gogs에 저장소 생성
curl -X POST "https://gogs.dclub.kr/api/v1/user/repos" \
  -H "Authorization: token $GOGS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "emotional-diary",
    "description": "감성 지능 일기 플랫폼",
    "private": false,
    "auto_init": true
  }'

# 또는 웹 UI에서 수동으로 생성
# https://gogs.dclub.kr/user/repos/new
```

### 5-2. 코드 푸시
```bash
cd /home/kimjin/Desktop/kim/emotional-diary

# Git 저장소 초기화 (또는 기존 저장소)
git init
git remote add origin https://gogs.dclub.kr/kim/emotional-diary.git
git add .
git commit -m "초기 커밋: 배포 설정 완료"
git push -u origin main
```

### 5-3. DNS Manager에서 도메인 배포
```bash
# 자동 배포 API
curl -X POST http://127.0.0.1:50202/api/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain": "diary",
    "server": "253",
    "port": 50050
  }'

# 응답 예시:
# {
#   "success": true,
#   "url": "https://diary.dclub.kr",
#   "config": {
#     "proxy_pass": "http://localhost:50050",
#     "ssl_enabled": true
#   }
# }
```

결과: `diary.dclub.kr` 자동 생성 및 HTTPS 적용

### 5-4. Webhook 설정 (자동 재배포)

Gogs 저장소 설정:
1. https://gogs.dclub.kr/kim/emotional-diary/settings/hooks
2. **웹훅 추가** 클릭
3. **Payload URL**: `http://192.168.45.73:50000/api/webhook`
4. **이벤트**: Push, Pull Request
5. **저장**

이제 코드 푸시 시 자동으로 재배포됨.

---

## 6️⃣ HTTPS 설정 (프로덕션)

### 6-1. SSL 인증서 (Let's Encrypt)
```bash
# Certbot 설치 (이미 설치된 경우 생략)
sudo apt install certbot python3-certbot-nginx -y

# 인증서 생성
sudo certbot certonly --manual -d diary.dclub.kr

# 또는 DNS 관리자가 자동으로 설정
# diary.dclub.kr은 DNS Manager에서 HTTPS 자동 적용됨
```

### 6-2. Nginx HTTPS 리다이렉트
```bash
# /etc/nginx/sites-available/diary.dclub.kr 설정
server {
  listen 80;
  server_name diary.dclub.kr;
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl;
  server_name diary.dclub.kr;

  ssl_certificate /etc/letsencrypt/live/diary.dclub.kr/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/diary.dclub.kr/privkey.pem;

  location / {
    proxy_pass http://localhost:50050;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
  }
}
```

---

## 7️⃣ 헬스 체크 및 모니터링

### 7-1. 기본 헬스 체크
```bash
# 백엔드
curl -i http://localhost:50050/health
# 200 OK: {"status":"ok"}

# 프론트엔드
curl -i http://localhost:3000/health
# 200 OK: healthy

# Gogs 배포 후
curl -i https://diary.dclub.kr/health
```

### 7-2. PM2 모니터링
```bash
# PM2 상태
pm2 status

# 상세 로그
pm2 logs emotional-diary-backend

# 실시간 모니터링
pm2 monit

# 메모리/CPU 사용률 확인
pm2 describe emotional-diary-backend
```

### 7-3. Docker 모니터링
```bash
# 컨테이너 상태
docker ps

# 로그 확인
docker logs -f diary-backend

# 리소스 사용률
docker stats
```

---

## 8️⃣ 문제 해결

### 문제: 포트 이미 사용 중
```bash
# 포트 확인
lsof -i :50050

# 프로세스 종료
kill -9 <PID>

# PM2 재시작
pm2 restart emotional-diary-backend
```

### 문제: 데이터베이스 오류
```bash
# 데이터베이스 초기화 (주의!)
rm backend/db/diary.sqlite

# 서버 재시작 시 자동 생성됨
pm2 restart emotional-diary-backend
```

### 문제: CORS 오류
```bash
# frontend/.env.local 확인
cat frontend/.env.local

# backend/.env 확인
cat backend/.env

# CORS_ORIGIN이 프론트엔드 URL과 일치하는지 확인
```

### 문제: API 키 오류
```bash
# 환경변수 확인
env | grep ANTHROPIC_API_KEY

# .env 파일에 올바른 키가 설정되었는지 확인
cat backend/.env | grep ANTHROPIC_API_KEY
```

---

## 9️⃣ 배포 후 체크리스트

- [ ] 헬스 체크: `curl https://diary.dclub.kr/health`
- [ ] API 테스트: `curl https://diary.dclub.kr/api/info`
- [ ] 프론트엔드 접속: https://diary.dclub.kr
- [ ] 로그 확인: `pm2 logs emotional-diary-backend`
- [ ] 데이터베이스: `ls backend/db/diary.sqlite`
- [ ] SSL 인증서: `curl -I https://diary.dclub.kr`
- [ ] 모니터링: `pm2 monit`

---

## 🔄 CI/CD 파이프라인

### Gogs Webhook 자동 배포

코드 푸시 시:
1. Gogs가 Webhook 트리거
2. 배포 스크립트 실행
3. `npm install` → 빌드 → PM2 재시작
4. 자동으로 `diary.dclub.kr` 업데이트

### 수동 재배포
```bash
# Gogs에서 코드 업데이트
cd /home/kimjin/Desktop/kim/emotional-diary
git pull origin main

# PM2 재시작
pm2 restart emotional-diary-backend

# 또는 Webhook이 자동으로 처리함
```

---

## 📝 배포 기록

| 날짜 | 버전 | 변경사항 | 상태 |
|------|------|---------|------|
| 2026-03-07 | v1.0.0 | 초기 배포 설정 | ✅ 준비 완료 |

---

## 📞 지원

배포 관련 문제: https://gogs.dclub.kr/kim/emotional-diary/issues

---

**마지막 업데이트**: 2026-03-07
