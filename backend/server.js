require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase, close } = require('./db/database');
const diaryRoutes = require('./routes/diary');
const analyzeRoutes = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 0; // 0 = 자동 할당

// 미들웨어
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
}));

// 요청 로깅 미들웨어
app.use((req, _, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 헬스 체크
app.get('/health', (_, res) => {
  res.status(200).json({
    success: true,
    message: 'Emotional Diary Backend is running',
    timestamp: new Date().toISOString()
  });
});

// 정보 엔드포인트
app.get('/info', (_, res) => {
  res.status(200).json({
    success: true,
    service: 'Emotional Diary Backend',
    version: '1.0.0',
    endpoints: {
      diary: [
        'POST /api/diary - 일기 생성/업데이트',
        'GET /api/diary - 모든 일기 조회',
        'GET /api/diary/:date - 특정 날짜 일기 조회',
        'DELETE /api/diary/:date - 일기 삭제',
        'GET /api/diary/stats/emotions - 감정 통계',
        'GET /api/diary/stats/mood - 기분 통계'
      ],
      analysis: [
        'POST /api/analyze - Claude AI 감성 분석'
      ]
    }
  });
});

// 라우트
app.use('/api/diary', diaryRoutes);
app.use('/api/analyze', analyzeRoutes);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 엔드포인트를 찾을 수 없습니다',
    path: req.path,
    method: req.method
  });
});

// 에러 핸들러
app.use((err, req, res, _) => {
  console.error('요청 처리 오류:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: '서버 오류 발생',
    error: process.env.NODE_ENV === 'development' ? err.message : '알 수 없는 오류'
  });
});

/**
 * 서버 시작
 */
async function startServer() {
  try {
    // 데이터베이스 초기화
    await initializeDatabase();

    // 서버 시작
    const server = app.listen(PORT, () => {
      const actualPort = server.address().port;
      console.log(`
╔════════════════════════════════════════╗
║   Emotional Diary Backend Server       ║
╠════════════════════════════════════════╣
║ Status: Running                        ║
║ Port: ${actualPort}                           ║
║ Environment: ${(process.env.NODE_ENV || 'development').padEnd(25)}║
║ Database: ${(process.env.DB_PATH || './data/diary.db').padEnd(25)}║
╚════════════════════════════════════════╝

📋 API Endpoints:
   - Health Check: http://localhost:${actualPort}/health
   - Server Info:  http://localhost:${actualPort}/info
   - Diary API:    http://localhost:${actualPort}/api/diary
   - Analyze API:  http://localhost:${actualPort}/api/analyze

⚙️  Environment Variables Required:
   - ANTHROPIC_API_KEY: Claude API 키
   - CORS_ORIGIN: CORS 출처 (기본값: *)
      `);
    });

    // 종료 신호 처리
    process.on('SIGINT', async () => {
      console.log('\n서버 종료 중...');
      server.close(async () => {
        try {
          await close();
          console.log('서버가 정상적으로 종료되었습니다');
          process.exit(0);
        } catch (err) {
          console.error('종료 중 오류:', err.message);
          process.exit(1);
        }
      });
    });

    process.on('SIGTERM', async () => {
      console.log('\n서버 종료 신호 수신...');
      server.close(async () => {
        try {
          await close();
          console.log('서버가 정상적으로 종료되었습니다');
          process.exit(0);
        } catch (err) {
          console.error('종료 중 오류:', err.message);
          process.exit(1);
        }
      });
    });

  } catch (err) {
    console.error('서버 시작 실패:', err.message);
    process.exit(1);
  }
}

// 서버 시작
startServer();

module.exports = app;
