import React, { useState } from 'react'
import { Download, FileImage, Loader2 } from 'lucide-react'
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
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6 text-accent-600" />
        <h2 className="text-xl font-bold text-gray-800">내보내기</h2>
      </div>

      {/* 포맷 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          파일 형식
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setExportFormat('gif')}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              ${exportFormat === 'gif'
                ? 'border-accent-500 bg-accent-50 text-accent-700 shadow-md'
                : 'border-gray-200 hover:border-accent-300 hover:bg-gray-50'
              }
            `}
          >
            <FileImage className="w-6 h-6 mx-auto mb-2" />
            <div className="font-bold">GIF</div>
            <div className="text-xs text-gray-600 mt-1">호환성 좋음</div>
          </button>

          <button
            onClick={() => setExportFormat('apng')}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              ${exportFormat === 'apng'
                ? 'border-accent-500 bg-accent-50 text-accent-700 shadow-md'
                : 'border-gray-200 hover:border-accent-300 hover:bg-gray-50'
              }
            `}
          >
            <FileImage className="w-6 h-6 mx-auto mb-2" />
            <div className="font-bold">APNG</div>
            <div className="text-xs text-gray-600 mt-1">고품질</div>
          </button>
        </div>
      </div>

      {/* 다운로드 버튼 */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-3"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>생성 중... {exportProgress}%</span>
          </>
        ) : (
          <>
            <Download className="w-6 h-6" />
            <span>{exportFormat.toUpperCase()} 다운로드</span>
          </>
        )}
      </button>

      {/* 진행 바 */}
      {isExporting && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${exportProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 정보 */}
      <div className="mt-6 space-y-3">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong className="text-purple-700">💡 GIF vs APNG</strong>
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4">
            <li>• <strong>GIF:</strong> 256색, 파일 작음, 모든 곳에서 재생</li>
            <li>• <strong>APNG:</strong> 트루컬러, 고품질, 최신 브라우저 지원</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            ⚡ <strong>최적화:</strong> 압축 알고리즘을 사용하여 파일 크기를 최소화합니다
          </p>
        </div>
      </div>
    </div>
  )
}

export default ExportPanel

