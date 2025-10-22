import React from 'react'
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react'

function RotateControls({ settings, onChange }) {
  const directions = [
    { id: 'left', label: '왼쪽', icon: ArrowLeft },
    { id: 'right', label: '오른쪽', icon: ArrowRight },
    { id: 'up', label: '위', icon: ArrowUp },
    { id: 'down', label: '아래', icon: ArrowDown }
  ]

  return (
    <div className="space-y-6">
      {/* 회전 방향 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          회전 방향
        </label>
        <div className="grid grid-cols-2 gap-3">
          {directions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onChange({ direction: id })}
              className={`
                flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200
                ${settings.direction === id
                  ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 회전 속도 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          회전 속도
          <span className="ml-2 text-primary-600 font-bold">{settings.speed}x</span>
        </label>
        <input
          type="range"
          min="0.25"
          max="3"
          step="0.25"
          value={settings.speed}
          onChange={(e) => onChange({ speed: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gradient-to-r from-primary-200 to-primary-500 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>느림 (0.25x)</span>
          <span>빠름 (3x)</span>
        </div>
      </div>

      {/* 배경색 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          배경 설정
        </label>
        <div className="space-y-3">
          <button
            onClick={() => onChange({ backgroundColor: 'transparent' })}
            className={`
              w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3
              ${settings.backgroundColor === 'transparent'
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="w-8 h-8 rounded-md border-2 border-gray-300" style={{
              background: 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 10px 10px'
            }}></div>
            <span className="font-medium">투명 배경</span>
          </button>

          <button
            onClick={() => onChange({ backgroundColor: 'custom' })}
            className={`
              w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3
              ${settings.backgroundColor === 'custom'
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }
            `}
          >
            <div 
              className="w-8 h-8 rounded-md border-2 border-gray-300"
              style={{ backgroundColor: settings.customColor }}
            ></div>
            <span className="font-medium">단색 배경</span>
          </button>

          {settings.backgroundColor === 'custom' && (
            <div className="ml-11 flex items-center gap-3">
              <input
                type="color"
                value={settings.customColor}
                onChange={(e) => onChange({ customColor: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
              />
              <input
                type="text"
                value={settings.customColor}
                onChange={(e) => onChange({ customColor: e.target.value })}
                className="flex-1 input-field"
                placeholder="#ffffff"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RotateControls

