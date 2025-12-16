import { useState } from "react"
import PropTypes from "prop-types"
import { Layout, CheckCircle, Grid3x3, BarChart3 } from "lucide-react"

export default function BoardTypeModal({ onSelect, onClose }) {
  const [selected, setSelected] = useState(null)

  const boardTypes = [
    {
      id: "flowchart",
      name: "Flowchart Board",
      description: "Perfect for creating diagrams, workflows, and process flows",
      icon: Layout,
      color: "from-blue-500 to-cyan-500",
      features: ["Shapes", "Connectors", "Text labels"],
    },
    {
      id: "todo",
      name: "To-Do List Board",
      description: "Organize tasks and track progress with lists and cards",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      features: ["Lists", "Cards", "Drag & Drop"],
    },
    {
      id: "notes",
      name: "Notes Board",
      description: "Collaborative whiteboard for brainstorming and notes",
      icon: BarChart3,
      color: "from-yellow-500 to-orange-500",
      features: ["Text blocks", "Shapes", "Images"],
    },
    {
      id: "mixed",
      name: "Mixed Board",
      description: "All tools available for maximum flexibility",
      icon: Grid3x3,
      color: "from-purple-500 to-pink-500",
      features: ["All tools", "Lists", "Canvas"],
    },
  ]

  const handleSelect = () => {
    if (selected) {
      onSelect(selected)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Choose Board Type</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-all">
            ✕
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {boardTypes.map((type) => {
              const Icon = type.icon
              return (
                <div
                  key={type.id}
                  onClick={() => setSelected(type.id)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all border-2 ${
                    selected === type.id
                      ? `border-purple-500 bg-gradient-to-br ${type.color} text-white shadow-lg shadow-purple-500/40`
                      : "border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div
                      className={`p-3 rounded-lg ${
                        selected === type.id ? "bg-white/20" : `bg-gradient-to-br ${type.color} text-white`
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className={`text-lg font-bold ${selected === type.id ? "text-white" : "text-slate-900"}`}>
                      {type.name}
                    </h3>
                  </div>
                  <p className={`mb-4 ${selected === type.id ? "text-white/90" : "text-slate-600"}`}>
                    {type.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {type.features.map((feature) => (
                      <span
                        key={feature}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          selected === type.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-4 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selected}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Create Board
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

BoardTypeModal.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}
