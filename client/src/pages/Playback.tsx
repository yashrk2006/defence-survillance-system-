import { Layout } from "@/components/Layout";
import { PageTransition } from "@/components/ui/PageTransition";
import { useState } from "react";
import { Calendar, Play, Pause, SkipBack, SkipForward, Clock, Download, Share2, ZoomIn, ZoomOut, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Playback() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(50); // percentage

    // Mock timeline events
    const events = [
        { time: 15, type: 'motion', label: 'Motion Detected' },
        { time: 45, type: 'alert', label: 'Person Identified' },
        { time: 80, type: 'motion', label: 'Vehicle Entry' },
    ];

    return (
        <Layout className="h-full flex flex-col p-4 bg-black overflow-hidden relative">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <PageTransition className="flex-1 flex flex-col gap-4 relative z-10 h-full">
                {/* Header */}
                <div className="flex justify-between items-center rounded-lg bg-black/40 backdrop-blur border border-white/10 p-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-500/10 rounded-md border border-purple-500/20">
                            <Film className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">Footage Archives</h1>
                            <p className="text-xs text-muted-foreground font-mono">CAM_04 - MAIN_GATE // {format(new Date(), 'yyyy-MM-dd')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-mono text-white transition-colors">
                            <Calendar className="h-3.5 w-3.5" />
                            Select Date
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-mono text-white transition-colors">
                            <Download className="h-3.5 w-3.5" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Main Player Area */}
                <div className="flex-1 bg-black border border-white/10 rounded-lg relative overflow-hidden group">
                    {/* Placeholder Video Content */}
                    <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                        <div className="text-zinc-700 font-mono text-sm tracking-widest flex flex-col items-center gap-4">
                            <Film className="h-16 w-16 opacity-20" />
                            <span>NO SIGNAL / END OF STREAM</span>
                            <span className="text-xs opacity-50">00:00:00:00</span>
                        </div>
                    </div>

                    {/* Overlay UI */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        <div className="px-2 py-1 bg-black/60 rounded text-[10px] font-mono text-white border border-white/10">1080p HEVC</div>
                        <div className="px-2 py-1 bg-black/60 rounded text-[10px] font-mono text-white border border-white/10">30 FPS</div>
                    </div>
                </div>

                {/* Timeline Controls */}
                <div className="h-32 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg flex flex-col p-4 shadow-2xl">

                    {/* Slider Area */}
                    <div className="flex-1 relative mb-4 flex items-center">
                        <div className="absolute inset-x-0 h-16 bg-white/5 border-y border-white/5 flex items-end">
                            {/* Time Ticks */}
                            {Array.from({ length: 24 }).map((_, i) => (
                                <div key={i} className="flex-1 h-3 border-r border-white/10 relative group cursor-pointer hover:bg-white/5 transition-colors">
                                    <span className="absolute -top-5 left-0 text-[9px] text-zinc-600 font-mono group-hover:text-white">{i}:00</span>
                                </div>
                            ))}
                        </div>

                        {/* Events */}
                        {events.map((ev, i) => (
                            <div key={i}
                                className={cn("absolute w-1 h-8 rounded-full z-10 cursor-pointer hover:scale-125 transition-transform",
                                    ev.type === 'alert' ? "bg-red-500 top-4" : "bg-blue-500 top-6"
                                )}
                                style={{ left: `${ev.time}%` }}
                                title={ev.label}
                            />
                        ))}

                        {/* Scrubber */}
                        <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 cursor-grab active:cursor-grabbing" style={{ left: `${currentTime}%` }}>
                            <div className="absolute -top-2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500" />
                            <div className="absolute -bottom-1 -translate-x-1/2 px-1.5 py-0.5 bg-red-500 text-[9px] font-bold text-white rounded-sm">12:30:45</div>
                        </div>
                    </div>

                    {/* Control Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-4">
                            <button className="text-zinc-400 hover:text-white transition-colors" onClick={() => setCurrentTime(t => Math.max(0, t - 5))}><SkipBack className="h-4 w-4" /></button>
                            <button
                                className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:bg-zinc-200 transition-colors"
                                onClick={() => setIsPlaying(!isPlaying)}
                            >
                                {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
                            </button>
                            <button className="text-zinc-400 hover:text-white transition-colors" onClick={() => setCurrentTime(t => Math.min(100, t + 5))}><SkipForward className="h-4 w-4" /></button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                <Clock className="h-3 w-3 text-zinc-500" />
                                <span className="text-xs font-mono text-zinc-300">1x Speed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="text-zinc-500 hover:text-white"><ZoomOut className="h-4 w-4" /></button>
                                <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-1/2 h-full bg-zinc-500" />
                                </div>
                                <button className="text-zinc-500 hover:text-white"><ZoomIn className="h-4 w-4" /></button>
                            </div>
                        </div>
                    </div>

                </div>
            </PageTransition>
        </Layout>
    );
}
