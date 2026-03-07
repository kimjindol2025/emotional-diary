module.exports = {
  apps: [
    {
      // 백엔드 (Express 서버)
      name: 'emotional-diary-backend',
      script: './backend/server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 50050,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 50050,
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: ['backend'],
      ignore_watch: ['backend/node_modules', 'backend/db'],
      max_memory_restart: '200M',
      max_restarts: 10,
      min_uptime: '10s',

      // 헬스 체크 (선택)
      health_check: {
        endpoint: 'http://localhost:50050/health',
        timeout: 5000,
        interval: 30000,
      },
    },
    {
      // 프론트엔드 (Vite 개발 서버 또는 정적 파일)
      name: 'emotional-diary-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: __dirname + '/frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        VITE_API_URL: 'http://localhost:50050',
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '150M',
    },
  ],

  // 배포 설정 (선택)
  deploy: {
    production: {
      user: 'kim',
      host: '192.168.45.253',
      ref: 'origin/main',
      repo: 'https://gogs.dclub.kr/kim/emotional-diary.git',
      path: '/home/kim/emotional-diary',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
    },
  },
};
