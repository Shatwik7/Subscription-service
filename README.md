# 📦 Subscription-Based SaaS System

A modular, microservices-based subscription model built using **Node.js**, **NestJS**, **Kafka**, **PostgreSQL**, and **MongoDB**.

## 🧱 Architecture Overview!
![diagram-export-5-28-2025-5_57_26-PM](https://github.com/user-attachments/assets/4c4efb7a-9ae2-4335-94d9-a83082444cd7)
This project is divided into three microservices:

### 1. 🧾 Subscriptions Service (REST)
- Manages user subscriptions and plans.
- Uses **PostgreSQL** for relational data.
- Exposes RESTful APIs.
- Uses Cron Job To Expire the subscriptions.

#### Endpoints:
| Method | Endpoint                  | Description                         |
|--------|---------------------------|---------------------------------------|
| POST   | `/subscriptions`          | Create a new subscription             |
| GET    | `/subscriptions/{userId}` | Retrieve a user's subscription        |
| PUT    | `/subscriptions/{userId}` | Update a user's subscription          |
| DELETE | `/subscriptions/{userId}` | Cancel a user's subscription          |
| GET    | `/plans`                  | Retrieve available subscription plans |

### 2. 📬 Notification Service
- Subscribes to Kafka topics.
- Listens for events like `subscription-created` or `subscription-removed`.
- Sends email notifications (plug in your provider).

### 3. 📑 Logger Service
- Consumes Kafka events.
- Stores all received events as logs in **MongoDB**.

---

## 🛠 Tech Stack

- **Node.js**
- **NestJS**
- **Kafka**
- **PostgreSQL**
- **MongoDB**
- **Docker** (for local dev orchestration)

---

## 🚀 Getting Started

### 1. Clone the repository:

```bash
git clone https://github.com/shatwik7/subscription-system.git
cd subscription-system
npm install
docker-compose up -d
```

### 2. then run each service from thier workspaces
```bash
cd  apps/subscription-service
npm run start:dev
```
```bash
cd apps/audit-log-consumer
npm run start:dev
```
```bash
cd apps/notification-consume
npm run start:dev
```
