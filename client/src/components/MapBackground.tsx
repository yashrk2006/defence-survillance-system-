import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function MapBackground() {
    const [gridSize, setGridSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setGridSize({
            width: window.innerWidth,
            height: window.innerHeight
        });

        const handleResize = () => {
            setGridSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none select-none">
            {/* Base Grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Primary Grid Lines */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
                    backgroundSize: '200px 200px'
                }}
            />

            {/* Animated Scan Line */}
            <motion.div
                animate={{ y: ["0%", "100%"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute w-full h-[2px] bg-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.5)] z-10"
            />

            {/* Simulated Terrain/Map Shapes (SVG) */}
            <svg className="absolute inset-0 w-full h-full opacity-30 stroke-green-900/40 fill-none stroke-[0.5]">
                {/* Random "Sector" Lines */}
                <path d={`M 0 ${gridSize.height * 0.3} L ${gridSize.width * 0.2} ${gridSize.height * 0.3} L ${gridSize.width * 0.3} ${gridSize.height * 0.5}`} />
                <path d={`M ${gridSize.width} ${gridSize.height * 0.7} L ${gridSize.width * 0.8} ${gridSize.height * 0.7} L ${gridSize.width * 0.7} ${gridSize.height * 0.5}`} />

                {/* Circles indicating zones */}
                <circle cx={gridSize.width * 0.5} cy={gridSize.height * 0.5} r="200" className="stroke-green-500/10" strokeDasharray="10 10" />
                <circle cx={gridSize.width * 0.5} cy={gridSize.height * 0.5} r="350" className="stroke-green-500/5" />
            </svg>

            {/* Radial Gradient Vignette for focus */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>
    );
}
