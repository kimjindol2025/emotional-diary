const express = require('express');
const router = express.Router();
const axios = require('axios');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * POST /api/analyze
 * Claude API를 사용하여 텍스트와 이미지의 감성 분석
 */
router.post('/', async (req, res) => {
  try {
    const { text, image } = req.body;

    // 입력값 검증
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: '분석할 텍스트가 필요합니다'
      });
    }

    // API 키 확인
    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'API 키가 설정되지 않았습니다'
      });
    }

    // 요청 본문 구성
    const messages = [
      {
        role: 'user',
        content: buildAnalysisPrompt(text, image)
      }
    ];

    // Claude API 호출
    const response = await axios.post(ANTHROPIC_API_URL, {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: messages
    }, {
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });

    // 응답 파싱
    const content = response.data.content[0].text;
    const analysisResult = parseAnalysisResponse(content);

    res.status(200).json({
      success: true,
      data: analysisResult
    });
  } catch (err) {
    console.error('감성 분석 오류:', err.message);

    // Claude API 에러 처리
    if (err.response?.data?.error) {
      return res.status(err.response.status || 500).json({
        success: false,
        message: 'Claude API 오류',
        error: err.response.data.error.message
      });
    }

    res.status(500).json({
      success: false,
      message: '감성 분석 중 오류 발생',
      error: err.message
    });
  }
});

/**
 * Claude API 프롬프트 구성
 */
function buildAnalysisPrompt(text, image) {
  const basePrompt = `당신은 감성 분석 전문가입니다. 사용자의 일기 또는 감정을 분석하고 상세한 피드백을 제공하세요.

사용자의 텍스트:
"${text}"

다음 형식의 JSON 응답을 제공하세요 (마크다운 코드블록 없이 순수 JSON만):
{
  "emotion_primary": "주요 감정 (기쁨, 슬픔, 분노, 불안, 평온, 혼란, 희망 등)",
  "emotion_scores": {
    "기쁨": 0-10,
    "슬픔": 0-10,
    "분노": 0-10,
    "불안": 0-10,
    "평온": 0-10,
    "희망": 0-10,
    "혼란": 0-10
  },
  "mood_score": 1-10,
  "emotion_summary": "감정 분석 요약 (1-2문장)",
  "ai_advice": "건설적인 조언이나 제안",
  "recommendations": [
    "추천 활동이나 조치 1",
    "추천 활동이나 조치 2",
    "추천 활동이나 조치 3"
  ]
}`;

  let prompt = basePrompt;

  // 이미지 분석 추가 (있을 경우)
  if (image) {
    prompt += `\n\n이미지도 분석하여 시각적 감정 표현을 고려하세요.`;
  }

  return prompt;
}

/**
 * Claude 응답 파싱
 */
function parseAnalysisResponse(content) {
  try {
    // JSON 추출 (마크다운 코드블록에 감싸여 있을 수 있음)
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ||
                      content.match(/(\{[\s\S]*\})/);

    if (!jsonMatch) {
      throw new Error('응답에서 JSON을 찾을 수 없습니다');
    }

    const jsonString = jsonMatch[1];
    const result = JSON.parse(jsonString);

    // 응답 필드 검증 및 정규화
    return {
      emotion_primary: result.emotion_primary || '분석 불가',
      emotion_scores: validateEmotionScores(result.emotion_scores || {}),
      mood_score: validateMoodScore(result.mood_score),
      emotion_summary: result.emotion_summary || '',
      ai_advice: result.ai_advice || '',
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : []
    };
  } catch (err) {
    console.error('응답 파싱 오류:', err.message);

    // 폴백: 기본 구조 반환
    return {
      emotion_primary: '분석 불가',
      emotion_scores: {
        기쁨: 0,
        슬픔: 0,
        분노: 0,
        불안: 0,
        평온: 0,
        희망: 0,
        혼란: 0
      },
      mood_score: 5,
      emotion_summary: '분석 중 오류가 발생했습니다',
      ai_advice: '',
      recommendations: []
    };
  }
}

/**
 * 감정 점수 검증
 */
function validateEmotionScores(scores) {
  const defaultScores = {
    기쁨: 0,
    슬픔: 0,
    분노: 0,
    불안: 0,
    평온: 0,
    희망: 0,
    혼란: 0
  };

  if (typeof scores !== 'object' || scores === null) {
    return defaultScores;
  }

  Object.keys(defaultScores).forEach(emotion => {
    const value = parseFloat(scores[emotion]);
    defaultScores[emotion] = isNaN(value) ? 0 : Math.max(0, Math.min(10, value));
  });

  return defaultScores;
}

/**
 * 기분 점수 검증
 */
function validateMoodScore(score) {
  const value = parseFloat(score);
  if (isNaN(value)) return 5;
  return Math.max(1, Math.min(10, Math.round(value)));
}

module.exports = router;
