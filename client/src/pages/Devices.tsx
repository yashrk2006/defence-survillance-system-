import { Layout } from "@/components/Layout";
import { useDevices } from "@/hooks/use-devices";
import { HardDrive, Battery, Signal, WifiOff, Filter, Search, Camera, Plane, Activity, Server, Database, Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/ui/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'camera': return Camera;
    case 'drone': return Plane;
    case 'sensor': return Activity;
    case 'server': return Server;
    default: return HardDrive;
  }
};

export default function Devices() {
  const { data: devices } = useDevices();
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [search, setSearch] = useState("");

  const filteredDevices = devices?.filter(d => {
    const matchesFilter = filter === 'all' || d.status === filter;
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const onlineCount = devices?.filter(d => d.status === 'online').length || 0;
  const offlineCount = devices?.filter(d => d.status === 'offline').length || 0;

  return (
    <Layout>
      <PageTransition className="space-y-6">
        {/* HUD Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="h-5 w-5 text-green-500" />
              <h1 className="text-2xl font-bold text-white tracking-tight uppercase">Asset Inventory</h1>
            </div>
            <p className="text-muted-foreground text-xs font-mono tracking-wider">HARDWARE STATUS MONITORING</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-black/40 backdrop-blur border border-white/10 rounded px-4 py-2 flex gap-8 text-xs font-mono">
              <div className="flex flex-col items-center">
                <span className="text-zinc-500 text-[10px] uppercase">Online</span>
                <span className="text-xl font-bold text-green-500">{onlineCount}</span>
              </div>
              <div className="w-px bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-zinc-500 text-[10px] uppercase">Offline</span>
                <span className="text-xl font-bold text-red-500">{offlineCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-between items-center">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 group-focus-within:text-green-500 transition-colors" />
            <input
              type="text"
              placeholder="SEARCH_ASSETS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black/40 border border-white/10 rounded px-9 py-2 text-sm text-white focus:outline-none focus:border-green-500/50 transition-colors w-full sm:w-64 font-mono uppercase placeholder:text-zinc-600"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="bg-black/40 border border-white/10 rounded p-1 flex">
              {['all', 'online', 'offline'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={cn(
                    "px-3 py-1 text-[10px] font-bold uppercase rounded transition-all font-mono",
                    filter === f ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-zinc-500 hover:text-white"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <button className="p-2 border border-white/10 rounded hover:bg-white/5 bg-black/40 text-green-500 transition-colors">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Device Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {filteredDevices?.map((device) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={device.id}
                className="bg-black/40 backdrop-blur-md border border-white/10 rounded-sm p-0 group hover:border-green-500/30 transition-all relative overflow-hidden"
              >
                {/* Top Status Bar */}
                <div className={cn("h-1 w-full",
                  device.status === 'online' ? "bg-green-500" :
                    device.status === 'offline' ? "bg-red-500" : "bg-orange-500"
                )} />

                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded bg-white/5 border border-white/5",
                        device.status === 'online' ? "text-green-500" : "text-zinc-500"
                      )}>
                        {(() => {
                          const Icon = getDeviceIcon(device.type);
                          return <Icon className="h-5 w-5" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-wide uppercase group-hover:text-green-400 transition-colors">{device.name}</h3>
                        <p className="text-[10px] text-zinc-500 font-mono">ID: {device.id.toString().padStart(4, '0')}</p>
                      </div>
                    </div>
                    <div className={cn("w-2 h-2 rounded-full", device.status === 'online' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" : "bg-red-500")} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400 mb-4">
                    <div className="bg-white/5 p-1.5 rounded flex items-center justify-between">
                      <span>TYPE</span>
                      <span className="text-white uppercase">{device.type}</span>
                    </div>
                    <div className="bg-white/5 p-1.5 rounded flex items-center justify-between">
                      <span>LOC</span>
                      <span className="text-white uppercase">{device.location}</span>
                    </div>
                    <div className="bg-white/5 p-1.5 rounded flex items-center justify-between col-span-2">
                      <span>IP ADDR</span>
                      <span className="text-white">{device.ipAddress || 'UNKNOWN'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Battery className={cn("h-3 w-3", device.battery && device.battery < 20 ? "text-red-500" : "text-zinc-500")} />
                      <span className={cn("text-xs font-mono font-bold", device.battery && device.battery < 20 ? "text-red-500" : "text-white")}>
                        {device.battery ? `${device.battery}%` : 'EXT'}
                      </span>
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <div className="flex items-center gap-2">
                      <Signal className={cn("h-3 w-3", device.status === 'online' ? "text-green-500" : "text-zinc-600")} />
                      <span className="text-xs font-mono text-zinc-500 uppercase">
                        {device.status === 'online' ? 'LINK_OK' : 'NO_LINK'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </PageTransition>
    </Layout>
  );
}
