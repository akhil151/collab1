import { Square, Circle, Hexagon, Triangle } from "lucide-react"
import { useState } from "react"
import PropTypes from "prop-types"

export default function ShapesToolPanel({ onAddShape }) {
  const [selectedColor, setSelectedColor] = useState("#9333ea")

  const shapes = [
    { id: "rect", name: "Rectangle", icon: Square },
    { id: "circle", name: "Circle", icon: Circle },
    { id: "hexagon", name: "Hexagon", icon: Hexagon },
    { id: "triangle", name: "Triangle", icon: Triangle },
  ]

  return (
    <div className="w-80 bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
          <Square className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Shapes Tool</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Shape Color</label>
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

        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-3">Select Shape</label>
          <div className="grid grid-cols-2 gap-3">
            {shapes.map((shape) => {
              const Icon = shape.icon
              return (
                <button
                  key={shape.id}
                  onClick={() =>
                    onAddShape({
                      type: "shape",
                      shapeType: shape.id,
                      color: selectedColor,
                      x: Math.random() * 300,
                      y: Math.random() * 300,
                      width: 100,
                      height: 100,
                    })
                  }
                  className="p-4 rounded-lg border-2 border-slate-300 hover:border-green-500 hover:bg-green-50 transition-all flex flex-col items-center gap-2"
                >
                  <Icon className="w-6 h-6 text-slate-700" />
                  <span className="text-xs font-semibold text-slate-700">{shape.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700">Drag shapes on the canvas to move. Double-click to delete.</p>
        </div>
      </div>
    </div>
  )
}

ShapesToolPanel.propTypes = {
  onAddShape: PropTypes.func.isRequired
}
