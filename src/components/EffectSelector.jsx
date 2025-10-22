import React from 'react'
import { RotateCw, Stamp, Sparkles } from 'lucide-react'

const effects = [
  {
    id: 'rotate',
    name: '회전 효과',
    description: '이미지를 360도 회전시켜요',
    icon: RotateCw,
    gradient: 'from-blue-400 to-cyan-500',
    disabled: false
  },
  {
    id: 'stamp',
    name: '도장 효과',
    description: '쿵! 도장 찍듯이 찍혀요',
    icon: Stamp,
    gradient: 'from-purple-400 to-pink-500',
    disabled: false
  },
  {
    id: 'more',
    name: '더 많은 효과',
    description: '곧 추가될 예정이에요',
    icon: Sparkles,
    gradient: 'from-gray-300 to-gray-400',
    disabled: true
  }
]

function EffectSelector({ selectedEffect, onEffectChange, disabled }) {
  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-accent-600" />
        <h2 className="text-xl font-bold text-gray-800">효과 선택</h2>
      </div>

      {disabled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800 text-center">
            먼저 이미지를 업로드해주세요
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {effects.map((effect) => {
          const Icon = effect.icon
          const isActive = selectedEffect === effect.id
          const isDisabled = disabled || effect.disabled

          return (
            <button
              key={effect.id}
              onClick={() => !isDisabled && onEffectChange(effect.id)}
              disabled={isDisabled}
              className={`
                effect-card bg-gradient-to-br ${effect.gradient} text-white
                ${isActive ? 'active' : ''}
                ${isDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
                relative overflow-hidden
              `}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-7 h-7" />
                  <h3 className="text-lg font-bold">{effect.name}</h3>
                </div>
                <p className="text-sm text-white/90">{effect.description}</p>
              </div>
              
              {isActive && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
              
              {effect.disabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                  <span className="text-xs font-semibold bg-white/90 text-gray-700 px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default EffectSelector

