import { Link } from "wouter";
import { Shield, ArrowRight, Activity, Lock, Cpu, Scan } from "lucide-react";
import { motion } from "framer-motion";

// Landing Page
export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden font-sans selection:bg-green-500/30">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Radar Sweep Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none z-0">
        <div className="absolute inset-0 rounded-full border border-green-500/20" />
        <div className="absolute inset-[20%] rounded-full border border-green-500/20" />
        <div className="absolute inset-[40%] rounded-full border border-green-500/20" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-green-500/20"
        />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-6 md:px-12 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold tracking-[0.2em] uppercase text-sm">Autonomous Shield</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-green-500 bg-green-500/5 px-3 py-1.5 rounded-full border border-green-500/10">
          <div className="relative">
            <span className="w-2 h-2 rounded-full bg-green-500 block" />
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping absolute inset-0" />
          </div>
          SYSTEM OPERATIONAL
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute -top-12 left-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent"
          />

          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 uppercase tracking-widest backdrop-blur-sm">
            <Scan className="h-3 w-3 animate-pulse" />
            <span>Surveillance // Class 4</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-none">
            COMMAND <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">CENTER</span>
          </h1>

          <p className="max-w-xl mx-auto text-zinc-400 mb-12 text-lg font-light leading-relaxed">
            Advanced threat detection and autonomous response systems active.
            <span className="block mt-2 text-zinc-500 text-sm font-mono">SECURE CONNECTION ESTABLISHED v2.4.0</span>
          </p>

          <Link href="/dashboard">
            <button className="group relative px-10 py-5 bg-white text-black font-bold text-sm tracking-[0.1em] uppercase rounded-sm hover:bg-zinc-200 transition-all active:scale-[0.98] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <div className="flex items-center gap-3">
                Enter System
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full text-left px-6">
          {[
            { icon: Activity, title: "Real-time Telemetry", desc: "Live data processing with sub-millisecond latency." },
            { icon: Lock, title: "Military Grade", desc: "AES-256 end-to-end encryption for all streams." },
            { icon: Cpu, title: "Neural Analysis", desc: "Edge-computed AI models for behavioral prediction." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="group p-8 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <feature.icon className="h-24 w-24 -rotate-12" />
              </div>

              <feature.icon className="h-8 w-8 text-white mb-6 relative z-10" />
              <h3 className="text-lg font-bold text-white mb-2 relative z-10">{feature.title}</h3>
              <p className="text-sm text-zinc-500 relative z-10 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-mono border-t border-white/5 bg-black">
        <div className="flex justify-center items-center gap-4 mb-2">
          <span>STAT: ONLINE</span>
          <span>PING: 12ms</span>
          <span>ENC: ACTIVE</span>
        </div>
        Restricted Area // Class 4 Clearance Required // ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
      </footer>
    </div>
  );
}
