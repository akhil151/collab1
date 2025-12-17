import { ImageIcon, Upload } from "lucide-react"
import { useState } from "react"
import PropTypes from "prop-types"

export default function ImageToolPanel({ onAddImage }) {
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState(null)

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const url = event.target?.result
        onAddImage({
          type: "image",
          src: url,
          x: Math.random() * 300,
          y: Math.random() * 300,
          width: 200,
          height: 150,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddImageUrl = () => {
    if (imageUrl.trim()) {
      onAddImage({
        type: "image",
        src: imageUrl,
        x: Math.random() * 300,
        y: Math.random() * 300,
        width: 200,
        height: 150,
      })
      setImageUrl("")
    }
  }

  return (
    <div className="w-80 bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg">
          <ImageIcon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Image Tool</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-3">Upload Image</label>
          <label className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition-all">
            <Upload className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-600 font-semibold">Click to upload</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">or</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={handleAddImageUrl}
          disabled={!imageUrl}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Add Image from URL
        </button>
      </div>
    </div>
  )
}

ImageToolPanel.propTypes = {
  onAddImage: PropTypes.func.isRequired
}
