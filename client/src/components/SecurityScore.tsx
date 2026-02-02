import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecurityScoreProps {
    score: number;
    className?: string;
}

export function SecurityScore({ score, className }: SecurityScoreProps) {
    // Calculate circle properties
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className={cn("relative flex items-center justify-center p-4 bg-black/40 backdrop-blur border border-white/10 rounded-sm", className)}>
            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-white/5"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        className={cn(
                            "drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                            score >= 90 ? "text-green-500" :
                                score >= 70 ? "text-yellow-500" : "text-red-500"
                        )}
                    />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn("text-3xl font-bold font-mono tracking-tighter",
                        score >= 90 ? "text-green-500" :
                            score >= 70 ? "text-yellow-500" : "text-red-500"
                    )}>
                        {score}%
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Secure</span>
                </div>
            </div>

            <div className="absolute bottom-2 right-2">
                {score >= 90 ? (
                    <ShieldCheck className="h-5 w-5 text-green-500 opacity-50" />
                ) : (
                    <ShieldAlert className="h-5 w-5 text-red-500 opacity-50" />
                )}
            </div>
        </div>
    );
}
