import { Header } from '@/components/layout/Header';
import { Shield, Bell, Server, Key, Database, Save, AlertTriangle, Loader2 } from 'lucide-react';
import { resetDatabase } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

const Settings = () => {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (window.confirm("ARE YOU SURE? This will permanently delete ALL customers, devices, and EMI records. This action cannot be undone.")) {
      setIsResetting(true);
      try {
        await resetDatabase();
        toast({
          title: "Database Reset",
          description: "All data has been cleared successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to reset database.",
          variant: "destructive"
        });
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="animate-fade-in pb-20">
      <Header
        title="Settings"
        subtitle="Configure system preferences and integrations"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Configuration */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Server className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Server Configuration</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">API Endpoint</label>
              <input
                type="url"
                className="input-field font-mono text-sm"
                defaultValue="https://api.emilock.example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Admin APK URL</label>
              <input
                type="url"
                className="input-field font-mono text-sm"
                defaultValue="https://cdn.emilock.example.com/apk/admin.apk"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">APK Checksum (SHA256)</label>
              <input
                type="text"
                className="input-field font-mono text-sm"
                defaultValue="abc123def456..."
              />
            </div>
          </div>
        </div>

        {/* Firebase Configuration */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Bell className="w-5 h-5 text-warning" />
            </div>
            <h3 className="font-semibold text-foreground">Firebase FCM</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Project ID</label>
              <input
                type="text"
                className="input-field"
                placeholder="your-firebase-project"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Server Key</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••••••••••"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Sender ID</label>
              <input
                type="text"
                className="input-field"
                placeholder="123456789"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground">Security Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Auto-lock on Overdue</p>
                <p className="text-sm text-muted-foreground">Automatically lock devices when EMI is overdue</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Grace Period (Days)</p>
                <p className="text-sm text-muted-foreground">Days before auto-lock after due date</p>
              </div>
              <input
                type="number"
                className="w-20 px-3 py-2 bg-input border border-border rounded-lg text-center"
                defaultValue="3"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Offline Lock Threshold</p>
                <p className="text-sm text-muted-foreground">Lock device if offline for (days)</p>
              </div>
              <input
                type="number"
                className="w-20 px-3 py-2 bg-input border border-border rounded-lg text-center"
                defaultValue="7"
              />
            </div>
          </div>
        </div>

        {/* Database Management */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Database className="w-5 h-5 text-destructive" />
            </div>
            <h3 className="font-semibold text-foreground">Database Management</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <h4 className="font-semibold text-destructive mb-2">Danger Zone</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Resetting the database will permanently delete all customer data, device records, and EMI details.
              </p>
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="btn-destructive w-full flex items-center justify-center gap-2"
              >
                {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                {isResetting ? 'Resetting...' : 'Reset Database'}
              </button>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="glass-card rounded-xl p-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">API Keys</h3>
            </div>
            <button className="btn-secondary text-sm w-full sm:w-auto">Generate New Key</button>
          </div>

          {/* Mobile View: Cards */}
          <div className="grid gap-4 md:hidden">
            <div className="p-4 bg-secondary/30 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-medium text-foreground">Production API</span>
                <span className="status-badge status-unlocked">Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Key</span>
                <span className="font-mono text-foreground">sk_live_••••••••••••</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span className="text-foreground">Jan 15, 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Used</span>
                <span className="text-foreground">2 hours ago</span>
              </div>
            </div>
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
            <table className="data-table min-w-[500px] sm:min-w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Key</th>
                  <th>Created</th>
                  <th>Last Used</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-foreground">Production API</td>
                  <td className="font-mono text-muted-foreground">sk_live_••••••••••••</td>
                  <td className="text-muted-foreground">Jan 15, 2024</td>
                  <td className="text-muted-foreground">2 hours ago</td>
                  <td><span className="status-badge status-unlocked">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 py-4 md:py-3">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
