export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-cyan-900/20 to-pink-900/20 opacity-50"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="glass-dark sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CB</span>
            </div>
            <span className="text-2xl font-bold gradient-text">CollabBoard</span>
          </div>
          <div className="text-sm text-slate-400">Real-Time Collaboration Platform</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20 animate-slide-in-up">
          <div className="inline-block mb-6">
            <div className="glass rounded-full px-4 py-2 text-sm font-semibold">
              <span className="gradient-text">✨ Premium Collaboration Experience</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Real-Time Collaboration <span className="gradient-text">Made Beautiful</span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            A stunning MERN + Socket.io collaboration board with drag-and-drop cards, real-time synchronization, and
            team management. Experience seamless teamwork like never before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 gradient-bg-primary hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Launch App ✨
            </a>
            <a
              href="#features"
              className="px-8 py-4 glass hover:border-primary/50 text-white font-semibold rounded-xl transition-all duration-300"
            >
              Explore Features →
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              gradient: "from-purple-600 to-purple-400",
              icon: "⚡",
              title: "Real-Time Sync",
              desc: "See changes instantly across all collaborators",
            },
            {
              gradient: "from-cyan-600 to-cyan-400",
              icon: "🎯",
              title: "Drag & Drop",
              desc: "Intuitive card organization with smooth animations",
            },
            {
              gradient: "from-pink-600 to-pink-400",
              icon: "👥",
              title: "Team Collaboration",
              desc: "Add members, assign cards, track activity",
            },
            {
              gradient: "from-emerald-600 to-emerald-400",
              icon: "🔐",
              title: "Secure Auth",
              desc: "JWT with bcrypt password hashing",
            },
            {
              gradient: "from-blue-600 to-cyan-400",
              icon: "🎨",
              title: "Modern UI",
              desc: "Professional glassmorphism design",
            },
            {
              gradient: "from-violet-600 to-pink-400",
              icon: "📱",
              title: "Responsive",
              desc: "Desktop, tablet, and mobile ready",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="card-premium group hover-lift animate-slide-in-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:shadow-lg group-hover:shadow-current/50 transition-all`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="card-premium mb-20 hover-lift animate-slide-in-up" style={{ animationDelay: "200ms" }}>
          <h2 className="text-3xl font-bold mb-8">
            <span className="gradient-text">Technology Stack</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold text-cyan-400 mb-4">Frontend</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>✓ React 18 + Vite</li>
                <li>✓ Zustand State</li>
                <li>✓ Socket.io Client</li>
                <li>✓ Beautiful DND</li>
                <li>✓ Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-400 mb-4">Backend</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>✓ Express.js</li>
                <li>✓ Node.js Runtime</li>
                <li>✓ MongoDB Atlas</li>
                <li>✓ Mongoose ODM</li>
                <li>✓ Socket.io Server</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-pink-400 mb-4">Features</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>✓ User Auth System</li>
                <li>✓ Board Management</li>
                <li>✓ Lists & Cards</li>
                <li>✓ Real-Time Sync</li>
                <li>✓ Team Management</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-emerald-400 mb-4">Deployment</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>✓ Vercel Frontend</li>
                <li>✓ Render Backend</li>
                <li>✓ MongoDB Atlas DB</li>
                <li>✓ Environment Config</li>
                <li>✓ CI/CD Ready</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="space-y-6 mb-20">
          {[
            {
              gradient: "from-purple-500/10 to-violet-500/10",
              border: "border-purple-500/20",
              title: "🔐 Secure Authentication",
              items: ["JWT token generation", "Bcrypt password hashing", "Protected routes", "Session management"],
            },
            {
              gradient: "from-cyan-500/10 to-blue-500/10",
              border: "border-cyan-500/20",
              title: "👥 Real-Time Collaboration",
              items: ["Instant card updates", "Live drag-and-drop sync", "User presence tracking", "Activity feed"],
            },
            {
              gradient: "from-pink-500/10 to-red-500/10",
              border: "border-pink-500/20",
              title: "✨ Modern UI/UX",
              items: ["Glassmorphism effects", "Smooth animations", "Gradient design", "Responsive layout"],
            },
          ].map((section, idx) => (
            <div
              key={idx}
              className={`card-premium border ${section.border} bg-gradient-to-br ${section.gradient} hover-lift animate-slide-in-up`}
              style={{ animationDelay: `${300 + idx * 100}ms` }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {section.items.map((item, i) => (
                  <div key={i} className="text-slate-300 text-sm">
                    ✓ {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Setup Instructions */}
        <div className="card-premium mb-20 hover-lift animate-slide-in-up" style={{ animationDelay: "500ms" }}>
          <h2 className="text-3xl font-bold mb-8">
            <span className="gradient-text">Quick Start Guide</span>
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">Backend Setup</h3>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-emerald-400 space-y-1 overflow-x-auto">
                  <p>$ cd server && npm install</p>
                  <p>$ cp .env.example .env</p>
                  <p className="text-slate-500"># Configure MongoDB & JWT</p>
                  <p>$ npm run dev</p>
                </div>
              </div>
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-4">Frontend Setup</h3>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-emerald-400 space-y-1 overflow-x-auto">
                  <p>$ cd client && npm install</p>
                  <p>$ cp .env.example .env</p>
                  <p className="text-slate-500"># Set API & Socket URLs</p>
                  <p>$ npm run dev</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12 animate-slide-in-up" style={{ animationDelay: "600ms" }}>
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start <span className="gradient-text">Collaborating?</span>
          </h2>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 gradient-bg-primary hover:shadow-2xl hover:shadow-purple-500/50 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Launch Application Now ✨
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-dark border-t border-white/5 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-300 font-semibold mb-2">CollabBoard</p>
          <p className="text-slate-500 text-sm">Professional MERN Real-Time Collaboration Platform</p>
        </div>
      </footer>
    </div>
  )
}
