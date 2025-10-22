import UPNG from 'upng-js'

export const generateAPNG = async (image, effect, settings, onProgress) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // 캔버스 크기 설정
        const maxSize = 800
        let width = img.width
        let height = img.height

        if (width > maxSize || height > maxSize) {
          const scale = Math.min(maxSize / width, maxSize / height)
          width = Math.floor(width * scale)
          height = Math.floor(height * scale)
        }

        canvas.width = width
        canvas.height = height

        const fps = 30
        let totalFrames, delay

        if (effect === 'rotate') {
          const duration = 2 / settings.speed
          totalFrames = Math.floor(fps * duration)
          delay = Math.floor(1000 / fps)
        } else if (effect === 'stamp') {
          const frameDuration = Math.floor(settings.duration / 1000 * fps)
          const waitFrames = Math.floor(settings.waitTime / 1000 * fps)
          const bounceFrames = 8
          totalFrames = settings.emptyFrames + frameDuration + bounceFrames + waitFrames
          delay = Math.floor(1000 / fps)
        }

        const frames = []
        const delays = []

        // 프레임 생성
        for (let frame = 0; frame < totalFrames; frame++) {
          ctx.clearRect(0, 0, width, height)

          if (effect === 'rotate') {
            renderRotateFrame(ctx, img, width, height, frame, totalFrames, settings)
          } else if (effect === 'stamp') {
            renderStampFrame(ctx, img, width, height, frame, settings)
          }

          // 프레임 데이터 추출
          const imageData = ctx.getImageData(0, 0, width, height)
          frames.push(imageData.data.buffer)
          delays.push(delay)

          if (onProgress) {
            onProgress(frame / totalFrames)
          }
        }

        // APNG 생성
        const apng = UPNG.encode(frames, width, height, 0, delays)
        const blob = new Blob([apng], { type: 'image/apng' })
        
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `animation-${effect}-${Date.now()}.png`
        a.click()
        URL.revokeObjectURL(url)
        
        resolve()
      }

      img.onerror = () => reject(new Error('이미지 로드 실패'))
      img.src = image.src
    } catch (error) {
      reject(error)
    }
  })
}

const renderRotateFrame = (ctx, img, width, height, frame, totalFrames, settings) => {
  const progress = frame / totalFrames

  // 배경 그리기
  if (settings.backgroundColor === 'custom') {
    ctx.fillStyle = settings.customColor
    ctx.fillRect(0, 0, width, height)
  }

  ctx.save()
  ctx.translate(width / 2, height / 2)

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

const renderStampFrame = (ctx, img, width, height, frame, settings) => {
  const fps = 30
  const frameDuration = Math.floor(settings.duration / 1000 * fps)
  const waitFrames = Math.floor(settings.waitTime / 1000 * fps)
  const bounceFrames = 8

  if (frame < settings.emptyFrames) {
    // 투명한 빈 프레임
    return
  }

  const animFrame = frame - settings.emptyFrames

  const scale = Math.min(width / img.width, height / img.height) * 0.6
  const drawWidth = img.width * scale
  const drawHeight = img.height * scale

  ctx.save()
  ctx.translate(width / 2, height / 2)
  ctx.rotate((settings.angle * Math.PI) / 180)

  if (animFrame < frameDuration) {
    const progress = animFrame / frameDuration
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    
    const currentScale = settings.initialScale - (settings.initialScale - 1) * easeProgress
    const currentWidth = drawWidth * currentScale
    const currentHeight = drawHeight * currentScale

    ctx.drawImage(img, -currentWidth / 2, -currentHeight / 2, currentWidth, currentHeight)
  } else if (animFrame < frameDuration + bounceFrames) {
    const bounceFrame = animFrame - frameDuration
    const bounceProgress = bounceFrame / bounceFrames
    
    let bounceScale = 1
    if (bounceProgress < 0.5) {
      bounceScale = 1 + (settings.bounceScale - 1) * (bounceProgress * 2)
    } else {
      bounceScale = settings.bounceScale - (settings.bounceScale - 1) * ((bounceProgress - 0.5) * 2)
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)

    ctx.globalAlpha = 1 - bounceProgress
    const ghostWidth = drawWidth * bounceScale
    const ghostHeight = drawHeight * bounceScale
    ctx.drawImage(img, -ghostWidth / 2, -ghostHeight / 2, ghostWidth, ghostHeight)
    ctx.globalAlpha = 1
  } else {
    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
  }

  ctx.restore()
}

