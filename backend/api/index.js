const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// ===================== MIDDLEWARE =====================
app.use(cors());
app.use(express.json());

// ===================== DATA HELPERS =====================
const loadBaseData = () => {
  const dataPath = path.join(__dirname, "../data.json");
  const rawData = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(rawData);
};

const randomInRange = (min, max) => Math.random() * (max - min) + min;

// ===================== KPI SIMULATION =====================
const simulateLiveData = (baseData) => {
  const data = JSON.parse(JSON.stringify(baseData));

  Object.keys(data.network_kpis).forEach((kpiName) => {
    const kpi = data.network_kpis[kpiName];
    let newValue = kpi.current;

    switch (kpiName) {
      case "active_users":
        newValue += Math.floor(randomInRange(-2000, 2000));
        newValue = Math.max(100000, newValue);
        break;

      case "latency":
        newValue += Math.floor(randomInRange(-3, 3));
        newValue = Math.max(10, Math.min(100, newValue));
        break;

      case "call_drop_rate":
      case "packet_loss":
        newValue += randomInRange(-0.15, 0.15);
        newValue = Math.max(0.1, Math.min(3, newValue));
        break;

      case "call_setup_success_rate":
      case "network_availability":
        newValue += randomInRange(-0.2, 0.2);
        newValue = Math.max(95, Math.min(100, newValue));
        break;

      default:
        newValue *= 1 + randomInRange(-0.05, 0.05);
    }

    newValue =
      kpiName === "active_users" || kpiName === "latency"
        ? Math.round(newValue)
        : Math.round(newValue * 100) / 100;

    kpi.current = newValue;
    kpi.trend = [...kpi.trend.slice(1), newValue];

    const threshold = kpi.threshold;
    const lowerIsBetter = ["call_drop_rate", "latency", "packet_loss"].includes(
      kpiName
    );

    if (lowerIsBetter) {
      kpi.status =
        newValue <= threshold * 0.6
          ? "excellent"
          : newValue <= threshold * 0.85
          ? "good"
          : newValue <= threshold
          ? "warning"
          : "critical";
    } else {
      kpi.status =
        newValue >= threshold * 1.05
          ? "excellent"
          : newValue >= threshold * 0.98
          ? "good"
          : newValue >= threshold * 0.9
          ? "warning"
          : "critical";
    }
  });

  data.regional_performance.forEach((region) => {
    region.call_drop_rate = Math.max(
      0.5,
      Math.min(3, region.call_drop_rate + randomInRange(-0.15, 0.15))
    );
    region.availability = Math.max(
      98,
      Math.min(100, region.availability + randomInRange(-0.1, 0.1))
    );
    region.throughput = Math.max(
      30,
      Math.min(60, region.throughput + randomInRange(-2, 2))
    );
  });

  if (Math.random() > 0.7) {
    const messages = [
      "Minor network congestion detected",
      "All systems operating normally",
      "Peak traffic hour in progress",
      "Scheduled maintenance completed",
    ];

    data.alerts = [
      {
        severity: "info",
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp: new Date().toISOString(),
      },
      ...data.alerts.slice(0, 2),
    ];
  }

  return data;
};

// ===================== API ROUTES =====================
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Telecom KPI Monitoring API (Vercel)",
  });
});

app.get("/api/kpis", (req, res) => {
  const liveData = simulateLiveData(loadBaseData());
  res.json(liveData);
});

app.get("/api/kpis/:kpiName", (req, res) => {
  const liveData = simulateLiveData(loadBaseData());
  const kpi = liveData.network_kpis[req.params.kpiName];

  if (!kpi) {
    return res.status(404).json({ error: "KPI not found" });
  }

  res.json({ kpi: req.params.kpiName, data: kpi });
});

app.get("/api/regional", (req, res) => {
  const liveData = simulateLiveData(loadBaseData());
  res.json(liveData.regional_performance);
});

app.get("/api/alerts", (req, res) => {
  const liveData = simulateLiveData(loadBaseData());
  res.json(liveData.alerts);
});

app.get("/api/base-stations", (req, res) => {
  const baseData = loadBaseData();
  res.json(baseData.base_stations);
});

// 🚀 IMPORTANT: Do NOT use app.listen()
module.exports = app;
