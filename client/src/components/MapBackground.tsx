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
            {/* Base Hex Grid */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0' stroke='%23333' stroke-width='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
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

            {/* Rotating Radar Sweep */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-[200vmax] h-[200vmax] origin-top-left bg-gradient-to-r from-green-500/10 to-transparent"
                style={{ top: '50%', left: '50%' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Animated Horizontal Scan Line */}
            <motion.div
                animate={{ y: ["0%", "100%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute w-full h-[1px] bg-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.4)] z-10"
            />

            {/* Animated Vertical Scan Line (Delayed) */}
            <motion.div
                animate={{ x: ["0%", "100%"] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 4 }}
                className="absolute h-full w-[1px] bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)] z-10"
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
