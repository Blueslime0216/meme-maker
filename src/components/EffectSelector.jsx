import React from 'react'
import { RotateCw, Stamp } from 'lucide-react'

const effects = [
  {
    id: 'rotate',
    name: '회전 효과',
    icon: RotateCw,
  },
  {
    id: 'stamp',
    name: '도장 효과',
    icon: Stamp,
  }
]

function EffectSelector({ selectedEffect, onEffectChange }) {
  return (
    <div className="panel-card p-4">
      <h3 className="text-lg font-bold mb-4 px-2 text-white">애니메이션 효과 선택</h3>
      <div className="grid grid-cols-2 gap-3">
        {effects.map((effect) => {
          const Icon = effect.icon
          const isActive = selectedEffect === effect.id

          return (
            <button
              key={effect.id}
              onClick={() => onEffectChange(effect.id)}
              className={`p-4 rounded-xl text-center transition-all duration-200 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
              }`}
            >
              <div className="w-8 h-8 mx-auto mb-2">
                <Icon className="w-full h-full" />
              </div>
              <span className="font-semibold text-sm">{effect.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default EffectSelector

