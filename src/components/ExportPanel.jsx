import React, { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { generateAPNG } from '../utils/apngGenerator'
import { generateGIF } from '../utils/gifGenerator'

function ExportPanel({ image, effect, settings }) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportType, setExportType] = useState('')

  const handleAPNGExport = async () => {
    setIsExporting(true)
    setExportProgress(0)
    setExportType('APNG')

    try {
      await generateAPNG(image, effect, settings, (progress) => {
        setExportProgress(Math.round(progress * 100))
      })
    } catch (error) {
      console.error('APNG Export error:', error)
      alert('APNG 내보내기 중 오류가 발생했습니다: ' + error.message)
    } finally {
      setIsExporting(false)
      setExportProgress(0)
      setExportType('')
    }
  }

  const handleGIFExport = async () => {
    setIsExporting(true)
    setExportProgress(0)
    setExportType('GIF')

    try {
      await generateGIF(image, effect, settings, (progress) => {
        setExportProgress(Math.round(progress * 100))
      })
    } catch (error) {
      console.error('GIF Export error:', error)
      alert('GIF 내보내기 중 오류가 발생했습니다: ' + error.message)
    } finally {
      setIsExporting(false)
      setExportProgress(0)
      setExportType('')
    }
  }

  return (
    <div className="panel-card p-4">
      <h3 className="text-lg font-bold mb-3 text-white">내보내기</h3>

      {/* 내보내기 버튼들 */}
      <div className="grid grid-cols-2 gap-2">
        {/* APNG 다운로드 버튼 */}
        <button
          onClick={handleAPNGExport}
          disabled={isExporting}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {isExporting && exportType === 'APNG' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">APNG {exportProgress}%</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span className="text-sm">APNG</span>
            </>
          )}
        </button>

        {/* GIF 다운로드 버튼 */}
        <button
          onClick={handleGIFExport}
          disabled={isExporting}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {isExporting && exportType === 'GIF' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">GIF {exportProgress}%</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span className="text-sm">GIF</span>
            </>
          )}
        </button>
      </div>

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

