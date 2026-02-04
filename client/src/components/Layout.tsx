import { Sidebar } from "./Sidebar";
import { MapBackground } from "@/components/MapBackground";
import { cn } from "@/lib/utils";

export function Layout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-sans selection:bg-green-500/30">
      <MapBackground />

      {/* Sidebar relative to sit on top of map */}
      <div className="relative z-20 h-full">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Global HUD Overlay Effects */}
        <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] pointer-events-none bg-[length:100%_4px,3px_100%]" />
        </div>

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

        {/* Top HUD Line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-green-500/20 to-transparent w-full" />

        <div className={cn("flex-1 overflow-auto p-4 md:p-8 custom-scrollbar", className)}>
          {children}
        </div>
      </main>
    </div>
  );
}
