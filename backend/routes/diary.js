const express = require('express');
const router = express.Router();
const { query, queryOne, run } = require('../db/database');

/**
 * POST /api/diary
 * 새로운 일기 생성 또는 기존 일기 업데이트
 */
router.post('/', async (req, res) => {
  try {
    const { date, text_content, image_data, analysis_result } = req.body;

    // 입력값 검증
    if (!date || !text_content) {
      return res.status(400).json({
        success: false,
        message: '날짜와 텍스트 내용은 필수입니다'
      });
    }

    const {
      emotion_primary = null,
      emotion_scores = null,
      emotion_summary = null,
      recommendations = null,
      ai_advice = null,
      mood_score = null
    } = analysis_result || {};

    // 기존 일기가 있는지 확인
    const existing = await queryOne(
      'SELECT id FROM diaries WHERE date = ?',
      [date]
    );

    if (existing) {
      // 기존 일기 업데이트
      await run(
        `UPDATE diaries
         SET text_content = ?,
             image_data = ?,
             emotion_primary = ?,
             emotion_scores = ?,
             emotion_summary = ?,
             recommendations = ?,
             ai_advice = ?,
             mood_score = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE date = ?`,
        [
          text_content,
          image_data || null,
          emotion_primary,
          JSON.stringify(emotion_scores),
          emotion_summary,
          JSON.stringify(recommendations),
          ai_advice,
          mood_score,
          date
        ]
      );

      return res.status(200).json({
        success: true,
        message: '일기가 업데이트되었습니다',
        id: existing.id
      });
    }

    // 새로운 일기 생성
    const result = await run(
      `INSERT INTO diaries
       (date, text_content, image_data, emotion_primary, emotion_scores, emotion_summary, recommendations, ai_advice, mood_score)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        date,
        text_content,
        image_data || null,
        emotion_primary,
        JSON.stringify(emotion_scores),
        emotion_summary,
        JSON.stringify(recommendations),
        ai_advice,
        mood_score
      ]
    );

    res.status(201).json({
      success: true,
      message: '일기가 생성되었습니다',
      id: result.id
    });
  } catch (err) {
    console.error('일기 생성/업데이트 오류:', err.message);
    res.status(500).json({
      success: false,
      message: '서버 오류 발생',
      error: err.message
    });
  }
});

/**
 * GET /api/diary
 * 모든 일기 조회 (날짜순)
 */
router.get('/', async (_, res) => {
  try {
    const diaries = await query(
      'SELECT * FROM diaries ORDER BY date DESC'
    );

    // JSON 문자열 파싱
    const parsed = diaries.map(diary => ({
      ...diary,
      emotion_scores: diary.emotion_scores ? JSON.parse(diary.emotion_scores) : null,
      recommendations: diary.recommendations ? JSON.parse(diary.recommendations) : null
    }));

    res.status(200).json({
      success: true,
      data: parsed,
      count: parsed.length
    });
  } catch (err) {
    console.error('일기 조회 오류:', err.message);
    res.status(500).json({
      success: false,
      message: '서버 오류 발생',
      error: err.message
    });
  }
});

/**
 * GET /api/diary/:date
 * 특정 날짜 일기 조회
 */
router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;

    const diary = await queryOne(
      'SELECT * FROM diaries WHERE date = ?',
      [date]
    );

    if (!diary) {
      return res.status(404).json({
        success: false,
        message: '해당 날짜의 일기를 찾을 수 없습니다'
      });
    }

    // JSON 문자열 파싱
    const parsed = {
      ...diary,
      emotion_scores: diary.emotion_scores ? JSON.parse(diary.emotion_scores) : null,
      recommendations: diary.recommendations ? JSON.parse(diary.recommendations) : null
    };

    res.status(200).json({
      success: true,
      data: parsed
    });
  } catch (err) {
    console.error('일기 조회 오류:', err.message);
    res.status(500).json({
      success: false,
      message: '서버 오류 발생',
      error: err.message
    });
  }
});

/**
 * DELETE /api/diary/:date
 * 특정 날짜 일기 삭제
 */
router.delete('/:date', async (req, res) => {
  try {
    const { date } = req.params;

    const result = await run(
      'DELETE FROM diaries WHERE date = ?',
      [date]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: '해당 날짜의 일기를 찾을 수 없습니다'
      });
    }

    res.status(200).json({
      success: true,
      message: '일기가 삭제되었습니다'
    });
  } catch (err) {
    console.error('일기 삭제 오류:', err.message);
    res.status(500).json({
      success: false,
      message: '서버 오류 발생',
      error: err.message
    });
  }
});

/**
 * GET /api/diary/stats/emotions
 * 감정 통계 조회
 */
router.get('/stats/emotions', async (_, res) => {
  try {
    const emotions = await query(
      `SELECT emotion_primary, COUNT(*) as count
       FROM diaries
       WHERE emotion_primary IS NOT NULL
       GROUP BY emotion_primary
       ORDER BY count DESC`
    );

    res.status(200).json({
      success: true,
      data: emotions
    });
  } catch (err) {
    console.error('감정 통계 조회 오류:', err.message);
    res.status(500).json({
      success: false,
      message: '서버 오류 발생',
      error: err.message
    });
  }
});

/**
 * GET /api/diary/stats/mood
 * 기분 점수 통계 조회
 */
router.get('/stats/mood', async (_, res) => {
  try {
    const stats = await query(
      `SELECT
         AVG(mood_score) as average,
         MIN(mood_score) as minimum,
         MAX(mood_score) as maximum,
         COUNT(*) as total
       FROM diaries
       WHERE mood_score IS NOT NULL`
    );

    res.status(200).json({
      success: true,
      data: stats[0]
    });
  } catch (err) {
    console.error('기분 통계 조회 오류:', err.message);
    res.status(500).json({
      success: false,
      message: '서버 오류 발생',
      error: err.message
    });
  }
});

module.exports = router;
