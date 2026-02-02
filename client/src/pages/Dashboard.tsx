import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { FeedPlayer } from "@/components/FeedPlayer";
import { MapBackground } from "@/components/MapBackground";
import { TelemetryCard } from "@/components/TelemetryCard";
import { SecurityScore } from "@/components/SecurityScore";
import { NetworkTraffic } from "@/components/NetworkTraffic";
import { useAlerts } from "@/hooks/use-alerts";
import { useDevices } from "@/hooks/use-devices";
import { useIncidents } from "@/hooks/use-incidents";
import { useLogs } from "@/hooks/use-logs";
import { AlertTriangle, Wifi, Shield, Activity, Plus, Database, Battery, Navigation, Signal, Crosshair, Cpu, Lock, Terminal } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const mockChartData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  activity: Math.floor(Math.random() * 50) + 10,
  threats: Math.floor(Math.random() * 5),
}));

export default function Dashboard() {
  const { data: alerts } = useAlerts();
  const { data: devices } = useDevices();
  const { data: logs } = useLogs();

  const activeAlerts = alerts?.filter(a => a.status === 'active').length || 0;

  // Security simulation
  const securityScore = Math.max(0, 100 - (activeAlerts * 15));

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans selection:bg-green-500/30">
      <MapBackground />

      {/* Global UI Layer */}
      <div className="relative z-10 h-full flex flex-col p-4 pointer-events-none">

        {/* Top HUD Bar */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-start mb-4 pointer-events-auto"
        >
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <h1 className="text-2xl font-bold tracking-widest uppercase">SKY<span className="text-green-500">WATCH</span></h1>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono tracking-wider ml-4">CYBER-PHYSICAL SURVEILLANCE v3.0</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-black/60 backdrop-blur border border-white/10 rounded px-4 py-2 flex items-center gap-3">
              <Lock className="h-3 w-3 text-green-500" />
              <span className="text-xs font-mono text-green-500 font-bold">ENCRYPTION: AES-256</span>
            </div>
            <div className="bg-black/60 backdrop-blur border border-white/10 rounded px-4 py-2 flex items-center gap-3">
              <Terminal className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-mono text-blue-400 font-bold">ROOT_ACCESS: GRANTED</span>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">

          {/* Left Panel: Device List & Telemetry */}
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="col-span-3 flex flex-col gap-4 pointer-events-auto min-h-0"
          >
            {/* Global Security Metrics */}
            <div className="grid grid-cols-2 gap-2 h-40">
              <SecurityScore score={securityScore} className="col-span-1 h-full" />
              <div className="flex flex-col gap-2 h-full">
                <TelemetryCard label="Active Threats" value={activeAlerts.toString()} icon={AlertTriangle} status={activeAlerts > 0 ? 'critical' : 'normal'} className="flex-1" />
                <TelemetryCard label="System Uptime" value="99.9%" icon={Activity} className="flex-1" />
              </div>
            </div>

            {/* Network Traffic Widget */}
            <div className="h-48">
              <NetworkTraffic className="h-full" />
            </div>

            {/* Device Scroll Area */}
            <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden flex flex-col">
              <div className="p-3 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <Database className="h-3 w-3" /> Asset Inventory
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">{devices?.length} UNITS</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {devices?.map((device) => (
                  <div key={device.id} className="p-3 rounded bg-white/5 border border-white/5 hover:border-green-500/50 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-sm font-bold group-hover:text-green-400 transition-colors">{device.name}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${device.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`} />
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                      <span>ID: {device.id.toString().padStart(4, '0')}</span>
                      <span>{device.type.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* Center Panel: Map Area (Transparent to show background) */}
          <main className="col-span-6 relative pointer-events-none">
            {/* Center HUD Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute inset-0 flex items-center justify-center translate-y-[-10%]"
            >
              <div className="w-[600px] h-[600px] rounded-full border border-green-500/10 flex items-center justify-center relative animate-spin-slow">
                <div className="w-[500px] h-[500px] rounded-full border border-dashed border-green-500/20" />
                <Crosshair className="absolute text-green-500/20 w-32 h-32" />
                {/* Orbital dots */}
                <div className="absolute w-full h-full animate-spin-reverse-slower">
                  <div className="absolute top-0 left-1/2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />
                </div>
              </div>
            </motion.div>

            {/* Floating Live Feed (Bottom Center) */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end p-4 pointer-events-auto"
            >
              <h3 className="text-xs font-bold text-zinc-400 mb-2 pl-2 uppercase tracking-widest">Live Feeds</h3>
              <div className="flex overflow-x-auto gap-4 pb-2 snap-x">
                {devices?.filter(d => d.videoUrl).map(device => (
                  <div key={device.id} className="snap-center shrink-0 w-64 aspect-video bg-black rounded border border-white/20 relative overflow-hidden group hover:border-green-500/50 transition-colors">
                    <FeedPlayer id={device.id} videoUrl={device.videoUrl} name="" status={device.status as any} />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur text-[10px] font-mono text-white rounded border border-white/10">{device.name}</div>
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      <div className="w-1 h-3 bg-green-500" />
                      <div className="w-1 h-3 bg-green-500" />
                      <div className="w-1 h-3 bg-green-500/30" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </main>

          {/* Right Panel: Alerts & Logs */}
          <motion.aside
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="col-span-3 flex flex-col gap-4 pointer-events-auto min-h-0"
          >
            {/* Alerts Panel */}
            <div className="h-1/2 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg flex flex-col overflow-hidden">
              <div className="p-3 border-b border-white/10 bg-red-500/10 flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-3 w-3" /> Active Threats
                </h3>
                <span className="text-[10px] bg-red-500/20 text-red-500 px-1 rounded">{activeAlerts}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {alerts?.filter(a => a.status === 'active').map(alert => (
                  <div key={alert.id} className="p-2 border-l-2 border-red-500 bg-red-500/5 mt-1 hover:bg-red-500/10 transition-colors group">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-red-400 group-hover:text-red-300">{alert.title}</h4>
                      <AlertTriangle className="h-3 w-3 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[10px] text-zinc-400 line-clamp-2 mt-1">{alert.description}</p>
                    <div className="flex justify-between mt-2 text-[9px] text-zinc-500 uppercase font-mono">
                      <span>{alert.location}</span>
                      <span>{format(new Date(alert.timestamp), 'HH:mm:ss')}</span>
                    </div>
                  </div>
                ))}
                {!activeAlerts && (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                    <Shield className="h-8 w-8 mb-2 opacity-50" />
                    <span className="text-[10px]">ALL SYSTEMS SECURE</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Logs (Console style) */}
            <div className="h-1/2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg flex flex-col font-mono text-[10px]">
              <div className="p-2 border-b border-white/10 bg-white/5 text-zinc-400 uppercase font-bold text-[10px]">
                System_Log_Stream
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {logs?.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-zinc-600">[{format(new Date(log.timestamp), 'HH:mm:ss')}]</span>
                    <span className={cn(
                      "flex-1",
                      log.level === 'error' ? "text-red-500" :
                        log.level === 'warning' ? "text-yellow-500" : "text-green-500"
                    )}>
                      {log.action}: {log.details}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
