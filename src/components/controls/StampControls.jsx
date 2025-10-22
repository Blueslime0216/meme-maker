import React from 'react'

function StampControls({ settings, onChange }) {
  return (
    <div className="space-y-6">
      {/* 기울기 각도 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          기울기 각도
          <span className="ml-2 text-primary-600 font-bold">{settings.angle}°</span>
        </label>
        <input
          type="range"
          min="-45"
          max="45"
          step="1"
          value={settings.angle}
          onChange={(e) => onChange({ angle: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-500 rounded-lg appearance-none cursor-pointer accent-accent-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>왼쪽 (-45°)</span>
          <span>오른쪽 (45°)</span>
        </div>
      </div>

      {/* 투명 프레임 수 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          시작 전 빈 프레임
          <span className="ml-2 text-primary-600 font-bold">{settings.emptyFrames}개</span>
        </label>
        <input
          type="range"
          min="0"
          max="20"
          step="1"
          value={settings.emptyFrames}
          onChange={(e) => onChange({ emptyFrames: parseInt(e.target.value) })}
          className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-500 rounded-lg appearance-none cursor-pointer accent-accent-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>즉시 (0)</span>
          <span>길게 (20)</span>
        </div>
      </div>

      {/* 대기 시간 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          찍힌 후 대기 시간
          <span className="ml-2 text-primary-600 font-bold">{settings.waitTime}ms</span>
        </label>
        <input
          type="range"
          min="0"
          max="2000"
          step="100"
          value={settings.waitTime}
          onChange={(e) => onChange({ waitTime: parseInt(e.target.value) })}
          className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-500 rounded-lg appearance-none cursor-pointer accent-accent-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>즉시 (0ms)</span>
          <span>길게 (2000ms)</span>
        </div>
      </div>

      {/* 초기 크기 배율 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          등장 시 크기 배율
          <span className="ml-2 text-primary-600 font-bold">{settings.initialScale.toFixed(1)}x</span>
        </label>
        <input
          type="range"
          min="1.5"
          max="4"
          step="0.1"
          value={settings.initialScale}
          onChange={(e) => onChange({ initialScale: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-500 rounded-lg appearance-none cursor-pointer accent-accent-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>작게 (1.5x)</span>
          <span>크게 (4x)</span>
        </div>
      </div>

      {/* 튕김 효과 크기 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          찍힐 때 튕김 크기
          <span className="ml-2 text-primary-600 font-bold">{settings.bounceScale.toFixed(2)}x</span>
        </label>
        <input
          type="range"
          min="1.05"
          max="1.3"
          step="0.01"
          value={settings.bounceScale}
          onChange={(e) => onChange({ bounceScale: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-500 rounded-lg appearance-none cursor-pointer accent-accent-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>약하게 (1.05x)</span>
          <span>강하게 (1.3x)</span>
        </div>
      </div>

      {/* 애니메이션 속도 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          찍히는 속도
          <span className="ml-2 text-primary-600 font-bold">{settings.duration}ms</span>
        </label>
        <input
          type="range"
          min="200"
          max="800"
          step="50"
          value={settings.duration}
          onChange={(e) => onChange({ duration: parseInt(e.target.value) })}
          className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-500 rounded-lg appearance-none cursor-pointer accent-accent-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>빠르게 (200ms)</span>
          <span>천천히 (800ms)</span>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
        <p className="text-sm text-purple-800">
          💡 <strong>팁:</strong> 기울기와 튕김 효과를 조절해서 생동감 있는 도장 효과를 만들어보세요!
        </p>
      </div>
    </div>
  )
}

export default StampControls

