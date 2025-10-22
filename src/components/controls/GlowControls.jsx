import React from 'react'
import { Sun, Rainbow, Zap } from 'lucide-react'

function GlowControls({ settings, onChange }) {
  const glowTypes = [
    { id: 'brightness', label: '밝기', icon: Sun, tooltip: '밝게 빛남' },
    { id: 'rainbow', label: '무지개', icon: Rainbow, tooltip: '색상 변화' },
    { id: 'pulse', label: '펄스', icon: Zap, tooltip: '투명도 변화' }
  ]

  return (
    <div className="space-y-4">
      {/* 반짝임 유형 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          반짝임 유형
        </label>
        <div className="grid grid-cols-3 gap-2">
          {glowTypes.map(({ id, label, icon: Icon, tooltip }) => (
            <button
              key={id}
              onClick={() => onChange({ glowType: id })}
              title={tooltip}
              className={`
                flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200
                ${settings.glowType === id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 반짝임 속도 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          반짝임 속도: <span className="text-purple-400">{settings.speed}x</span>
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={settings.speed}
          onChange={(e) => onChange({ speed: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.5x</span>
          <span>3x</span>
        </div>
      </div>

      {/* 밝기 강도 (brightness 유형일 때만) */}
      {settings.glowType === 'brightness' && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            밝기 강도: <span className="text-purple-400">{settings.intensity.toFixed(1)}x</span>
          </label>
          <input
            type="range"
            min="1.2"
            max="2.5"
            step="0.1"
            value={settings.intensity}
            onChange={(e) => onChange({ intensity: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1.2x</span>
            <span>2.5x</span>
          </div>
        </div>
      )}

      {/* 빛나는 색상 (pulse 유형일 때만) */}
      {settings.glowType === 'pulse' && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            빛나는 색상
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.glowColor}
              onChange={(e) => onChange({ glowColor: e.target.value })}
              className="w-10 h-10 rounded cursor-pointer bg-gray-700"
            />
            <input
              type="text"
              value={settings.glowColor}
              onChange={(e) => onChange({ glowColor: e.target.value })}
              className="flex-1 input-field text-sm"
              placeholder="#ffff00"
            />
          </div>
        </div>
      )}

      {/* 최소 밝기 (pulse 유형일 때만) */}
      {settings.glowType === 'pulse' && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            최소 밝기: <span className="text-purple-400">{Math.round(settings.minOpacity * 100)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="0.7"
            step="0.1"
            value={settings.minOpacity}
            onChange={(e) => onChange({ minOpacity: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>70%</span>
          </div>
        </div>
      )}

      {/* 최대 밝기 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          최대 밝기: <span className="text-purple-400">{Math.round(settings.maxOpacity * 100)}%</span>
        </label>
        <input
          type="range"
          min="0.8"
          max="1"
          step="0.05"
          value={settings.maxOpacity}
          onChange={(e) => onChange({ maxOpacity: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>80%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}

export default GlowControls

