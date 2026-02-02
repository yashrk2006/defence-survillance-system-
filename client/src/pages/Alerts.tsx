import { Layout } from "@/components/Layout";
import { useAlerts } from "@/hooks/use-alerts";
import { AlertTriangle, Filter, Download, Shield, Clock, MapPin, Search, AlertOctagon, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { PageTransition } from "@/components/ui/PageTransition";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Alerts() {
  const { data: alerts } = useAlerts();
  const [filter, setFilter] = useState<string>('all');

  const filteredAlerts = alerts?.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'critical') return alert.severity === 'critical';
    if (filter === 'active') return alert.status === 'active';
    return alert.severity === filter;
  });

  return (
    <Layout>
      <PageTransition className="space-y-6">
        {/* Header HUD */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertOctagon className="h-5 w-5 text-red-500" />
              <h1 className="text-2xl font-bold text-white tracking-tight uppercase">Threat Logs</h1>
            </div>
            <p className="text-muted-foreground text-xs font-mono tracking-wider">REAL-TIME SECURITY NOTIFICATIONS</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-black/40 hover:bg-white/10 text-[10px] font-mono font-bold uppercase text-white rounded border border-white/10 transition-colors flex items-center gap-2">
              <Download className="h-3 w-3" /> Export_Log
            </button>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-sm overflow-hidden flex flex-col min-h-[600px]">
          {/* Tactical Filters */}
          <div className="p-3 border-b border-white/10 flex gap-2 overflow-x-auto bg-white/5">
            {['all', 'critical', 'high', 'active'].map((status) => (
              <button
                key={status}
                className={cn(
                  "px-4 py-1.5 rounded-sm text-[10px] font-bold font-mono uppercase tracking-wider transition-all border",
                  filter === status
                    ? "bg-red-500/20 text-red-400 border-red-500/50"
                    : "bg-transparent text-zinc-500 border-transparent hover:text-white hover:bg-white/5"
                )}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredAlerts?.map((alert) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  key={alert.id}
                  className={cn(
                    "p-3 border-l-2 bg-gradient-to-r transition-all group hover:pl-4",
                    alert.severity === 'critical' ? "border-red-500 from-red-500/10 to-transparent" :
                      alert.severity === 'high' ? "border-orange-500 from-orange-500/10 to-transparent" :
                        "border-blue-500 from-blue-500/10 to-transparent"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {alert.severity === 'critical' && <AlertTriangle className="h-3 w-3 text-red-500 animate-pulse" />}
                        <h3 className={cn("text-sm font-bold uppercase tracking-wide",
                          alert.severity === 'critical' ? "text-red-400" : "text-white"
                        )}>{alert.title}</h3>
                        <span className="text-[10px] bg-white/5 px-1.5 rounded text-zinc-500 font-mono">{alert.id.toString().padStart(4, '0')}</span>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono mb-2 pl-5 line-clamp-1">{alert.description}</p>

                      <div className="flex items-center gap-4 pl-5 text-[10px] font-mono text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(alert.timestamp), 'HH:mm:ss')}
                        </span>
                        <span className="flex items-center gap-1 uppercase">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </span>
                        {alert.status === 'resolved' && (
                          <span className="flex items-center gap-1 text-green-500">
                            <CheckCircle2 className="h-3 w-3" /> RESOLVED
                          </span>
                        )}
                      </div>
                    </div>

                    <button className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 text-[10px] font-bold uppercase text-white border border-white/10 hover:bg-white/10 hover:border-white/30">
                      View_Raw
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {!filteredAlerts?.length && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50">
                <Shield className="h-16 w-16 mb-4 stroke-[1]" />
                <p className="font-mono text-xs uppercase tracking-widest">No Active Threats Detected</p>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
}
