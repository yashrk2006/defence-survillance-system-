import { Layout } from "@/components/Layout";
import { PageTransition } from "@/components/ui/PageTransition";
import { MapBackground } from "@/components/MapBackground";
import { WeatherLayer, HeatmapLayer, ZoneLayer, IndianBorderLayer } from "@/components/MapLayers";
import { RealTacticalMap } from "@/components/RealTacticalMap";
import { useDevices } from "@/hooks/use-devices";
import { MapPin, Navigation, Scan, Locate, Layers, Crosshair, ZoomIn, ZoomOut, CloudRain, Flame, ShieldAlert, Ruler, MousePointer2, Map as MapIcon, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function MapView() {
    const { data: devices } = useDevices();
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

    // Map Viewport State
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Layers State
    const [layers, setLayers] = useState({
        weather: false,
        heatmap: false,
        zones: true,
        borders: true,
        satellite: false
    });

    // Measurement Tool State
    const [measureMode, setMeasureMode] = useState(false);
    const [measurePoints, setMeasurePoints] = useState<{ x: number, y: number }[]>([]);

    // Handle Zoom
    const handleWheel = (e: React.WheelEvent) => {
        const newScale = Math.min(Math.max(scale - e.deltaY * 0.001, 0.5), 3);
        setScale(newScale);
    };

    // Handle Pan
    const handleMouseDown = (e: React.MouseEvent) => {
        if (measureMode) return;
        setIsDragging(true);
        dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.current.x,
                y: e.clientY - dragStart.current.y
            });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    // Handle Measurement Click
    const handleMapClick = (e: React.MouseEvent) => {
        if (!measureMode || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        // Calculate relative coordinates accounting for scale and position
        const x = (e.clientX - rect.left - position.x) / scale;
        const y = (e.clientY - rect.top - position.y) / scale;

        setMeasurePoints(prev => {
            if (prev.length >= 2) return [{ x, y }];
            return [...prev, { x, y }];
        });
    };

    // Calculate distance (simulated units)
    const distance = measurePoints.length === 2
        ? Math.round(Math.sqrt(Math.pow(measurePoints[1].x - measurePoints[0].x, 2) + Math.pow(measurePoints[1].y - measurePoints[0].y, 2)))
        : 0;

    // Simulated markers relative to center
    // Real markers from Backend Data
    const markers = devices?.map((d) => ({
        ...d,
        x: d.x ?? 2500, // Default to center if null
        y: d.y ?? 2500,
    })) || [];

    return (
        <Layout className="h-full relative overflow-hidden p-0 select-none">
            {/* Main Map Container */}
            <div
                ref={containerRef}
                className={cn("absolute inset-0 cursor-crosshair active:cursor-grabbing", isDragging ? "cursor-grabbing" : "")}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleMapClick}
            >
                {/* Transform Layer */}
                <div
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: '0 0',
                        width: '100%', height: '100%'
                    }}
                    className="relative transition-transform duration-75 ease-out will-change-transform"
                >
                    {/* Infinite Grid Background for Context */}
                    <div className="absolute -top-[2000px] -left-[2000px] w-[5000px] h-[5000px]">
                        <MapBackground />

                        {/* Map Layers */}
                        <RealTacticalMap active={layers.satellite} />
                        {!layers.satellite && <IndianBorderLayer active={layers.borders} />}
                        <WeatherLayer active={layers.weather} />
                        <HeatmapLayer active={layers.heatmap} />
                        <ZoneLayer active={layers.zones} />

                        {/* Measurements Line */}
                        {measurePoints.length > 0 && (
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                                {measurePoints.map((p, i) => (
                                    <circle key={i} cx={p.x} cy={p.y} r={4 / scale} fill="#22c55e" />
                                ))}
                                {measurePoints.length === 2 && (
                                    <>
                                        <line x1={measurePoints[0].x} y1={measurePoints[0].y} x2={measurePoints[1].x} y2={measurePoints[1].y} stroke="#22c55e" strokeWidth={2 / scale} strokeDasharray="5 5" />
                                        <text x={(measurePoints[0].x + measurePoints[1].x) / 2} y={(measurePoints[0].y + measurePoints[1].y) / 2 - 10} fill="#22c55e" fontSize={14 / scale} fontWeight="bold">
                                            {distance}m
                                        </text>
                                    </>
                                )}
                            </svg>
                        )}

                        {/* Interactive Markers */}
                        {markers.map((marker) => (
                            <motion.div
                                key={marker.id}
                                className="absolute -translate-x-1/2 -translate-y-1/2 group z-40"
                                style={{ left: marker.x, top: marker.y }}
                                onClick={(e) => { e.stopPropagation(); setSelectedDevice(marker.id.toString()); }}
                            >
                                <div className={cn(
                                    "relative flex items-center justify-center transition-all duration-300",
                                    scale < 0.8 ? "w-4 h-4" : "w-10 h-10"
                                )}>
                                    {/* Pulse Ring */}
                                    <div className="absolute inset-[-50%] border border-green-500/30 rounded-full animate-ping" />

                                    {/* Icon Box */}
                                    <div className={cn(
                                        "w-full h-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center rounded-lg hover:border-green-500 hover:bg-green-500/20 transition-all",
                                        selectedDevice === marker.id.toString() ? "border-green-500 bg-green-500/20 shadow-[0_0_20px_#22c55e]" : ""
                                    )}>
                                        <div className={cn("rounded-full bg-current", scale < 0.8 ? "w-2 h-2" : "w-3 h-3", marker.status === 'online' ? "text-green-500" : "text-red-500")} />
                                    </div>

                                    {/* Label (Only visible when zoomed in) */}
                                    {scale > 0.8 && (
                                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <span className="text-[10px] text-white font-mono">{marker.name}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* UI Overlay (Fixed) */}
            <PageTransition className="relative z-50 w-full h-full pointer-events-none p-6 flex flex-col justify-between">

                {/* Top Bar */}
                <div className="flex justify-between items-start pointer-events-auto">
                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex flex-col gap-1">
                        <h1 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                            <Scan className="w-5 h-5 text-green-500 animate-pulse" />
                            TACTICAL_MAP_V2
                        </h1>
                        <div className="flex gap-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                            <span>ZM: {(scale * 100).toFixed(0)}%</span>
                            <span>POS: {position.x.toFixed(0)}, {position.y.toFixed(0)}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-xl">
                        {[
                            { id: 'satellite', icon: Globe, label: 'SAT_UPLINK' },
                            { id: 'borders', icon: MapIcon, label: 'GEO_BORDER' },
                            { id: 'weather', icon: CloudRain, label: 'WX_RADAR' },
                            { id: 'heatmap', icon: Flame, label: 'TH_RML' },
                            { id: 'zones', icon: ShieldAlert, label: 'RES_ZONE' }
                        ].map(layer => (
                            <button
                                key={layer.id}
                                onClick={() => setLayers(p => ({ ...p, [layer.id]: !p[layer.id as keyof typeof layers] }))}
                                className={cn(
                                    "p-3 rounded-lg transition-all border",
                                    layers[layer.id as keyof typeof layers]
                                        ? "bg-green-500/20 border-green-500/50 text-green-500"
                                        : "bg-transparent border-transparent text-zinc-500 hover:text-white"
                                )}
                                title={layer.label}
                            >
                                <layer.icon className="h-5 w-5" />
                            </button>
                        ))}
                        <div className="w-[1px] bg-white/10 mx-1" />
                        <button
                            onClick={() => {
                                setMeasureMode(!measureMode);
                                setMeasurePoints([]);
                            }}
                            className={cn(
                                "p-3 rounded-lg transition-all border",
                                measureMode
                                    ? "bg-blue-500/20 border-blue-500/50 text-blue-500"
                                    : "bg-transparent border-transparent text-zinc-500 hover:text-white"
                            )}
                        >
                            <Ruler className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Bottom Tools & Minimap */}
                <div className="flex items-end justify-between pointer-events-auto">
                    {/* Device Detail Card */}
                    <AnimatePresence mode="wait">
                        {selectedDevice ? (
                            <motion.div
                                key="detail"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                className="bg-black/90 backdrop-blur-2xl border border-white/10 p-6 rounded-2xl w-80 shadow-2xl"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-black text-white uppercase">{devices?.find(d => d.id.toString() === selectedDevice)?.name}</h3>
                                    <button onClick={() => setSelectedDevice(null)} className="text-zinc-500 hover:text-white">✕</button>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4">
                                    <div className="bg-white/5 p-2 rounded">
                                        <span className="text-zinc-500 block text-[8px] uppercase">Status</span>
                                        <span className="text-green-500">ONLINE</span>
                                    </div>
                                    <div className="bg-white/5 p-2 rounded">
                                        <span className="text-zinc-500 block text-[8px] uppercase">Battery</span>
                                        <span className="text-white">98%</span>
                                    </div>
                                </div>
                                <button className="w-full py-2 bg-green-500 text-black font-bold text-xs uppercase rounded hover:bg-green-400 font-mono">
                                    ESTABLISH_LINK
                                </button>
                            </motion.div>
                        ) : (
                            <div />
                        )}
                    </AnimatePresence>

                    {/* Minimap & HUD Controls */}
                    <div className="flex gap-4 items-end">
                        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-2 flex flex-col gap-2">
                            <button onClick={() => setScale(s => Math.min(s + 0.5, 3))} className="p-2 hover:bg-white/10 rounded text-zinc-400 hover:text-white"><ZoomIn className="h-5 w-5" /></button>
                            <button onClick={() => setScale(s => Math.max(s - 0.5, 0.5))} className="p-2 hover:bg-white/10 rounded text-zinc-400 hover:text-white"><ZoomOut className="h-5 w-5" /></button>
                            <button onClick={() => { setPosition({ x: 0, y: 0 }); setScale(1); }} className="p-2 hover:bg-white/10 rounded text-zinc-400 hover:text-white"><Locate className="h-5 w-5" /></button>
                        </div>

                        {/* Minimap Simulation */}
                        <div className="w-48 h-48 bg-black/90 border border-white/20 rounded-2xl relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 opacity-30">
                                <MapBackground />
                            </div>
                            {/* Viewport Indicator */}
                            <div
                                className="absolute border-2 border-green-500/50 bg-green-500/10"
                                style={{
                                    width: `${Math.min(100 / scale, 100)}%`,
                                    height: `${Math.min(100 / scale, 100)}%`,
                                    top: '50%', left: '50%',
                                    transform: `translate(-50%, -50%) translate(${-position.x / 10}px, ${-position.y / 10}px)`
                                }}
                            />
                        </div>
                    </div>
                </div>

            </PageTransition>
        </Layout>
    );
}
