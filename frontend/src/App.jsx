import React, { useState } from 'react';
import {
  AreaChart, Area, Tooltip,
  ResponsiveContainer, XAxis
} from 'recharts';
import {
  AlertTriangle, CheckCircle,
  XCircle, ArrowLeft, RefreshCw
} from 'lucide-react';
import MapView from './MapView';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [viewMode, setViewMode] = useState('map');
  const [selectedStation, setSelectedStation] = useState(null);
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [networkHealth, setNetworkHealth] = useState('healthy');
  const [refreshing, setRefreshing] = useState(false);

  const fetchStationKPIData = async (stationId) => {
    try {
      setLoading(true);
      setRefreshing(true);
      const res = await fetch(`${API_BASE_URL}/base-stations/${stationId}`);
      const data = await res.json();
      setKpiData({ network_kpis: data.kpis });
      setLastUpdate(new Date());
      setNetworkHealth('healthy');
    } catch {
      setNetworkHealth('critical');
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  if (viewMode === 'map') {
    return <MapView onStationSelect={(s) => {
      setSelectedStation(s);
      setViewMode('dashboard');
      fetchStationKPIData(s.id);
    }} />;
  }

  if (loading || !kpiData) {
    return <div className="loading-screen">Loading Dashboard...</div>;
  }

  return (
    <div className="App">
      <header className="dashboard-header">
        <button onClick={() => setViewMode('map')}>
          <ArrowLeft /> Back
        </button>
        <h2>{selectedStation.name}</h2>
        <button onClick={() => fetchStationKPIData(selectedStation.id)}>
          <RefreshCw className={refreshing ? 'spinning' : ''} />
        </button>
        <span>{lastUpdate.toLocaleTimeString()}</span>
      </header>

      <div className={`health-banner ${networkHealth}`}>
        {networkHealth === 'critical' ? <XCircle /> :
         networkHealth === 'warning' ? <AlertTriangle /> :
         <CheckCircle />}
        {networkHealth.toUpperCase()}
      </div>

      <div className="kpi-grid">
        {Object.entries(kpiData.network_kpis).map(([key, kpi]) => (
          <div className="kpi-card" key={key}>
            <h4>{key.replaceAll('_', ' ')}</h4>
            <p>{kpi.current} {kpi.unit}</p>

            <ResponsiveContainer height={80}>
              <AreaChart data={kpi.trend.map((v, i) => ({ i, v }))}>
                <XAxis hide dataKey="i" />
                <Area dataKey="v" stroke="#3b82f6" fill="#3b82f633" />
                <Tooltip />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
