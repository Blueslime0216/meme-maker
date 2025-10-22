import React, { useEffect, useRef, useState } from 'react'
import { Eye, Play, Pause } from 'lucide-react'

function Preview({ image, effect, settings }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [img, setImg] = useState(null)

  useEffect(() => {
    if (image) {
      const imgElement = new Image()
      imgElement.onload = () => setImg(imgElement)
      imgElement.src = image.src
    }
  }, [image])

  useEffect(() => {
    if (!canvasRef.current || !img || !effect) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // 캔버스 크기 설정 (프리뷰용으로 적절한 크기로 조정)
    const maxSize = 600
    let width = img.width
    let height = img.height
    
    if (width > maxSize || height > maxSize) {
      const scale = Math.min(maxSize / width, maxSize / height)
      width = Math.floor(width * scale)
      height = Math.floor(height * scale)
    }
    
    canvas.width = width
    canvas.height = height

    let frameCount = 0
    let startTime = Date.now()

    const animate = () => {
      if (!isPlaying) return

      // 캔버스 초기화 (투명 배경)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (effect === 'rotate') {
        animateRotate(ctx, img, width, height, frameCount, settings)
      } else if (effect === 'stamp') {
        animateStamp(ctx, img, width, height, frameCount, settings)
      }

      frameCount++
      animationRef.current = requestAnimationFrame(animate)
    }

    if (isPlaying) {
      animate()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [img, effect, settings, isPlaying])

  const animateRotate = (ctx, img, width, height, frameCount, settings) => {
    const fps = 30
    const rotationDuration = 2 / settings.speed // 초 단위
    const totalFrames = fps * rotationDuration
    const progress = (frameCount % totalFrames) / totalFrames

    // 배경 그리기
    if (settings.backgroundColor === 'custom') {
      ctx.fillStyle = settings.customColor
      ctx.fillRect(0, 0, width, height)
    }

    ctx.save()
    ctx.translate(width / 2, height / 2)

    // 회전 방향에 따른 변환
    let angle = progress * Math.PI * 2

    if (settings.direction === 'left') {
      ctx.rotate(-angle)
    } else if (settings.direction === 'right') {
      ctx.rotate(angle)
    } else if (settings.direction === 'up') {
      // 위로 회전 (Y축 기준 3D 회전 효과)
      const scale = Math.abs(Math.cos(angle))
      ctx.scale(1, scale)
      if (Math.sin(angle) < 0) {
        ctx.scale(1, -1)
      }
    } else if (settings.direction === 'down') {
      // 아래로 회전 (Y축 기준 3D 회전 효과)
      const scale = Math.abs(Math.cos(angle))
      ctx.scale(1, scale)
      if (Math.sin(angle) > 0) {
        ctx.scale(1, -1)
      }
    }

    // 이미지 크기 조정
    const scale = Math.min(width / img.width, height / img.height) * 0.8
    const drawWidth = img.width * scale
    const drawHeight = img.height * scale

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    ctx.restore()
  }

  const animateStamp = (ctx, img, width, height, frameCount, settings) => {
    const fps = 30
    const frameDuration = settings.duration / 1000 * fps // 찍히는 애니메이션 프레임 수
    const waitFrames = Math.floor(settings.waitTime / 1000 * fps) // 대기 프레임 수
    const bounceFrames = 8 // 튕김 효과 프레임 수
    const totalFrames = settings.emptyFrames + frameDuration + bounceFrames + waitFrames
    
    const currentFrame = frameCount % totalFrames

    // 투명한 빈 프레임
    if (currentFrame < settings.emptyFrames) {
      return
    }

    const animFrame = currentFrame - settings.emptyFrames

    // 이미지 크기 조정
    const scale = Math.min(width / img.width, height / img.height) * 0.6
    const drawWidth = img.width * scale
    const drawHeight = img.height * scale

    ctx.save()
    ctx.translate(width / 2, height / 2)
    ctx.rotate((settings.angle * Math.PI) / 180)

    if (animFrame < frameDuration) {
      // 찍히는 애니메이션
      const progress = animFrame / frameDuration
      const easeProgress = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      
      const currentScale = settings.initialScale - (settings.initialScale - 1) * easeProgress
      const currentWidth = drawWidth * currentScale
      const currentHeight = drawHeight * currentScale

      ctx.drawImage(img, -currentWidth / 2, -currentHeight / 2, currentWidth, currentHeight)
    } else if (animFrame < frameDuration + bounceFrames) {
      // 튕김 효과
      const bounceFrame = animFrame - frameDuration
      const bounceProgress = bounceFrame / bounceFrames
      
      let bounceScale = 1
      if (bounceProgress < 0.5) {
        // 커지기
        bounceScale = 1 + (settings.bounceScale - 1) * (bounceProgress * 2)
      } else {
        // 작아지기
        bounceScale = settings.bounceScale - (settings.bounceScale - 1) * ((bounceProgress - 0.5) * 2)
      }

      // 원본 이미지
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)

      // 투명한 복제 이미지
      ctx.globalAlpha = 1 - bounceProgress
      const ghostWidth = drawWidth * bounceScale
      const ghostHeight = drawHeight * bounceScale
      ctx.drawImage(img, -ghostWidth / 2, -ghostHeight / 2, ghostWidth, ghostHeight)
      ctx.globalAlpha = 1
    } else {
      // 정지 상태
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    }

    ctx.restore()
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  if (!image || !effect) {
    return (
      <div className="glass-card p-12 animate-slide-up">
        <div className="text-center text-gray-400">
          <Eye className="w-24 h-24 mx-auto mb-4 opacity-50" />
          <p className="text-lg">이미지와 효과를 선택하면 프리뷰가 표시됩니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Eye className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-800">실시간 프리뷰</h2>
        </div>
        <button
          onClick={togglePlayPause}
          className="btn-secondary flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              일시정지
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              재생
            </>
          )}
        </button>
      </div>

      <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center min-h-[400px]" style={{
        background: 'repeating-conic-gradient(#f3f4f6 0% 25%, #e5e7eb 0% 50%) 50% / 20px 20px'
      }}>
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-[600px] shadow-2xl rounded-lg"
          style={{ imageRendering: 'high-quality' }}
        />
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 text-center">
          ✨ 설정을 변경하면 프리뷰가 자동으로 업데이트됩니다
        </p>
      </div>
    </div>
  )
}

export default Preview

