# Real-Time GPU Cluster Monitor

This is a full-stack telemetry pipeline that simulates and visualizes the following live performance data across 500 compute clusters:

 - Temperatures
 - Power draw
 - Fan speeds
 - Workloads

---

## Core Features

- **Live Topology Grid:** Visualizes cluster nodes dynamically updating every 3 seconds.
- **Dynamic Workload Tracking:** Simulates changing enterprise GPU tasks (AI Training, Cryptography, Idle).
- **Fleet Analytics:** Computes real-time average fleet temperatures and active hardware counts.
- **Thermal Overheat Warnings:** Instantly flags and highlights nodes exceeding a critical 85°C safety threshold to display active throttle statuses.

---

## The Stack

- **Frontend:** React, TypeScript, Tailwind CSS v4, Vite
- **Backend:** Node.js, Express, TypeScript, CORS
- **Data Engine:** Asynchronous batch loops and state trackers

---

## Setup

### Prerequisites
Make sure you have Node.js installed on your machine.

### 1. Clone & Setup Backend
Navigate to the backend directory, install dependencies, and start the telemetry stream:
```bash
cd backend
npm install
npm run dev
```
The backend server will be available at http://localhost:3000.

### 2. Clone & Setup Frontend
Open a new terminal tab, navigate to the frontend directory, install dependencies, and launch the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
The frontend server will be available at http://localhost:5173.
