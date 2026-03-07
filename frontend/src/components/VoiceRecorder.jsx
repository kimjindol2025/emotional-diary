import { useState, useRef, useEffect } from 'react'

const VoiceRecorder = ({ onTranscript, onError }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.lang = 'ko-KR'
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true

    recognitionRef.current.onstart = () => {
      setIsRecording(true)
    }

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript)
        onTranscript?.(transcript + finalTranscript)
      }
    }

    recognitionRef.current.onerror = (event) => {
      onError?.(event.error)
    }

    recognitionRef.current.onend = () => {
      setIsRecording(false)
    }

    return () => {
      recognitionRef.current?.stop()
    }
  }, [onTranscript, onError])

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setTranscript('')
      recognitionRef.current.start()
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
    }
  }

  const resetTranscript = () => {
    setTranscript('')
    onTranscript?.('')
  }

  if (!isSupported) {
    return (
      <div className="voice-recorder error">
        <p>브라우저가 음성 인식을 지원하지 않습니다.</p>
      </div>
    )
  }

  return (
    <div className="voice-recorder">
      <div className="recorder-controls">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="btn btn-primary"
        >
          🎤 녹음 시작
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="btn btn-secondary"
        >
          ⏹️ 녹음 중지
        </button>
        <button
          onClick={resetTranscript}
          className="btn btn-secondary"
        >
          🔄 초기화
        </button>
      </div>

      {isRecording && <div className="recording-indicator">🔴 녹음 중...</div>}

      {transcript && (
        <div className="transcript">
          <h4>변환 텍스트</h4>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  )
}

export default VoiceRecorder
