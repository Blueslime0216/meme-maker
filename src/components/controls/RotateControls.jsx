import React from 'react'
import { RotateCcw, RotateCw, ArrowUp, ArrowRight } from 'lucide-react'

function RotateControls({ settings, onChange }) {
  const directions = [
    { id: 'left', label: '왼쪽', icon: RotateCcw, tooltip: 'Z축 반시계방향 회전' },
    { id: 'right', label: '오른쪽', icon: RotateCw, tooltip: 'Z축 시계방향 회전' },
    { id: 'up', label: '위로', icon: ArrowUp, tooltip: 'X축 위로 회전 (3D)' },
    { id: 'down', label: '옆으로', icon: ArrowRight, tooltip: 'Y축 옆으로 회전 (3D)' }
  ]

  return (
    <div className="space-y-4">
      {/* 회전 방향 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          회전 방향
        </label>
        <div className="grid grid-cols-2 gap-2">
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

      {/* 회전 속도 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          회전 속도: <span className="text-purple-400">{settings.speed}x</span>
        </label>
        <input
          type="range"
          min="0.25"
          max="3"
          step="0.25"
          value={settings.speed}
          onChange={(e) => onChange({ speed: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.25x</span>
          <span>3x</span>
        </div>
      </div>

      {/* 배경색 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          배경 설정
        </label>
        <div className="space-y-2">
          <button
            onClick={() => onChange({ backgroundColor: 'transparent' })}
            className={`
              w-full p-3 rounded-lg transition-all duration-200 flex items-center gap-3
              ${settings.backgroundColor === 'transparent'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
              }
            `}
          >
            <div className="w-6 h-6 rounded border border-gray-600" style={{
              background: 'repeating-conic-gradient(#374151 0% 25%, #1f2937 0% 50%) 50% / 8px 8px'
            }}></div>
            <span className="font-medium text-sm">투명 배경</span>
          </button>

          <button
            onClick={() => onChange({ backgroundColor: 'custom' })}
            className={`
              w-full p-3 rounded-lg transition-all duration-200 flex items-center gap-3
              ${settings.backgroundColor === 'custom'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
              }
            `}
          >
            <div 
              className="w-6 h-6 rounded border border-gray-600"
              style={{ backgroundColor: settings.customColor }}
            ></div>
            <span className="font-medium text-sm">단색 배경</span>
          </button>

          {settings.backgroundColor === 'custom' && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="color"
                value={settings.customColor}
                onChange={(e) => onChange({ customColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer bg-gray-700"
              />
              <input
                type="text"
                value={settings.customColor}
                onChange={(e) => onChange({ customColor: e.target.value })}
                className="flex-1 input-field text-sm"
                placeholder="#000000"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RotateControls

