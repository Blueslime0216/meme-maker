import React, { useRef } from 'react'
import { Upload, X } from 'lucide-react'

function ImageUploader({ onImageUpload, uploadedImage, compact = false }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          onImageUpload({
            src: event.target.result,
            width: img.width,
            height: img.height,
            file: file
          })
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    onImageUpload(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (compact && uploadedImage) {
    return (
      <div className="panel-card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white">업로드된 이미지</h3>
          <button
            onClick={clearImage}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative rounded-lg overflow-hidden bg-gray-900/50 aspect-video">
          <img
            src={uploadedImage.src}
            alt="Uploaded"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-xs text-gray-400 mt-2">
          {uploadedImage.width} × {uploadedImage.height}px
        </div>
      </div>
    )
  }

  return (
    <div className="panel-card p-6 text-center flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-bold mb-2 text-white">이미지 업로드</h2>
      <p className="text-gray-400 mb-6 text-sm">드래그 & 드롭하거나 파일을 선택하세요</p>
      <label 
        htmlFor="file-upload" 
        className="cursor-pointer bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-200"
      >
        파일 찾기
      </label>
      <input 
        id="file-upload"
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  )
}

export default ImageUploader

