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
      } else if (effect === 'shake') {
        animateShake(ctx, img, width, height, frameCount, settings)
      } else if (effect === 'glow') {
        animateGlow(ctx, img, width, height, frameCount, settings)
      } else if (effect === 'wave') {
        animateWave(ctx, img, width, height, frameCount, settings)
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

  // 출력 영역 표시 함수
  const drawOutputBounds = (ctx, width, height) => {
    ctx.save()
    ctx.strokeStyle = '#ff0000'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.strokeRect(0, 0, width, height)
    ctx.restore()
  }

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

    // 이미지 크기 조정
    const baseScale = Math.min(width / img.width, height / img.height) * 0.8
    const drawWidth = img.width * baseScale
    const drawHeight = img.height * baseScale

    if (settings.direction === 'left') {
      // 왼쪽으로 Z축 회전
      ctx.rotate(-angle)
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    } else if (settings.direction === 'right') {
      // 오른쪽으로 Z축 회전
      ctx.rotate(angle)
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    } else if (settings.direction === 'up') {
      // 위로 회전 (X축 기준 3D 회전 효과)
      const rotationAngle = angle
      
      // 3D 회전을 시뮬레이션하기 위한 변환
      const scaleY = Math.cos(rotationAngle)
      
      // 회전에 따른 스케일링
      ctx.scale(1, Math.abs(scaleY))
      
      // 뒷면일 때 수평 뒤집기
      if (scaleY < 0) {
        ctx.scale(1, -1)
      }
      
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    } else if (settings.direction === 'down') {
      // 옆으로 회전 (Y축 기준 3D 회전 효과)
      const rotationAngle = angle
      
      // 3D 회전을 시뮬레이션하기 위한 변환 (Y축 회전은 X축 스케일링)
      const scaleX = Math.cos(rotationAngle)
      
      // 회전에 따른 스케일링
      ctx.scale(Math.abs(scaleX), 1)
      
      // 뒷면일 때 수직 뒤집기
      if (scaleX < 0) {
        ctx.scale(-1, 1)
      }
      
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    }

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
    
    // 출력 영역 표시
    drawOutputBounds(ctx, width, height)
  }

  const animateShake = (ctx, img, width, height, frameCount, settings) => {
    const fps = 30
    const shakesPerSecond = settings.frequency / settings.speed
    const framesPerShake = fps / shakesPerSecond
    const progress = (frameCount % framesPerShake) / framesPerShake
    
    // 사인파를 이용한 흔들림
    const shakeOffset = Math.sin(progress * Math.PI * 2) * settings.intensity
    
    ctx.save()
    
    // 방향에 따른 변위
    let offsetX = 0
    let offsetY = 0
    
    if (settings.direction === 'horizontal') {
      offsetX = shakeOffset
    } else if (settings.direction === 'vertical') {
      offsetY = shakeOffset
    } else if (settings.direction === 'both') {
      offsetX = Math.sin(progress * Math.PI * 2) * settings.intensity
      offsetY = Math.cos(progress * Math.PI * 2) * settings.intensity
    }
    
    ctx.translate(width / 2 + offsetX, height / 2 + offsetY)
    
    // 이미지 크기 조정
    const scale = Math.min(width / img.width, height / img.height) * 0.8
    const drawWidth = img.width * scale
    const drawHeight = img.height * scale
    
    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    ctx.restore()
    
    // 출력 영역 표시
    drawOutputBounds(ctx, width, height)
  }

  const animateGlow = (ctx, img, width, height, frameCount, settings) => {
    const fps = 30
    const glowDuration = 2 / settings.speed
    const totalFrames = fps * glowDuration
    const progress = (frameCount % totalFrames) / totalFrames
    
    ctx.save()
    ctx.translate(width / 2, height / 2)
    
    // 이미지 크기 조정
    const scale = Math.min(width / img.width, height / img.height) * 0.8
    const drawWidth = img.width * scale
    const drawHeight = img.height * scale
    
    if (settings.glowType === 'brightness') {
      // 밝기 변화
      const brightness = 1 + (settings.intensity - 1) * (Math.sin(progress * Math.PI * 2) * 0.5 + 0.5)
      ctx.filter = `brightness(${brightness})`
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    } else if (settings.glowType === 'rainbow') {
      // 무지개 색상 변화
      const hue = progress * 360
      ctx.filter = `hue-rotate(${hue}deg) saturate(150%)`
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    } else if (settings.glowType === 'pulse') {
      // 투명도 변화 (펄스)
      const opacity = settings.minOpacity + (settings.maxOpacity - settings.minOpacity) * (Math.sin(progress * Math.PI * 2) * 0.5 + 0.5)
      ctx.globalAlpha = opacity
      
      // 색상 오버레이
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
      
      // 글로우 효과
      ctx.globalCompositeOperation = 'screen'
      ctx.fillStyle = settings.glowColor
      ctx.globalAlpha = (1 - opacity) * 0.3
      ctx.fillRect(-drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    }
    
    ctx.restore()
    
    // 출력 영역 표시
    drawOutputBounds(ctx, width, height)
  }

  const animateWave = (ctx, img, width, height, frameCount, settings) => {
    const fps = 30
    const waveDuration = 2 / settings.speed
    const totalFrames = fps * waveDuration
    const progress = (frameCount % totalFrames) / totalFrames
    const timeOffset = progress * Math.PI * 2
    
    // 이미지 크기 조정
    const scale = Math.min(width / img.width, height / img.height) * 0.8
    const drawWidth = img.width * scale
    const drawHeight = img.height * scale
    
    // 임시 캔버스에 이미지 그리기
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = drawWidth
    tempCanvas.height = drawHeight
    const tempCtx = tempCanvas.getContext('2d')
    tempCtx.drawImage(img, 0, 0, drawWidth, drawHeight)
    
    ctx.save()
    ctx.translate(width / 2, height / 2)
    
    if (settings.waveType === 'horizontal') {
      // 가로 물결
      const sliceHeight = 2
      for (let y = 0; y < drawHeight; y += sliceHeight) {
        const waveOffset = Math.sin((y / drawHeight) * Math.PI * settings.frequency + timeOffset) * settings.amplitude * settings.distortion
        ctx.drawImage(
          tempCanvas,
          0, y, drawWidth, sliceHeight,
          -drawWidth / 2 + waveOffset, -drawHeight / 2 + y, drawWidth, sliceHeight
        )
      }
    } else if (settings.waveType === 'vertical') {
      // 세로 물결
      const sliceWidth = 2
      for (let x = 0; x < drawWidth; x += sliceWidth) {
        const waveOffset = Math.sin((x / drawWidth) * Math.PI * settings.frequency + timeOffset) * settings.amplitude * settings.distortion
        ctx.drawImage(
          tempCanvas,
          x, 0, sliceWidth, drawHeight,
          -drawWidth / 2 + x, -drawHeight / 2 + waveOffset, sliceWidth, drawHeight
        )
      }
    } else if (settings.waveType === 'circular') {
      // 원형 물결
      const centerX = drawWidth / 2
      const centerY = drawHeight / 2
      const sliceSize = 2
      
      for (let y = 0; y < drawHeight; y += sliceSize) {
        for (let x = 0; x < drawWidth; x += sliceSize) {
          const dx = x - centerX
          const dy = y - centerY
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY)
          const waveOffset = Math.sin((distance / maxDistance) * Math.PI * settings.frequency + timeOffset) * settings.amplitude * settings.distortion
          
          const angle = Math.atan2(dy, dx)
          const offsetX = Math.cos(angle) * waveOffset
          const offsetY = Math.sin(angle) * waveOffset
          
          ctx.drawImage(
            tempCanvas,
            x, y, sliceSize, sliceSize,
            -drawWidth / 2 + x + offsetX, -drawHeight / 2 + y + offsetY, sliceSize, sliceSize
          )
        }
      }
    }
    
    ctx.restore()
    
    // 출력 영역 표시
    drawOutputBounds(ctx, width, height)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  if (!image || !effect) {
    return (
      <div className="panel-card p-12 flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-xl font-medium">이미지를 업로드하세요</p>
          <p className="text-sm mt-2">실시간 프리뷰가 여기에 표시됩니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="panel-card p-4 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white">실시간 프리뷰</h3>
        <button
          onClick={togglePlayPause}
          className="btn-secondary flex items-center gap-2 text-sm py-2 px-4"
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

      <div className="flex-1 rounded-lg p-4 flex items-center justify-center" style={{
        background: 'repeating-conic-gradient(#1f2937 0% 25%, #111827 0% 50%) 50% / 20px 20px'
      }}>
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full rounded shadow-xl"
          style={{ imageRendering: 'high-quality' }}
        />
      </div>
    </div>
  )
}

export default Preview

