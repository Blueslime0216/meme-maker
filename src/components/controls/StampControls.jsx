import React from 'react'

function StampControls({ settings, onChange }) {
  return (
    <div className="space-y-4">
      {/* 기울기 각도 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          기울기 각도: <span className="text-purple-400">{settings.angle}°</span>
        </label>
        <input
          type="range"
          min="-45"
          max="45"
          step="1"
          value={settings.angle}
          onChange={(e) => onChange({ angle: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>-45°</span>
          <span>45°</span>
        </div>
      </div>

      {/* 투명 프레임 수 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          시작 전 빈 프레임: <span className="text-purple-400">{settings.emptyFrames}개</span>
        </label>
        <input
          type="range"
          min="0"
          max="20"
          step="1"
          value={settings.emptyFrames}
          onChange={(e) => onChange({ emptyFrames: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>20</span>
        </div>
      </div>

      {/* 대기 시간 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          찍힌 후 대기 시간: <span className="text-purple-400">{settings.waitTime}ms</span>
        </label>
        <input
          type="range"
          min="0"
          max="2000"
          step="100"
          value={settings.waitTime}
          onChange={(e) => onChange({ waitTime: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0ms</span>
          <span>2000ms</span>
        </div>
      </div>

      {/* 초기 크기 배율 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          등장 시 크기: <span className="text-purple-400">{settings.initialScale.toFixed(1)}x</span>
        </label>
        <input
          type="range"
          min="1.5"
          max="4"
          step="0.1"
          value={settings.initialScale}
          onChange={(e) => onChange({ initialScale: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1.5x</span>
          <span>4x</span>
        </div>
      </div>

      {/* 튕김 효과 크기 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          튕김 크기: <span className="text-purple-400">{settings.bounceScale.toFixed(2)}x</span>
        </label>
        <input
          type="range"
          min="1.05"
          max="1.3"
          step="0.01"
          value={settings.bounceScale}
          onChange={(e) => onChange({ bounceScale: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1.05x</span>
          <span>1.3x</span>
        </div>
      </div>

      {/* 애니메이션 속도 */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          찍히는 속도: <span className="text-purple-400">{settings.duration}ms</span>
        </label>
        <input
          type="range"
          min="200"
          max="800"
          step="50"
          value={settings.duration}
          onChange={(e) => onChange({ duration: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>200ms</span>
          <span>800ms</span>
        </div>
      </div>
    </div>
  )
}

export default StampControls

