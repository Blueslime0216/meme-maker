import React from 'react'
import { Sparkles, Wand2 } from 'lucide-react'

function Header() {
  return (
    <header className="glass-card p-8 animate-fade-in">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="relative">
          <Wand2 className="w-12 h-12 text-accent-500 animate-bounce-soft" />
          <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
          이미지 애니메이터
        </h1>
      </div>
      <p className="text-center text-gray-600 text-lg">
        이미지를 업로드하고 멋진 애니메이션 효과를 적용해보세요
      </p>
    </header>
  )
}

export default Header

