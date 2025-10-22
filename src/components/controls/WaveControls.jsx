import React from 'react'
import { Minus, GripVertical, Circle } from 'lucide-react'

function WaveControls({ settings, onChange }) {
  const waveTypes = [
    { id: 'horizontal', label: '가로', icon: Minus, tooltip: '가로 물결' },
    { id: 'vertical', label: '세로', icon: GripVertical, tooltip: '세로 물결' },
    { id: 'circular', label: '원형', icon: Circle, tooltip: '원형 물결' }
  ]

  return (
    <div className="space-y-4">
      {/* 물결 방향 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          물결 방향
        </label>
        <div className="grid grid-cols-3 gap-2">
          {waveTypes.map(({ id, label, icon: Icon, tooltip }) => (
            <button
              key={id}
              onClick={() => onChange({ waveType: id })}
              title={tooltip}
              className={`
                flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200
                ${settings.waveType === id
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

      {/* 물결 진폭 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          물결 진폭: <span className="text-purple-400">{settings.amplitude}px</span>
        </label>
        <input
          type="range"
          min="5"
          max="30"
          step="1"
          value={settings.amplitude}
          onChange={(e) => onChange({ amplitude: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5px</span>
          <span>30px</span>
        </div>
      </div>

      {/* 물결 개수 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          물결 개수: <span className="text-purple-400">{settings.frequency}개</span>
        </label>
        <input
          type="range"
          min="1"
          max="8"
          step="1"
          value={settings.frequency}
          onChange={(e) => onChange({ frequency: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1개</span>
          <span>8개</span>
        </div>
      </div>

      {/* 물결 속도 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          물결 속도: <span className="text-purple-400">{settings.speed}x</span>
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

      {/* 왜곡 정도 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          왜곡 정도: <span className="text-purple-400">{settings.distortion.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={settings.distortion}
          onChange={(e) => onChange({ distortion: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.1</span>
          <span>1.0</span>
        </div>
      </div>
    </div>
  )
}

export default WaveControls

