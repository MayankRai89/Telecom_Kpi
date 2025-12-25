📡 Telecom KPI Monitoring Portal

A full-stack web application designed to monitor and visualize Telecom Network Key Performance Indicators (KPIs) on an interactive map-based interface.
The project helps analyze network performance, signal quality, and operational status in a simple and visual manner.

🚀 Features

📊 Telecom KPI data visualization

🗺️ Interactive map view for network locations

🔄 Frontend–backend data integration

⚡ Fast frontend powered by Vite + React

🧩 Modular and scalable project structure

🏗️ Tech Stack
Frontend

React.js

Vite

CSS

JavaScript (ES6+)

Backend

Node.js

Express.js

JSON-based data storage (mock database)

📁 Project Structure
Telecom KPI Monitoring Portal
│
├── backend/
│   ├── server.js          # Express server & API logic
│   ├── data.json          # Telecom KPI data
│   ├── package.json       # Backend dependencies
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── App.jsx        # Root React component
    │   ├── main.jsx       # React entry point
    │   ├── MapView.jsx    # Map & KPI visualization
    │   ├── App.css        # Global styles
    │   └── index.css
    │
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── README.md

🔄 How the Application Works

Backend

The Express server reads KPI data from data.json

APIs expose telecom metrics to the frontend

Frontend

React fetches KPI data from the backend

KPIs are displayed on an interactive map

User Flow

User opens the web app

Map loads with telecom KPIs

Network status is visualized dynamically

🛠️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/telecom-kpi-monitoring-portal.git
cd telecom-kpi-monitoring-portal

2️⃣ Backend Setup
cd backend
npm install
npm start


Backend will run on:

http://localhost:5000

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend will run on:

http://localhost:5173

📌 Future Enhancements

📈 Real-time KPI updates

🔐 Authentication & role-based access

📊 Advanced analytics dashboard

🗄️ Database integration (MongoDB / PostgreSQL)

☁️ Cloud deployment

🎯 Use Cases

Telecom network monitoring

KPI performance analysis

Educational & academic projects

Dashboard development practice

👨‍💻 Author

Mayank Rai
Aspiring Full-Stack Developer | Web Technologies Enthusiast

📄 License

This project is licensed under the MIT License.
