import { useState, useRef } from 'react'

const ImageCapture = ({ onImageSelect, onError }) => {
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const fileInputRef = useRef(null)

  const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          const maxWidth = 800
          const maxHeight = 600

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              const reader = new FileReader()
              reader.onload = (e) => {
                resolve(e.target.result)
              }
              reader.onerror = reject
              reader.readAsDataURL(blob)
            },
            'image/jpeg',
            0.8
          )
        }
        img.onerror = reject
        img.src = event.target.result
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // 파일 타입 확인
      if (!file.type.startsWith('image/')) {
        onError?.('이미지 파일만 업로드할 수 있습니다.')
        return
      }

      // 파일 크기 확인 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        onError?.('파일 크기는 5MB 이하여야 합니다.')
        return
      }

      setFileName(file.name)
      setFileSize(file.size)

      const compressedBase64 = await compressImage(file)
      setPreview(compressedBase64)
      onImageSelect?.(compressedBase64)
    } catch (error) {
      onError?.(`이미지 처리 실패: ${error.message}`)
    }
  }

  const clearImage = () => {
    setPreview(null)
    setFileName('')
    setFileSize(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onImageSelect?.(null)
  }

  return (
    <div className="image-capture">
      <div className="image-input-area">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="image-input"
          id="image-input"
        />
        <label htmlFor="image-input" className="image-input-label">
          📷 이미지 선택
        </label>
      </div>

      {fileName && (
        <div className="file-info">
          <span className="file-name">{fileName}</span>
          <span className="file-size">
            {(fileSize / 1024).toFixed(2)} KB
          </span>
        </div>
      )}

      {preview && (
        <div className="image-preview-container">
          <img src={preview} alt="Preview" className="image-preview" />
          <button onClick={clearImage} className="btn btn-danger">
            ❌ 제거
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageCapture
