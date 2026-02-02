import { Layout } from "@/components/Layout";
import { Moon, Bell, Shield, Database, Users, Check } from "lucide-react";
import { PageTransition } from "@/components/ui/PageTransition";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

function Toggle({ label, sublabel, checked, onChange }: { label: string; sublabel: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 cursor-pointer group" onClick={onChange}>
      <div>
        <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{label}</p>
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      </div>
      <div className={cn(
        "h-6 w-11 rounded-full relative transition-colors duration-300",
        checked ? "bg-primary" : "bg-white/10"
      )}>
        <div className={cn(
          "absolute top-1 h-4 w-4 bg-white rounded-full shadow-sm transition-transform duration-300",
          checked ? "left-[calc(100%-1.25rem)]" : "left-1"
        )} />
      </div>
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState({
    darkMode: true,
    compactMode: false,
    notifications: {
      critical: true,
      status: true,
      offline: false
    }
  });

  return (
    <Layout>
      <PageTransition className="space-y-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
          <p className="text-muted-foreground mt-1">Configure system parameters and preferences</p>
        </div>

        <div className="max-w-3xl space-y-6">
          {/* Appearance */}
          <div className="bg-card border border-white/5 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Moon className="h-5 w-5 text-primary" /> Appearance
            </h3>
            <div className="space-y-1">
              <Toggle
                label="Dark Mode"
                sublabel="Force high contrast dark theme for low-light environments"
                checked={settings.darkMode}
                onChange={() => setSettings(s => ({ ...s, darkMode: !s.darkMode }))}
              />
              <Toggle
                label="Compact Mode"
                sublabel="Increase data density in lists and tables"
                checked={settings.compactMode}
                onChange={() => setSettings(s => ({ ...s, compactMode: !s.compactMode }))}
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-white/5 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Notifications
            </h3>
            <div className="space-y-1">
              <Toggle
                label="Critical Alerts"
                sublabel="Immediate push notifications for security breaches"
                checked={settings.notifications.critical}
                onChange={() => setSettings(s => ({ ...s, notifications: { ...s.notifications, critical: !s.notifications.critical } }))}
              />
              <Toggle
                label="System Status Changes"
                sublabel="Notify when system health degrades"
                checked={settings.notifications.status}
                onChange={() => setSettings(s => ({ ...s, notifications: { ...s.notifications, status: !s.notifications.status } }))}
              />
              <Toggle
                label="Device Offline"
                sublabel="Notify when a camera or sensor disconnects"
                checked={settings.notifications.offline}
                onChange={() => setSettings(s => ({ ...s, notifications: { ...s.notifications, offline: !s.notifications.offline } }))}
              />
            </div>
          </div>

          {/* System */}
          <div className="bg-card border border-white/5 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Security
            </h3>
            <div className="space-y-4">
              <button className="w-full py-3 border border-white/10 rounded text-sm text-white hover:bg-white/5 text-left px-4 flex justify-between items-center transition-colors group">
                <div>
                  <span>Manage API Keys</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Revoke or generate new access tokens</p>
                </div>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-muted-foreground group-hover:text-white transition-colors">3 Active</span>
              </button>
              <button className="w-full py-3 border border-white/10 rounded text-sm text-white hover:bg-white/5 text-left px-4 flex justify-between items-center transition-colors group">
                <div>
                  <span>Audit Logs Retention</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Configure data persistence policy</p>
                </div>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-muted-foreground group-hover:text-white transition-colors">90 Days</span>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border border-red-900/30 bg-red-900/5 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-500 mb-4 flex items-center gap-2">
              Danger Zone
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Reset System Configuration</p>
                <p className="text-xs text-muted-foreground">This action cannot be undone. All local settings will be wiped.</p>
              </div>
              <button className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-xs font-bold uppercase hover:bg-red-500 hover:text-white transition-all">
                Reset Defaults
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
}
