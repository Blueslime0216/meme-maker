import React from 'react'
import RotateControls from './controls/RotateControls'
import StampControls from './controls/StampControls'

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
      </div>
    </div>
  )
}

export default EffectControls

