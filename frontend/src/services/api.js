import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터 (토큰 추가 가능)
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const analyzeEntry = async (text, imageBase64) => {
  try {
    const response = await api.post('/analyze', {
      text,
      image: imageBase64
    })
    return response.data
  } catch (error) {
    console.error('Failed to analyze entry:', error)
    throw error
  }
}

export const saveDiary = async (diaryData) => {
  try {
    const response = await api.post('/diary', diaryData)
    return response.data
  } catch (error) {
    console.error('Failed to save diary:', error)
    throw error
  }
}

export const getDiaries = async (params = {}) => {
  try {
    const response = await api.get('/diary', { params })
    return response.data
  } catch (error) {
    console.error('Failed to fetch diaries:', error)
    throw error
  }
}

export const getDiary = async (id) => {
  try {
    const response = await api.get(`/diary/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch diary:', error)
    throw error
  }
}

export const updateDiary = async (id, diaryData) => {
  try {
    const response = await api.put(`/diary/${id}`, diaryData)
    return response.data
  } catch (error) {
    console.error('Failed to update diary:', error)
    throw error
  }
}

export const deleteDiary = async (id) => {
  try {
    const response = await api.delete(`/diary/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to delete diary:', error)
    throw error
  }
}

export default api
