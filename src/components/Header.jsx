import React from 'react'

function Header() {
  return (
    <header className="py-4 px-4 md:px-6 border-b border-gray-700/50">
      <div className="container mx-auto">
        <h1 className="text-2xl font-black tracking-tight text-white">
          이미지 애니메이터 <span className="text-purple-400">Pro</span>
        </h1>
        <p className="text-sm text-gray-400">애니메이션 생성 & 내보내기</p>
      </div>
    </header>
  )
}

export default Header

