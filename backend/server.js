const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Load base data from JSON file
const loadBaseData = () => {
  const dataPath = path.join(__dirname, 'data.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(rawData);
};

// Utility function to generate random number in range
const randomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Simulate live data with realistic variations
const simulateLiveData = (baseData) => {
  // Deep clone the base data
  const data = JSON.parse(JSON.stringify(baseData));
  
  // Update each KPI with realistic variations
  Object.keys(data.network_kpis).forEach(kpiName => {
    const kpi = data.network_kpis[kpiName];
    const current = kpi.current;
    let newValue;
    
    // Apply different variation logic based on KPI type
    switch(kpiName) {
      case 'active_users':
        // Users fluctuate more dramatically
        newValue = current + Math.floor(randomInRange(-2000, 2000));
        newValue = Math.max(100000, newValue); // Ensure minimum
        break;
        
      case 'latency':
        // Latency changes in small increments
        newValue = current + Math.floor(randomInRange(-3, 3));
        newValue = Math.max(10, Math.min(100, newValue)); // Keep in realistic range
        break;
        
      case 'call_drop_rate':
      case 'packet_loss':
        // These should stay low and change slowly
        newValue = current + randomInRange(-0.15, 0.15);
        newValue = Math.max(0.1, Math.min(3, newValue));
        break;
        
      case 'call_setup_success_rate':
      case 'network_availability':
        // High percentage values with small variations
        newValue = current + randomInRange(-0.2, 0.2);
        newValue = Math.max(95, Math.min(100, newValue));
        break;
        
      default:
        // General variation (±5%)
        newValue = current * (1 + randomInRange(-0.05, 0.05));
    }
    
    // Round appropriately
    if (kpiName === 'active_users' || kpiName === 'latency') {
      newValue = Math.round(newValue);
    } else {
      newValue = Math.round(newValue * 100) / 100;
    }
    
    // Update current value
    kpi.current = newValue;
    
    // Update trend array (shift left and add new value)
    kpi.trend = [...kpi.trend.slice(1), newValue];
    
    // Update status based on threshold
    const threshold = kpi.threshold;
    
    if (['call_drop_rate', 'latency', 'packet_loss'].includes(kpiName)) {
      // Lower is better
      if (newValue <= threshold * 0.6) {
        kpi.status = 'excellent';
      } else if (newValue <= threshold * 0.85) {
        kpi.status = 'good';
      } else if (newValue <= threshold) {
        kpi.status = 'warning';
      } else {
        kpi.status = 'critical';
      }
    } else {
      // Higher is better
      if (newValue >= threshold * 1.05) {
        kpi.status = 'excellent';
      } else if (newValue >= threshold * 0.98) {
        kpi.status = 'good';
      } else if (newValue >= threshold * 0.90) {
        kpi.status = 'warning';
      } else {
        kpi.status = 'critical';
      }
    }
  });
  
  // Update regional performance
  data.regional_performance.forEach(region => {
    region.call_drop_rate = Math.round((region.call_drop_rate + randomInRange(-0.15, 0.15)) * 100) / 100;
    region.availability = Math.round((region.availability + randomInRange(-0.1, 0.1)) * 100) / 100;
    region.throughput = Math.round((region.throughput + randomInRange(-2, 2)) * 10) / 10;
    
    // Keep values in realistic ranges
    region.call_drop_rate = Math.max(0.5, Math.min(3, region.call_drop_rate));
    region.availability = Math.max(98, Math.min(100, region.availability));
    region.throughput = Math.max(30, Math.min(60, region.throughput));
  });
  
  // Occasionally add/update alerts
  if (Math.random() > 0.7) {
    const alertMessages = [
      'Minor network congestion detected in South region',
      'All systems operating normally',
      'Peak traffic hour - monitoring closely',
      'Scheduled maintenance completed successfully',
      'Network optimization in progress'
    ];
    
    const severities = ['info', 'warning'];
    const randomAlert = {
      severity: severities[Math.floor(Math.random() * severities.length)],
      message: alertMessages[Math.floor(Math.random() * alertMessages.length)],
      timestamp: new Date().toISOString()
    };
    
    // Keep only last 3 alerts
    data.alerts = [randomAlert, ...data.alerts.slice(0, 2)];
  }
  
  return data;
};

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Telecom KPI Monitoring API (Express)',
    version: '1.0.0'
  });
});

// Get all KPIs with simulated live data
app.get('/api/kpis', (req, res) => {
  try {
    const baseData = loadBaseData();
    const liveData = simulateLiveData(baseData);
    
    res.json(liveData);
  } catch (error) {
    console.error('Error fetching KPI data:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// Get specific KPI by name
app.get('/api/kpis/:kpiName', (req, res) => {
  try {
    const { kpiName } = req.params;
    const baseData = loadBaseData();
    const liveData = simulateLiveData(baseData);
    
    if (liveData.network_kpis[kpiName]) {
      res.json({
        kpi_name: kpiName,
        data: liveData.network_kpis[kpiName],
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(404).json({ 
        error: 'KPI not found',
        available_kpis: Object.keys(liveData.network_kpis)
      });
    }
  } catch (error) {
    console.error('Error fetching specific KPI:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// Get regional performance data
app.get('/api/regional', (req, res) => {
  try {
    const baseData = loadBaseData();
    const liveData = simulateLiveData(baseData);
    
    res.json({
      regional_performance: liveData.regional_performance,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching regional data:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// Get alerts
app.get('/api/alerts', (req, res) => {
  try {
    const baseData = loadBaseData();
    const liveData = simulateLiveData(baseData);
    
    res.json({
      alerts: liveData.alerts,
      count: liveData.alerts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// Get all base stations
app.get('/api/base-stations', (req, res) => {
  try {
    const baseData = loadBaseData();
    res.json({
      base_stations: baseData.base_stations,
      count: baseData.base_stations.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching base stations:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// Get specific base station KPIs
app.get('/api/base-stations/:stationId', (req, res) => {
  try {
    const { stationId } = req.params;
    const baseData = loadBaseData();
    
    const station = baseData.base_stations.find(s => s.id === stationId);
    
    if (!station) {
      return res.status(404).json({ 
        error: 'Base station not found',
        available_stations: baseData.base_stations.map(s => s.id)
      });
    }
    
    // Generate station-specific KPI data with variations
    const liveData = simulateLiveData(baseData);
    const stationKPIs = JSON.parse(JSON.stringify(liveData.network_kpis));
    
    // Add variation based on station status
    if (station.status === 'warning') {
      stationKPIs.call_drop_rate.current *= 1.3;
      stationKPIs.latency.current *= 1.2;
    } else if (station.status === 'maintenance') {
      stationKPIs.active_users.current *= 0.6;
      stationKPIs.network_availability.current -= 2;
    }
    
    res.json({
      station: station,
      kpis: stationKPIs,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching station KPIs:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    available_endpoints: [
      'GET /api/health',
      'GET /api/kpis',
      'GET /api/kpis/:kpiName',
      'GET /api/regional',
      'GET /api/alerts'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Telecom KPI Monitoring Backend (Express) Started!');
  console.log('='.repeat(60));
  console.log(`📊 Server running at: http://localhost:${PORT}`);
  console.log(`🌐 CORS enabled for all origins`);
  console.log('\n📡 Available Endpoints:');
  console.log(`   ✓ GET  http://localhost:${PORT}/api/health`);
  console.log(`   ✓ GET  http://localhost:${PORT}/api/kpis`);
  console.log(`   ✓ GET  http://localhost:${PORT}/api/kpis/:kpiName`);
  console.log(`   ✓ GET  http://localhost:${PORT}/api/regional`);
  console.log(`   ✓ GET  http://localhost:${PORT}/api/alerts`);
  console.log('='.repeat(60));
  console.log('✅ Ready to receive requests!\n');
});
