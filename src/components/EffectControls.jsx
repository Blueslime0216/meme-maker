import React from 'react'
import RotateControls from './controls/RotateControls'
import StampControls from './controls/StampControls'
import ShakeControls from './controls/ShakeControls'
import GlowControls from './controls/GlowControls'
import WaveControls from './controls/WaveControls'

function EffectControls({ effect, settings, onSettingsChange }) {
  return (
    <div className="panel-card p-4">
      <h3 className="text-lg font-bold mb-4 text-white">효과 설정</h3>
      <div className="space-y-4">
        {effect === 'rotate' && (
          <RotateControls settings={settings} onChange={onSettingsChange} />
        )}

        {effect === 'stamp' && (
          <StampControls settings={settings} onChange={onSettingsChange} />
        )}

        {effect === 'shake' && (
          <ShakeControls settings={settings} onChange={onSettingsChange} />
        )}

        {effect === 'glow' && (
          <GlowControls settings={settings} onChange={onSettingsChange} />
        )}

        {effect === 'wave' && (
          <WaveControls settings={settings} onChange={onSettingsChange} />
        )}
      </div>
    </div>
  )
}

export default EffectControls

