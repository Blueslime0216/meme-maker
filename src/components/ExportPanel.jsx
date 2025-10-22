import React, { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { generateGIF } from '../utils/gifGenerator'
import { generateAPNG } from '../utils/apngGenerator'

function ExportPanel({ image, effect, settings }) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportFormat, setExportFormat] = useState('gif')

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)

    try {
      if (exportFormat === 'gif') {
        await generateGIF(image, effect, settings, (progress) => {
          setExportProgress(Math.round(progress * 100))
        })
      } else if (exportFormat === 'apng') {
        await generateAPNG(image, effect, settings, (progress) => {
          setExportProgress(Math.round(progress * 100))
        })
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('내보내기 중 오류가 발생했습니다: ' + error.message)
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  return (
    <div className="panel-card p-4">
      <h3 className="text-lg font-bold mb-3 text-white">내보내기</h3>

      {/* 포맷 선택 */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          파일 형식
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setExportFormat('gif')}
            className={`
              p-3 rounded-lg transition-all duration-200 text-center
              ${exportFormat === 'gif'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
              }
            `}
          >
            <div className="font-bold">GIF</div>
            <div className="text-xs mt-1 opacity-80">범용</div>
          </button>

          <button
            onClick={() => setExportFormat('apng')}
            className={`
              p-3 rounded-lg transition-all duration-200 text-center
              ${exportFormat === 'apng'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
              }
            `}
          >
            <div className="font-bold">APNG</div>
            <div className="text-xs mt-1 opacity-80">고품질</div>
          </button>
        </div>
      </div>

      {/* 다운로드 버튼 */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>생성 중 {exportProgress}%</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>{exportFormat.toUpperCase()} 다운로드</span>
          </>
        )}
      </button>

      {/* 진행 바 */}
      {isExporting && (
        <div className="mt-3">
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${exportProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExportPanel

