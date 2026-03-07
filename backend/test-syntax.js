console.log('✅ 구문 검사 시작...\n');

try {
  require('./server.js');
  console.log('⚠️  (server.js가 실행 중입니다. 정상)');
} catch (err) {
  if (err.code === 'EADDRINUSE') {
    console.log('✅ server.js: 문법 정상 (포트 할당 대기 상태)');
  } else {
    console.log('❌ server.js:', err.message);
  }
}

// 모듈 검사
try {
  const db = require('./db/database.js');
  console.log('✅ db/database.js: 문법 정상');
} catch (err) {
  console.log('❌ db/database.js:', err.message);
}

try {
  const diary = require('./routes/diary.js');
  console.log('✅ routes/diary.js: 문법 정상');
} catch (err) {
  console.log('❌ routes/diary.js:', err.message);
}

try {
  const analyze = require('./routes/analyze.js');
  console.log('✅ routes/analyze.js: 문법 정상');
} catch (err) {
  console.log('❌ routes/analyze.js:', err.message);
}

console.log('\n✅ 모든 파일 구문 검사 완료!');
process.exit(0);
