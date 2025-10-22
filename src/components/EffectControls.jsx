import React from 'react'
import { Settings, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react'
import RotateControls from './controls/RotateControls'
import StampControls from './controls/StampControls'

function EffectControls({ effect, settings, onSettingsChange }) {
  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-bold text-gray-800">효과 설정</h2>
      </div>

      {effect === 'rotate' && (
        <RotateControls settings={settings} onChange={onSettingsChange} />
      )}

      {effect === 'stamp' && (
        <StampControls settings={settings} onChange={onSettingsChange} />
      )}
    </div>
  )
}

export default EffectControls

