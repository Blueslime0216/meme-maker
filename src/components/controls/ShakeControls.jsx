import React from 'react'
import { MoveHorizontal, MoveVertical, Maximize2 } from 'lucide-react'

function ShakeControls({ settings, onChange }) {
  const directions = [
    { id: 'horizontal', label: '가로', icon: MoveHorizontal, tooltip: '좌우로 흔들림' },
    { id: 'vertical', label: '세로', icon: MoveVertical, tooltip: '상하로 흔들림' },
    { id: 'both', label: '전체', icon: Maximize2, tooltip: '모든 방향으로 흔들림' }
  ]

  return (
    <div className="space-y-4">
      {/* 흔들림 방향 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          흔들림 방향
        </label>
        <div className="grid grid-cols-3 gap-2">
          {directions.map(({ id, label, icon: Icon, tooltip }) => (
            <button
              key={id}
              onClick={() => onChange({ direction: id })}
              title={tooltip}
              className={`
                flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200
                ${settings.direction === id
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

      {/* 흔들림 강도 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          흔들림 강도: <span className="text-purple-400">{settings.intensity}px</span>
        </label>
        <input
          type="range"
          min="5"
          max="30"
          step="1"
          value={settings.intensity}
          onChange={(e) => onChange({ intensity: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5px</span>
          <span>30px</span>
        </div>
      </div>

      {/* 흔들림 속도 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          흔들림 속도: <span className="text-purple-400">{settings.speed}x</span>
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

      {/* 흔들림 빈도 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          흔들림 빈도: <span className="text-purple-400">{settings.frequency}회/초</span>
        </label>
        <input
          type="range"
          min="4"
          max="16"
          step="1"
          value={settings.frequency}
          onChange={(e) => onChange({ frequency: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>4회</span>
          <span>16회</span>
        </div>
      </div>
    </div>
  )
}

export default ShakeControls

