# Node.js 기반 이미지
FROM node:18-alpine

# 작업 디렉토리
WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json ./
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 데이터베이스 디렉토리 생성
RUN mkdir -p db logs

# 포트 노출
EXPOSE 50050

# 헬스 체크
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:50050/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# 서버 시작
CMD ["node", "server.js"]
