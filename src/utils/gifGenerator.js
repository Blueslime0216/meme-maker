export const generateGIF = async (image, effect, settings, onProgress) => {
  return new Promise((resolve, reject) => {
    try {
      // 전역 GIF 객체 사용
      if (typeof window.GIF === 'undefined') {
        reject(new Error('GIF.js가 로드되지 않았습니다. 페이지를 새로고침해주세요.'))
        return
      }
      
      // gif.js 설정
      const gif = new window.GIF({
        workers: 2,
        quality: 10,
        workerScript: 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js',
        transparent: settings.backgroundColor === 'transparent' ? 0x00000000 : null,
        background: settings.backgroundColor === 'custom' ? settings.customColor : null
      })

      // 이미지 로드
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

        // 프레임 생성
        for (let frame = 0; frame < totalFrames; frame++) {
          ctx.clearRect(0, 0, width, height)

          if (effect === 'rotate') {
            renderRotateFrame(ctx, img, width, height, frame, totalFrames, settings)
          } else if (effect === 'stamp') {
            renderStampFrame(ctx, img, width, height, frame, settings)
          }

          gif.addFrame(canvas, { delay, copy: true })
          
          if (onProgress) {
            onProgress(frame / totalFrames * 0.8)
          }
        }

        gif.on('progress', (progress) => {
          if (onProgress) {
            onProgress(0.8 + progress * 0.2)
          }
        })

        gif.on('finished', (blob) => {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `animation-${effect}-${Date.now()}.gif`
          a.click()
          URL.revokeObjectURL(url)
          resolve()
        })

        gif.render()
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

  if (settings.direction === 'left') {
    ctx.rotate(-angle)
  } else if (settings.direction === 'right') {
    ctx.rotate(angle)
  } else if (settings.direction === 'up') {
    const scale = Math.abs(Math.cos(angle))
    ctx.scale(1, scale)
    if (Math.sin(angle) < 0) {
      ctx.scale(1, -1)
    }
  } else if (settings.direction === 'down') {
    const scale = Math.abs(Math.cos(angle))
    ctx.scale(1, scale)
    if (Math.sin(angle) > 0) {
      ctx.scale(1, -1)
    }
  }

  const scale = Math.min(width / img.width, height / img.height) * 0.8
  const drawWidth = img.width * scale
  const drawHeight = img.height * scale

  ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
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

