import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TelemetryCardProps {
    label: string;
    value: string | number;
    unit?: string;
    icon?: LucideIcon;
    trend?: "up" | "down" | "stable";
    status?: "normal" | "warning" | "critical";
    className?: string;
}

export function TelemetryCard({
    label,
    value,
    unit,
    icon: Icon,
    trend,
    status = "normal",
    className
}: TelemetryCardProps) {
    return (
        <div className={cn(
            "relative overflow-hidden bg-black/40 backdrop-blur-md border rounded p-3 flex flex-col gap-1 group transition-all duration-300",
            status === "normal" && "border-white/10 hover:border-white/30",
            status === "warning" && "border-orange-500/30 bg-orange-500/5",
            status === "critical" && "border-red-500/30 bg-red-500/5",
            className
        )}>
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 rounded-tr-sm" />

            <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[10px] uppercase tracking-wider font-semibold">{label}</span>
                {Icon && <Icon className={cn("h-3 w-3",
                    status === "critical" ? "text-red-400" : "text-primary/70"
                )} />}
            </div>

            <div className="flex items-baseline gap-1">
                <span className={cn(
                    "text-2xl font-mono font-bold leading-none tracking-tighter",
                    status === "normal" && "text-white",
                    status === "warning" && "text-orange-400",
                    status === "critical" && "text-red-500",
                )}>
                    {value}
                </span>
                {unit && <span className="text-xs text-zinc-500 font-mono">{unit}</span>}
            </div>

            {trend && (
                <div className="absolute bottom-2 right-2 flex gap-0.5">
                    <div className={cn("w-1 h-3 rounded-sm bg-white/10", trend === "up" && "bg-green-500")} />
                    <div className={cn("w-1 h-2 rounded-sm bg-white/10", trend === "stable" && "bg-blue-500")} />
                    <div className={cn("w-1 h-3 rounded-sm bg-white/10", trend === "down" && "bg-red-500")} />
                </div>
            )}
        </div>
    );
}
