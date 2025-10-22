import React, { useRef } from 'react'
import { Upload, Image as ImageIcon, X } from 'lucide-react'

function ImageUploader({ onImageUpload, uploadedImage }) {
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

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
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

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const clearImage = () => {
    onImageUpload(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <ImageIcon className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-bold text-gray-800">이미지 업로드</h2>
      </div>

      {!uploadedImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-3 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-300 group"
        >
          <Upload className="w-16 h-16 mx-auto text-gray-400 group-hover:text-primary-500 transition-colors mb-4" />
          <p className="text-gray-600 font-medium mb-2">
            클릭하거나 이미지를 드래그하세요
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG, GIF, WEBP 지원
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-gray-100 group">
            <img
              src={uploadedImage.src}
              alt="Uploaded"
              className="w-full h-auto max-h-64 object-contain mx-auto"
            />
            <button
              onClick={clearImage}
              className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p><span className="font-semibold">크기:</span> {uploadedImage.width} × {uploadedImage.height}px</p>
            <p><span className="font-semibold">파일:</span> {uploadedImage.file.name}</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary w-full"
          >
            다른 이미지 선택
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}

export default ImageUploader

