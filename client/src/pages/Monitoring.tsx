import { Layout } from "@/components/Layout";
import { useDevices } from "@/hooks/use-devices";
import { FeedPlayer } from "@/components/FeedPlayer";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Search, Filter, Radio, Activity } from "lucide-react";
import { useState } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

export default function Monitoring() {
  const { data: devices } = useDevices();
  const { activeFeedId, setActiveFeed } = useStore();
  const [search, setSearch] = useState("");

  const activeDevice = devices?.find(d => d.id === activeFeedId) || devices?.[0];
  const filteredDevices = devices?.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout className="p-0 flex h-full overflow-hidden">
      {/* Sidebar List */}
      <div className="w-80 border-r border-white/5 bg-card flex flex-col h-full z-20">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white mb-4">Feed Selection</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search cameras..."
              className="w-full bg-background border border-white/10 rounded px-9 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <AnimatePresence>
            {filteredDevices?.map((device, i) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveFeed(device.id)}
                className={cn(
                  "p-3 rounded cursor-pointer transition-all border border-transparent group relative overflow-hidden",
                  activeFeedId === device.id
                    ? "bg-white/10 border-white/10"
                    : "hover:bg-white/5"
                )}
              >
                {activeFeedId === device.id && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-primary/10 -z-10"
                    transition={{ duration: 0.2 }}
                  />
                )}

                <div className="flex justify-between items-center mb-1">
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    activeFeedId === device.id ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                  )}>
                    {device.name}
                  </span>
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]",
                    device.status === 'online' ? "bg-green-500 text-green-500" : "bg-red-500 text-red-500"
                  )} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{device.location}</span>
                  <span className="font-mono">{device.type}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Main View */}
      <PageTransition className="flex-1 bg-black p-4 flex flex-col relative overflow-hidden">
        {activeDevice ? (
          <>
            <motion.div
              layout
              className="flex-1 relative rounded-lg overflow-hidden border border-white/10 bg-zinc-900 group"
            >
              {/* Just reusing the component but made full size */}
              <FeedPlayer
                id={activeDevice.id}
                name={activeDevice.name}
                status={activeDevice.status as any}
                active={true}
                videoUrl={activeDevice.videoUrl}
              />

              {/* Overlay Status */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10 pointer-events-none">
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
                  <span className="text-[10px] font-bold text-red-500 tracking-wider">REC</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-white/10">
                  <Radio className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-bold text-white tracking-wider">LIVE</span>
                </div>
              </div>
            </motion.div>

            {/* Metadata Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="h-48 mt-4 grid grid-cols-3 gap-4"
            >
              <div className="col-span-2 bg-card border border-white/10 rounded p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-[1px] bg-gradient-to-l from-primary/50 to-transparent w-full h-[1px]" />
                <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" /> Live Telemetry
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-white/5 pb-1 group">
                      <span className="text-muted-foreground group-hover:text-zinc-300 transition-colors">LATENCY</span>
                      <span className="text-green-500">24ms</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1 group">
                      <span className="text-muted-foreground group-hover:text-zinc-300 transition-colors">RESOLUTION</span>
                      <span className="text-white">4K / 60FPS</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1 group">
                      <span className="text-muted-foreground group-hover:text-zinc-300 transition-colors">AI MODEL</span>
                      <span className="text-white">YOLOv8-L</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-white/5 pb-1 group">
                      <span className="text-muted-foreground group-hover:text-zinc-300 transition-colors">OBJECTS</span>
                      <span className="text-white">3 DETECTED</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1 group">
                      <span className="text-muted-foreground group-hover:text-zinc-300 transition-colors">IP ADDR</span>
                      <span className="text-white">{activeDevice.ipAddress || "192.168.1.104"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-white/10 rounded p-4 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="text-4xl font-bold text-white font-mono mb-1 relative z-10">98%</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest relative z-10">Confidence Score</div>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a feed to begin monitoring
          </div>
        )}
      </PageTransition>
    </Layout>
  );
}
