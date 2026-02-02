import { Layout } from "@/components/Layout";
import { PageTransition } from "@/components/ui/PageTransition";
import { MapBackground } from "@/components/MapBackground";
import { useDevices } from "@/hooks/use-devices";
import { MapPin, Navigation, Scan, Locate, Layers, Crosshair, ZoomIn, ZoomOut } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function MapView() {
    const { data: devices } = useDevices();
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

    // Simulated map markers - normally would use a map library like Leaflet/Mapbox
    // Here we place them relatively on the "MapBackground" simulation
    const markers = devices?.map((d, i) => ({
        ...d,
        x: 30 + (i * 15) + (Math.random() * 10 - 5),
        y: 30 + (i * 10) + (Math.random() * 10 - 5),
    })) || [];

    return (
        <Layout className="h-full relative overflow-hidden p-0">

            {/* Map Layer */}
            <div className="absolute inset-0 z-0">
                <MapBackground />
                <div className="absolute inset-0 bg-green-500/5 mix-blend-overlay pointer-events-none" />
            </div>

            {/* Map UI Grid */}
            <PageTransition className="relative z-10 w-full h-full pointer-events-none p-6 flex flex-col justify-between">

                {/* Top HUD */}
                <div className="flex justify-between items-start pointer-events-auto">
                    <div className="bg-black/80 backdrop-blur border border-white/10 p-4 rounded-lg">
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            <Scan className="h-5 w-5 text-green-500" /> GEO-SPATIAL OVERVIEW
                        </h1>
                        <p className="text-xs text-zinc-400 font-mono mt-1">SECTOR 7 - URBAN SURVEILLANCE GRID</p>
                    </div>

                    <div className="flex gap-2">
                        <button className="p-3 bg-black/80 hover:bg-white/10 border border-white/10 rounded text-white transition-colors">
                            <Layers className="h-5 w-5" />
                        </button>
                        <button className="p-3 bg-black/80 hover:bg-white/10 border border-white/10 rounded text-white transition-colors">
                            <Locate className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Interactive Markers Layer (Simulated) */}
                <div className="absolute inset-0 z-0 pointer-events-auto">
                    {markers.map((marker, i) => (
                        <motion.div
                            key={marker.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="absolute cursor-pointer group"
                            style={{ top: `${marker.y}%`, left: `${marker.x}%` }}
                            onClick={() => setSelectedDevice(marker.id.toString())}
                        >
                            {/* Marker Body */}
                            <div className={cn("relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                                selectedDevice === marker.id.toString() ? "bg-green-500 border-white scale-125" : "bg-black/60 border-green-500 hover:scale-110"
                            )}>
                                <div className={cn("w-2 h-2 rounded-full",
                                    marker.status === 'online' ? "bg-green-400" : "bg-red-500"
                                )} />

                                {/* Ripple Effect */}
                                <div className="absolute inset-0 rounded-full border border-green-500 animate-[ping_3s_ease-out_infinite] opacity-50" />
                            </div>

                            {/* Label */}
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[10px] font-bold text-white uppercase">{marker.name}</p>
                                <p className="text-[8px] font-mono text-zinc-400">ID: {marker.id}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Right Side Tools */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-auto">
                    <button className="p-2 bg-black/80 border border-white/10 rounded text-zinc-400 hover:text-white"><ZoomIn className="h-5 w-5" /></button>
                    <div className="w-8 h-px bg-white/10 mx-auto" />
                    <button className="p-2 bg-black/80 border border-white/10 rounded text-zinc-400 hover:text-white"><ZoomOut className="h-5 w-5" /></button>
                </div>

                {/* Bottom Detail Panel */}
                <div className="bg-black/80 backdrop-blur border border-white/10 rounded-lg p-4 w-full max-w-md pointer-events-auto">
                    {selectedDevice ? (
                        <div className="flex items-start gap-4">
                            <div className="w-24 h-16 bg-zinc-900 rounded border border-white/10 flex items-center justify-center">
                                <Crosshair className="h-6 w-6 text-zinc-700" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{devices?.find(d => d.id.toString() === selectedDevice)?.name}</h3>
                                <div className="flex gap-4 mt-2 text-xs font-mono text-zinc-400">
                                    <span>STATUS: <span className="text-green-500">ONLINE</span></span>
                                    <span>BATTERY: 64%</span>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button className="px-3 py-1 bg-green-500 text-black text-[10px] font-bold rounded hover:bg-green-400">CONNECT</button>
                                    <button className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded hover:bg-white/20">DETAILS</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-zinc-500 text-xs font-mono flex items-center gap-2">
                            <Navigation className="h-4 w-4" />
                            SELECT A UNIT ON THE GRID FOR DETAILS
                        </div>
                    )}
                </div>

            </PageTransition>
        </Layout>
    );
}
