import { useState, useEffect } from 'react';

interface TelemetryData {
  node_id: number;
  workload_type: number;
  temperature: number;
  fan_speed: number;
  power_draw: number;
  recorded_at: string;
}

interface AnalyticsData {
  avg_temperature: string;
  total_power_draw: string;
  active_nodes: string;
}

interface AlertData {
  node_id: number;
  temperature: number;
  workload_type: number;
}

export default function App() {
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  const getWorkloadName = (type: number) => {
    switch (type) {
      case 0: return 'Idle';
      case 1: return 'AI Training';
      case 2: return 'Cryptography';
      default: return 'Unknown';
    }
  };

  const fetchData = async () => {
    try {
      const [telemetryRes, analyticsRes, alertsRes] = await Promise.all([
        fetch('http://localhost:3000/api/telemetry'),
        fetch('http://localhost:3000/api/analytics'),
        fetch('http://localhost:3000/api/alerts')
      ]);

      setTelemetry(await telemetryRes.json());
      setAnalytics(await analyticsRes.json());
      setAlerts(await alertsRes.json());
    } catch (error) {
      console.error('Error syncing with backend cluster:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 font-medium">
      
      <header className="mb-8 border-b border-gray-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gray-100">
            GPU CLUSTER MONITOR
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
          <span className="text-xs font-mono text-green-400 uppercase tracking-widest">Live Stream Active</span>
        </div>
      </header>

      {alerts.length > 0 && (
        <section className="mb-8 bg-red-950/40 border border-red-800/60 rounded-xl p-4">
          <h3 className="text-red-400 font-bold text-sm tracking-wide uppercase mb-3 flex items-center gap-2">
            THERMAL THROTTLING WARNINGS ({alerts.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {alerts.map((alert) => (
              <div key={alert.node_id} className="bg-red-900/30 border border-red-700/40 p-3 rounded-lg flex justify-between items-center animate-pulse">
                <div>
                  <span className="text-xs text-red-300 block font-mono">NODE #{alert.node_id}</span>
                  <span className="text-xs text-gray-400">{getWorkloadName(alert.workload_type)}</span>
                </div>
                <span className="text-lg font-black text-red-400">{alert.temperature}°C</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {analytics && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-xl">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Fleet Thermal Avg</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">{analytics.avg_temperature}°C</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-xl">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Total Grid Power Draw</span>
            <div className="text-3xl font-extrabold text-blue-400 font-mono">{(parseFloat(analytics.total_power_draw) / 1000).toFixed(2)} kW</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-xl">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Monitored Computes</span>
            <div className="text-3xl font-extrabold text-purple-400 font-mono">{analytics.active_nodes} / 500 Nodes</div>
          </div>
        </section>
      )}

      <main>
        <h2 className="text-lg font-bold text-gray-300 mb-4 tracking-wide uppercase">Active Cluster Topology Grid</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {telemetry.map((node) => {
            const isHot = node.temperature > 85;
            return (
              <div 
                key={node.node_id} 
                className={`transition-all duration-300 p-4 rounded-xl border shadow-md bg-gray-900 ${
                  isHot ? 'border-red-600/80 shadow-red-950/20' : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-mono font-bold text-sm text-gray-200">NODE #{node.node_id}</h3>
                    <span className="text-[11px] font-medium text-gray-400 px-2 py-0.5 bg-gray-800 rounded-md border border-gray-700/50 inline-block mt-1">
                      {getWorkloadName(node.workload_type)}
                    </span>
                  </div>
                  <span className={`text-base font-black font-mono ${isHot ? 'text-red-400' : 'text-emerald-400'}`}>
                    {node.temperature}°C
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Power:</span>
                    <span className="text-gray-300 font-medium">{node.power_draw}W</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fans:</span>
                    <span className="text-gray-300 font-medium">{Math.round(node.fan_speed)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

    </div>
  );
}