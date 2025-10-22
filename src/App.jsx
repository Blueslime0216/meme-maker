import React, { useState } from 'react'
import Header from './components/Header'
import ImageUploader from './components/ImageUploader'
import EffectSelector from './components/EffectSelector'
import EffectControls from './components/EffectControls'
import Preview from './components/Preview'
import ExportPanel from './components/ExportPanel'

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [selectedEffect, setSelectedEffect] = useState(null)
  const [effectSettings, setEffectSettings] = useState({})
  const [previewKey, setPreviewKey] = useState(0)

  const handleImageUpload = (image) => {
    setUploadedImage(image)
    setPreviewKey(prev => prev + 1)
  }

  const handleEffectChange = (effect) => {
    setSelectedEffect(effect)
    // 각 효과의 기본 설정값 초기화
    if (effect === 'rotate') {
      setEffectSettings({
        direction: 'right',
        speed: 1,
        backgroundColor: 'transparent',
        customColor: '#ffffff'
      })
    } else if (effect === 'stamp') {
      setEffectSettings({
        angle: 15,
        emptyFrames: 5,
        waitTime: 500,
        initialScale: 2.5,
        bounceScale: 1.15,
        duration: 400
      })
    }
    setPreviewKey(prev => prev + 1)
  }

  const handleSettingsChange = (newSettings) => {
    setEffectSettings(prev => ({ ...prev, ...newSettings }))
    setPreviewKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* 왼쪽 패널 - 업로드 및 효과 선택 */}
          <div className="lg:col-span-1 space-y-6">
            <ImageUploader 
              onImageUpload={handleImageUpload}
              uploadedImage={uploadedImage}
            />
            
            <EffectSelector
              selectedEffect={selectedEffect}
              onEffectChange={handleEffectChange}
              disabled={!uploadedImage}
            />
            
            {selectedEffect && uploadedImage && (
              <EffectControls
                effect={selectedEffect}
                settings={effectSettings}
                onSettingsChange={handleSettingsChange}
              />
            )}
          </div>

          {/* 오른쪽 패널 - 프리뷰 및 내보내기 */}
          <div className="lg:col-span-2 space-y-6">
            <Preview
              key={previewKey}
              image={uploadedImage}
              effect={selectedEffect}
              settings={effectSettings}
            />
            
            {uploadedImage && selectedEffect && (
              <ExportPanel
                image={uploadedImage}
                effect={selectedEffect}
                settings={effectSettings}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

