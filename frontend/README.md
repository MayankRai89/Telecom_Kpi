# 📡 Telecom KPI Monitoring Portal

A web-based application to monitor and visualize key telecom network KPIs using an interactive dashboard and simulated backend APIs.

---

## 📌 Project Overview

Telecom networks generate multiple performance metrics to understand:

- Network health
- User experience
- Capacity and congestion

This project helps students understand telecom KPIs through clear visualization and simulated real-world behavior.

> ⚠️ Note: This project focuses on learning and visualization, not real telecom hardware integration.

---

## 🎯 Objectives

- Visualize key telecom KPIs
- Understand KPI trends over time
- Learn how KPIs reflect network performance
- Build backend–frontend integration skills

---

## 🧩 Features

### Frontend
- Map-based base station selection
- Interactive KPI dashboard
- Trend charts and graphs
- Automated issue detection
- Network health status indicators

### Backend
- REST APIs using Node.js & Express
- Simulated live KPI data
- Region-wise and station-wise KPIs
- JSON-based base data

---

## 📊 Key KPIs Used

- Active Users
- Latency
- Call Drop Rate
- Packet Loss
- Network Availability
- Average Throughput
- Spectrum Efficiency

---

## 🏗️ Project Structure

telecom_kpis/
└── Airtel_Kpi/
├── backend/
│ ├── server.js
│ ├── data.json
│ └── package.json
└── frontend/
├── src/
│ ├── App.jsx
│ ├── MapView.jsx
│ └── App.css
└── package.json

---

## ⚙️ Technologies Used

### Frontend
- React (Vite)
- Recharts
- Lucide Icons
- CSS

### Backend
- Node.js
- Express.js
- CORS
- dotenv

---

## 🚀 How to Run the Project

### 1️⃣ Backend

```bash
cd Airtel_Kpi/backend
npm install
node server.js
Backend runs at:

http://localhost:4000


Test:

http://localhost:4000/api/health

2️⃣ Frontend
cd Airtel_Kpi/frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

🔗 API Endpoints
Method	Endpoint
GET	/api/health
GET	/api/kpis
GET	/api/kpis/:kpiName
GET	/api/regional
GET	/api/alerts
GET	/api/base-stations
GET	/api/base-stations/:stationId
🧠 Intelligent Issue Detection

The system automatically detects:

Network congestion

Tower failures

High latency

Low availability

Capacity overload

Each issue includes severity and recommendations.

🚫 Limitations

No real telecom data

No live monitoring

No predictive analytics

🎓 Learning Outcomes

Telecom KPI understanding

Data visualization

Backend–frontend integration

Network performance analysis

👤 Author

Mayank Rai
Telecom KPI Monitoring Portal


---

## ✅ Step 3: Save & Preview README

- **Ctrl + S** → Save file  
- Right click on `README.md` → **Open Preview**
- Or press:



Ctrl + Shift + V


---

## 🧠 Pro Tip (GitHub Ready)

GitHub automatically renders `README.md`  
Just push the file:

```bash
git add README.md
git commit -m "Add project README"
git push