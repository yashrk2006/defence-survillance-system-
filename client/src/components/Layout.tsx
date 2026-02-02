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
        {/* Top HUD Line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-green-500/20 to-transparent w-full" />

        <div className={cn("flex-1 overflow-auto p-4 md:p-8 custom-scrollbar", className)}>
          {children}
        </div>
      </main>
    </div>
  );
}
