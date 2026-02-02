import { Layout } from "@/components/Layout";
import { useLogs } from "@/hooks/use-logs";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/ui/PageTransition";
import { Search, Download, RefreshCcw, Terminal, Activity, FileText } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Logs() {
  const { data: logs } = useLogs();
  const [search, setSearch] = useState("");

  const filteredLogs = logs?.filter(log =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.details?.toLowerCase().includes(search.toLowerCase()) ||
    log.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <PageTransition className="space-y-6 h-full flex flex-col">
        {/* HUD Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="h-5 w-5 text-blue-500" />
              <h1 className="text-2xl font-bold text-white tracking-tight uppercase">System Logs</h1>
            </div>
            <p className="text-muted-foreground text-xs font-mono tracking-wider">AUDIT TRAIL // CLASSIFIED</p>
          </div>

          <div className="flex gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="SEARCH_LOGS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-black/40 border border-white/10 rounded px-9 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors w-64 font-mono uppercase"
              />
            </div>
            <button className="p-2 border border-white/10 bg-black/40 rounded hover:bg-white/5 text-blue-500 transition-colors">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Logs Terminal */}
        <div className="flex-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden flex flex-col font-mono text-sm relative">
          {/* Terminal Header */}
          <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex gap-2 items-center">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <span className="text-[10px] text-zinc-500 ml-2">root@skynet:~# tail -f /var/log/syslog</span>
          </div>

          {/* Log Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar relative">
            <AnimatePresence>
              {filteredLogs?.map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-4 group hover:bg-white/5 p-1 rounded -mx-1"
                >
                  <span className="text-zinc-600 shrink-0 select-none">[{format(new Date(log.timestamp), 'HH:mm:ss')}]</span>
                  <div className="flex-1 flex gap-4">
                    <span className={cn(
                      "shrink-0 w-16 uppercase font-bold text-[10px] py-0.5 text-center rounded border",
                      log.level === 'error' ? "text-red-500 border-red-500/30 bg-red-500/10" :
                        log.level === 'warning' ? "text-yellow-500 border-yellow-500/30 bg-yellow-500/10" :
                          "text-green-500 border-green-500/30 bg-green-500/10"
                    )}>
                      {log.level}
                    </span>
                    <span className="text-blue-400 font-bold shrink-0 w-32">{log.action}</span>
                    <span className="text-zinc-400 truncate group-hover:text-white transition-colors">{log.details}</span>
                  </div>
                  <span className="text-zinc-600 text-xs shrink-0">{log.user}</span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Cursor Effect */}
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-2 h-4 bg-green-500 mt-2"
            />
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
}
