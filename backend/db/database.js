const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || './data/diary.db';
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// 데이터베이스 디렉토리 생성
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// SQLite 데이터베이스 연결
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err.message);
    process.exit(1);
  } else {
    console.log(`SQLite 데이터베이스 연결 성공: ${DB_PATH}`);
  }
});

// 외래 키 제약 활성화
db.run('PRAGMA foreign_keys = ON');

/**
 * 데이터베이스 초기화
 */
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');

    db.exec(schema, (err) => {
      if (err) {
        console.error('스키마 초기화 실패:', err.message);
        reject(err);
      } else {
        console.log('데이터베이스 스키마 초기화 성공');
        resolve();
      }
    });
  });
}

/**
 * Promise 기반 쿼리 실행 (SELECT)
 */
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
}

/**
 * Promise 기반 단일 행 조회 (SELECT 1행)
 */
function queryOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row || null);
      }
    });
  });
}

/**
 * Promise 기반 실행 (INSERT/UPDATE/DELETE)
 */
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          id: this.lastID,
          changes: this.changes
        });
      }
    });
  });
}

/**
 * 데이터베이스 종료
 */
function close() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('데이터베이스 연결 종료');
        resolve();
      }
    });
  });
}

module.exports = {
  db,
  initializeDatabase,
  query,
  queryOne,
  run,
  close
};
