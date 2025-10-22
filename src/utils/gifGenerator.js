import GIF from 'gif.js'

export const generateGIF = async (image, effect, settings, onProgress) => {
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

        // 안티앨리어싱 비활성화로 깔끔한 경계선 보장
        ctx.imageSmoothingEnabled = false

        const fps = 15 // FPS 줄여서 속도 개선
        let totalFrames, delay

        if (effect === 'rotate') {
          const duration = 2 / settings.speed
          totalFrames = Math.max(8, Math.floor(fps * duration)) // 최소 8프레임
          delay = Math.floor(1000 / fps)
        } else if (effect === 'stamp') {
          const frameDuration = Math.max(3, Math.floor(settings.duration / 1000 * fps))
          const waitFrames = Math.max(2, Math.floor(settings.waitTime / 1000 * fps))
          const bounceFrames = 4 // 바운스 프레임 줄임
          totalFrames = settings.emptyFrames + frameDuration + bounceFrames + waitFrames
          delay = Math.floor(1000 / fps)
        }

        // GIF 생성기 설정
        const gif = new GIF({
          workers: 1,
          quality: 20,
          width: width,
          height: height,
          transparent: settings.backgroundColor === 'transparent' ? 0x00FF00 : null,
          workerScript: '/gif.worker.js'
        })

        // 진행률 추적
        let framesAdded = 0
        gif.on('progress', (p) => {
          if (onProgress) {
            onProgress(p)
          }
        })

        gif.on('finished', (blob) => {
          console.log('GIF 생성 완료:', blob.size, 'bytes')
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `animation-${effect}-${Date.now()}.gif`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          resolve()
        })

        gif.on('start', () => {
          console.log('GIF 렌더링 시작')
        })

        gif.on('abort', () => {
          console.log('GIF 생성 중단')
          reject(new Error('GIF 생성이 중단되었습니다'))
        })

        // 프레임 생성 및 추가
        console.log(`총 ${totalFrames}개 프레임 생성 시작, delay: ${delay}ms`)
        for (let frame = 0; frame < totalFrames; frame++) {
          // 캔버스 초기화
          ctx.clearRect(0, 0, width, height)
          
          // 투명 배경이 아닌 경우 먼저 배경 그리기
          if (settings.backgroundColor === 'custom') {
            ctx.fillStyle = settings.customColor
            ctx.fillRect(0, 0, width, height)
          } else if (settings.backgroundColor === 'transparent') {
            // 투명 배경을 위한 키 컬러 (초록색) - 나중에 덮어씌움
            ctx.fillStyle = '#00FF00'
            ctx.fillRect(0, 0, width, height)
          } else {
            // 기본 배경색 (흰색)
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, width, height)
          }

          if (effect === 'rotate') {
            renderRotateFrame(ctx, img, width, height, frame, totalFrames, settings)
          } else if (effect === 'stamp') {
            renderStampFrame(ctx, img, width, height, frame, settings)
          }

          // 투명 배경의 경우: 이미지가 없는 투명 픽셀만 초록색으로 채우기
          if (settings.backgroundColor === 'transparent') {
            const imageData = ctx.getImageData(0, 0, width, height)
            const data = imageData.data
            
            for (let i = 0; i < data.length; i += 4) {
              // 완전히 투명한 픽셀만 초록색으로 변경
              if (data[i + 3] === 0) {
                data[i] = 0      // R
                data[i + 1] = 255  // G
                data[i + 2] = 0    // B
                data[i + 3] = 255  // A (불투명)
              }
            }
            
            ctx.putImageData(imageData, 0, 0)
          }

          // 프레임을 GIF에 추가
          gif.addFrame(canvas, { delay: delay, copy: true })
          framesAdded++

          if (onProgress) {
            onProgress(framesAdded / totalFrames * 0.8) // 80%까지는 프레임 생성
          }
        }

        // GIF 렌더링 시작
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
  const fps = 15
  const frameDuration = Math.max(3, Math.floor(settings.duration / 1000 * fps))
  const waitFrames = Math.max(2, Math.floor(settings.waitTime / 1000 * fps))
  const bounceFrames = 4

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
