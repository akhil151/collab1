import { Link2, ArrowRight, Minus, CornerDownRight } from "lucide-react"
import { useState } from "react"
import PropTypes from "prop-types"

export default function ConnectToolPanel({ onAddConnector, canvasElements }) {
  const [selectedLineStyle, setSelectedLineStyle] = useState("straight")
  const [selectedArrowStyle, setSelectedArrowStyle] = useState("arrow")
  const [selectedColor, setSelectedColor] = useState("#9333ea")
  const [connectMode, setConnectMode] = useState(false)
  const [selectedElements, setSelectedElements] = useState([])

  const lineStyles = [
    { id: "straight", name: "Straight", icon: Minus },
    { id: "curved", name: "Curved", icon: CornerDownRight },
    { id: "orthogonal", name: "Orthogonal", icon: CornerDownRight },
  ]

  const arrowStyles = [
    { id: "arrow", name: "Arrow", icon: ArrowRight },
    { id: "none", name: "No Arrow", icon: Minus },
  ]

  const handleCreateConnector = () => {
    if (selectedElements.length === 2) {
      onAddConnector({
        type: "connector",
        fromElement: selectedElements[0],
        toElement: selectedElements[1],
        lineStyle: selectedLineStyle,
        arrowStyle: selectedArrowStyle,
        color: selectedColor,
        id: Date.now().toString(),
      })
      setSelectedElements([])
      setConnectMode(false)
    }
  }

  return (
    <div className="w-80 bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg">
          <Link2 className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Connect Tool</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Line Style</label>
          <div className="grid grid-cols-3 gap-2">
            {lineStyles.map((style) => {
              const Icon = style.icon
              return (
                <button
                  key={style.id}
                  onClick={() => setSelectedLineStyle(style.id)}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                    selectedLineStyle === style.id
                      ? "border-pink-500 bg-pink-50"
                      : "border-slate-300 hover:border-pink-300"
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-semibold text-slate-700">{style.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Arrow Style</label>
          <div className="grid grid-cols-2 gap-2">
            {arrowStyles.map((style) => {
              const Icon = style.icon
              return (
                <button
                  key={style.id}
                  onClick={() => setSelectedArrowStyle(style.id)}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                    selectedArrowStyle === style.id
                      ? "border-pink-500 bg-pink-50"
                      : "border-slate-300 hover:border-pink-300"
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-semibold text-slate-700">{style.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Line Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border border-slate-300"
            />
            <span className="text-sm text-slate-600">{selectedColor}</span>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-slate-700">Connect Mode</label>
            <button
              onClick={() => {
                setConnectMode(!connectMode)
                setSelectedElements([])
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                connectMode
                  ? "bg-pink-500 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {connectMode ? "ON" : "OFF"}
            </button>
          </div>
          
          {connectMode && (
            <div className="space-y-2">
              <p className="text-xs text-slate-600">
                Click on two elements to connect them. Selected: {selectedElements.length}/2
              </p>
              {selectedElements.length === 2 && (
                <button
                  onClick={handleCreateConnector}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:shadow-lg transition-all"
                >
                  Create Connection
                </button>
              )}
            </div>
          )}
        </div>

        {!connectMode && (
          <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
            <p className="text-sm text-pink-700">
              Enable Connect Mode to link elements together with customizable connectors.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

ConnectToolPanel.propTypes = {
  onAddConnector: PropTypes.func.isRequired,
  canvasElements: PropTypes.array.isRequired
}