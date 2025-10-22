import React, { useState } from 'react'
import Header from './components/Header'
import ImageUploader from './components/ImageUploader'
import EffectSelector from './components/EffectSelector'
import EffectControls from './components/EffectControls'
import Preview from './components/Preview'
import ExportPanel from './components/ExportPanel'

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [selectedEffect, setSelectedEffect] = useState('rotate')
  const [effectSettings, setEffectSettings] = useState({
    direction: 'right',
    speed: 1,
    backgroundColor: 'transparent',
    customColor: '#000000'
  })
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
        customColor: '#000000'
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
    } else if (effect === 'shake') {
      setEffectSettings({
        direction: 'horizontal',
        intensity: 10,
        speed: 1,
        frequency: 8
      })
    } else if (effect === 'glow') {
      setEffectSettings({
        glowType: 'brightness',
        speed: 1,
        intensity: 1.5,
        glowColor: '#ffff00',
        minOpacity: 0.3,
        maxOpacity: 1
      })
    } else if (effect === 'wave') {
      setEffectSettings({
        waveType: 'horizontal',
        amplitude: 10,
        frequency: 3,
        speed: 1,
        distortion: 0.5
      })
    }
    setPreviewKey(prev => prev + 1)
  }

  const handleSettingsChange = (newSettings) => {
    setEffectSettings(prev => ({ ...prev, ...newSettings }))
    setPreviewKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 overflow-hidden">
        {/* 왼쪽 패널 */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          <EffectSelector
            selectedEffect={selectedEffect}
            onEffectChange={handleEffectChange}
          />
          
          {uploadedImage ? (
            <>
              <ImageUploader 
                onImageUpload={handleImageUpload}
                uploadedImage={uploadedImage}
                compact={true}
              />
              <EffectControls
                effect={selectedEffect}
                settings={effectSettings}
                onSettingsChange={handleSettingsChange}
              />
            </>
          ) : (
            <ImageUploader 
              onImageUpload={handleImageUpload}
              uploadedImage={uploadedImage}
            />
          )}
        </div>

        {/* 오른쪽 패널 */}
        <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0">
            <Preview
              key={previewKey}
              image={uploadedImage}
              effect={selectedEffect}
              settings={effectSettings}
            />
          </div>
          
          {uploadedImage && (
            <ExportPanel
              image={uploadedImage}
              effect={selectedEffect}
              settings={effectSettings}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App

