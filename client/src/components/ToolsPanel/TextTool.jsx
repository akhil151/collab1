import { useState } from "react"
import PropTypes from "prop-types"
import { Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

export default function TextToolPanel({ onAddText }) {
  const [text, setText] = useState("")
  const [fontSize, setFontSize] = useState(16)
  const [color, setColor] = useState("#000000")
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [underline, setUnderline] = useState(false)
  const [align, setAlign] = useState("left")

  const handleAddText = () => {
    if (text.trim()) {
      onAddText({
        text,
        fontSize,
        color,
        bold,
        italic,
        underline,
        align,
        type: "text",
        x: Math.random() * 300,
        y: Math.random() * 300,
      })
      setText("")
    }
  }

  return (
    <div className="w-80 bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
          <Type className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Text Tool</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Text Content</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="3"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Font Size: {fontSize}px</label>
          <input
            type="range"
            min="8"
            max="48"
            value={fontSize}
            onChange={(e) => setFontSize(Number.parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border border-slate-300"
            />
            <span className="text-sm text-slate-600">{color}</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Style</label>
          <div className="flex gap-2">
            <button
              onClick={() => setBold(!bold)}
              className={`p-2 rounded-lg transition-all ${
                bold
                  ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              <Bold className="w-5 h-5" />
            </button>
            <button
              onClick={() => setItalic(!italic)}
              className={`p-2 rounded-lg transition-all ${
                italic
                  ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              <Italic className="w-5 h-5" />
            </button>
            <button
              onClick={() => setUnderline(!underline)}
              className={`p-2 rounded-lg transition-all ${
                underline
                  ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              <Underline className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Alignment</label>
          <div className="flex gap-2">
            {[
              { id: "left", icon: AlignLeft },
              { id: "center", icon: AlignCenter },
              { id: "right", icon: AlignRight },
            ].map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setAlign(id)}
                className={`flex-1 p-2 rounded-lg transition-all ${
                  align === id
                    ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                <Icon className="w-5 h-5 mx-auto" />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddText}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-lg transition-all"
        >
          Add Text
        </button>
      </div>
    </div>
  )
}

TextToolPanel.propTypes = {
  onAddText: PropTypes.func.isRequired
}
