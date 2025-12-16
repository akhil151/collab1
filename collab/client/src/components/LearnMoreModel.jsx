import PropTypes from "prop-types"
import { X, Zap, Users, Layers, Share2, Palette, MessageCircle } from "lucide-react"

export default function LearnMoreModal({ onClose }) {
  const features = [
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description: "Work together instantly with live updates and synchronized changes across all devices."
    },
    {
      icon: Layers,
      title: "Interactive Boards",
      description: "Create dynamic boards with lists, cards, and visual elements for any project workflow."
    },
    {
      icon: Palette,
      title: "Rich Content Tools",
      description: "Add text, shapes, images, and connectors to create comprehensive visual representations."
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Share board URLs with teammates instantly - no complex permissions or setup required."
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Invite team members, track contributions, and manage collaborative workspaces effortlessly."
    },
    {
      icon: MessageCircle,
      title: "Communication Hub",
      description: "Built-in commenting and discussion tools to keep all project communication in one place."
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8 text-white rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Collaborative Board Platform</h2>
            <p className="text-white/90 text-lg leading-relaxed">
              A powerful real-time collaboration tool that brings teams together to create, organize, and visualize projects with interactive boards, rich content tools, and seamless sharing capabilities.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Key Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index} 
                  className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">{feature.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Getting Started */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Getting Started
            </h3>
            <div className="space-y-3 text-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
                <p>Create your first board by clicking the "Create New Board" button</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
                <p>Add lists and cards to organize your project workflow</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-pink-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</div>
                <p>Use the sidebar tools to add text, shapes, and visual elements</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">4</div>
                <p>Share your board URL with team members for real-time collaboration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

LearnMoreModal.propTypes = {
  onClose: PropTypes.func.isRequired
}
