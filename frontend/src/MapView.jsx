import React, { useState, useEffect } from 'react';
import { MapPin, Radio, Activity, X } from 'lucide-react';
import './MapView.css';

// const API_BASE_URL = "https://telecom-backend.onrender.com/api";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const MapView = ({ onStationSelect }) => {
  const [baseStations, setBaseStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredStation, setHoveredStation] = useState(null);

  useEffect(() => {
    fetchBaseStations();
  }, []);

  const fetchBaseStations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/base-stations`);
      if (!response.ok) throw new Error('Failed to fetch base stations');
      const data = await response.json();
      setBaseStations(data.base_stations || []);
    } catch (error) {
      console.error('Error fetching base stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStationClick = (station) => {
    setSelectedStation(station);
  };

  const handleViewDashboard = () => {
    if (selectedStation) {
      onStationSelect(selectedStation);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'maintenance': return '#6b7280';
      default: return '#3b82f6';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'operational': return '🟢 Operational';
      case 'warning': return '🟡 Warning';
      case 'maintenance': return '⚙️ Maintenance';
      default: return 'Unknown';
    }
  };

  const getMarkerPosition = (lat, lng) => {
    const latPercent = ((lat - 8) / (35 - 8)) * 100;
    const lngPercent = ((lng - 68) / (97 - 68)) * 100;

    return {
      top: `${100 - latPercent}%`,
      left: `${lngPercent}%`
    };
  };

  if (loading) {
    return (
      <div className="map-loading">
        <div className="loader"></div>
        <p>Loading Base Stations...</p>
      </div>
    );
  }

  return (
    <div className="map-view-container">
      <div className="map-header">
        <div className="map-header-content">
          <Radio size={40} className="map-header-icon" />
          <div>
            <h1>Airtel Base Station Network</h1>
            <p>Select a base station to view detailed KPI metrics</p>
          </div>
        </div>
        <div className="map-stats">
          <div className="map-stat">
            <span className="stat-label">Total Stations</span>
            <span className="stat-value">{baseStations.length}</span>
          </div>
          <div className="map-stat">
            <span className="stat-label">Operational</span>
            <span className="stat-value success">
              {baseStations.filter(s => s.status === 'operational').length}
            </span>
          </div>
          <div className="map-stat">
            <span className="stat-label">Warnings</span>
            <span className="stat-value warning">
              {baseStations.filter(s => s.status === 'warning').length}
            </span>
          </div>
        </div>
      </div>

      <div className="map-content">
        <div className="map-sidebar">
          <h2>Base Stations</h2>
          <div className="station-list">
            {baseStations.map((station) => (
              <div
                key={station.id}
                className={`station-item ${selectedStation?.id === station.id ? 'selected' : ''}`}
                onClick={() => handleStationClick(station)}
              >
                <div className="station-icon" style={{ background: getStatusColor(station.status) }}>
                  <MapPin size={20} />
                </div>
                <div className="station-info">
                  <h3>{station.name}</h3>
                  <p>{station.city}, {station.region}</p>
                  <span className="station-id">{station.id}</span>
                </div>
                <div className="station-status">
                  <span style={{ color: getStatusColor(station.status) }}>
                    {getStatusLabel(station.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="map-display">
          <div className="india-map">
            <svg viewBox="0 0 800 1000" className="map-svg">
              <path
                d="M400 100 L500 150 L550 200 L600 300 L650 400 L650 600 L600 700 L550 800 L500 850 L450 900 L400 950 L350 900 L300 850 L250 800 L200 700 L150 600 L150 400 L200 300 L250 200 L300 150 Z"
                fill="rgba(59, 130, 246, 0.05)"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="2"
              />
            </svg>

            {baseStations.map((station) => {
              const position = getMarkerPosition(station.latitude, station.longitude);
              const isSelected = selectedStation?.id === station.id;
              const isHovered = hoveredStation?.id === station.id;

              return (
                <div
                  key={station.id}
                  className={`map-marker ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                  style={{ ...position, borderColor: getStatusColor(station.status) }}
                  onClick={() => handleStationClick(station)}
                  onMouseEnter={() => setHoveredStation(station)}
                  onMouseLeave={() => setHoveredStation(null)}
                >
                  <MapPin size={24} />
                  <div
                    className="coverage-radius"
                    style={{
                      width: `${station.coverage_radius * 20}px`,
                      height: `${station.coverage_radius * 20}px`,
                      borderColor: getStatusColor(station.status)
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedStation && (
        <div className="station-details-panel">
          <div className="panel-header">
            <h2>Selected Base Station</h2>
            <button className="close-btn" onClick={() => setSelectedStation(null)}>
              <X size={20} />
            </button>
          </div>
          <div className="panel-content">
            <div className="detail-row">
              <span className="detail-label">Station ID:</span>
              <span className="detail-value">{selectedStation.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{selectedStation.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{selectedStation.city}, {selectedStation.region}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Coordinates:</span>
              <span className="detail-value">
                {selectedStation.latitude?.toFixed(4)}°N, {selectedStation.longitude?.toFixed(4)}°E
              </span>
            </div>

            <button className="view-dashboard-btn" onClick={handleViewDashboard}>
              <Activity size={20} />
              View KPI Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
