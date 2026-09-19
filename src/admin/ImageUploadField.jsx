import { useRef, useState } from 'react'
import { ImageOff, Loader2, Upload, X } from 'lucide-react'
import { uploadImage } from '../lib/apiClient'

/** Thumbnail + upload button, backed by the PHP backend's /api/upload.php. Falls back to a plain path field for anyone who'd rather paste a URL. */
export default function ImageUploadField({ label, value, onChange, hint }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [broken, setBroken] = useState(false)

  const handlePick = () => inputRef.current?.click()

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return

    setUploading(true)
    setError('')
    try {
      const res = await uploadImage(file)
      onChange(res.url)
      setBroken(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">{label}</span>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-panel-2">
          {value && !broken ? (
            <img src={value} alt="" className="h-full w-full object-cover" onError={() => setBroken(true)} />
          ) : (
            <ImageOff size={18} className="text-muted" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            value={value || ''}
            onChange={(e) => {
              onChange(e.target.value)
              setBroken(false)
            }}
            placeholder="/projects/example.jpg or paste a URL"
            className="w-full rounded-md border border-line bg-panel-2 px-3 py-2 text-sm text-paper outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePick}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
            >
              {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
              {uploading ? 'Uploading…' : 'Upload image'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-muted hover:text-red-400"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          {hint && !error && <p className="text-xs text-muted">{hint}</p>}
        </div>

        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
    </div>
  )
}
