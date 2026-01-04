# 🌟 Community Lost & Found Tracker

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express)

A modern, professional, and visually stunning full-stack platform designed to help community members track, report, and recover lost, stolen, or found items. Built with a focus on premium user experience, real-time tracking, and robust data management.

---

## 📖 Table of Contents
- [✨ Key Features](#-key-features)
- [🚀 Technologies Used](#-technologies-used)
- [🛠️ Installation](#️-installation)
- [🗄️ MySQL Setup (Beginner Friendly)](#️-mysql-setup-beginner-friendly)
- [💻 Usage](#-usage)
- [🏗️ Project Structure](#️-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📧 Contact](#-contact)

---

## ✨ Key Features

- **🔍 Advanced Discovery**: Search and filter items by category, condition, status (Lost/Found/Stolen), and location.
- **📝 Detailed Reporting**: Comprehensive forms for reporting items, including support for image uploads and priority levels.
- **💬 Community Interaction**: Integrated commenting system for users to provide leads and communicate about specific items.
- **⚡ Real-time Updates**: Instant tracking of item status changes and community feedback.
- **🛡️ Admin Dashboard**: Powerful administrative tools for managing reports, users, and platform activity.
- **🎨 Premium UI/UX**: Stunning aesthetics featuring:
  - ✨ Interactive Particle Backgrounds
  - 🍱 Bento-style Layouts
  - 🌑 Sleek Dark/Light Mode
  - 📊 Dynamic Stats Visualizations
  - 💫 Smooth Framer Motion Animations

---

## 🚀 Technologies Used

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **Forms**: React Hook Form & Zod

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Sequelize](https://sequelize.org/)
- **File Uploads**: Multer
- **Authentication**: Bcrypt.js

### Database
- **Primary DB**: [MySQL 8.0](https://www.mysql.com/)

---

## 🛠️ Installation

Follow these steps to get the project running locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/community-lost-found-tracker.git
   cd community-lost-found-tracker
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Open `config/database.js` and ensure the MySQL connection settings match your local environment:
   ```javascript
   const sequelize = new Sequelize({
     dialect: 'mysql',
     host: 'localhost',
     port: 3306, // Default MySQL port
     username: 'your_username',
     password: 'your_password',
     database: 'CommunityTrackerDB',
     logging: false,
   });
   ```

---

## 🗄️ MySQL Setup (Beginner Friendly)

If you don't have MySQL installed or haven't set up a database like this before, follow these steps:

### 1. Install MySQL
- **Windows**: Download and install [MySQL Installer](https://dev.mysql.com/downloads/installer/).
- **macOS**: Use Homebrew: `brew install mysql`.
- **Linux**: `sudo apt install mysql-server`.

### 2. Access MySQL
Open your terminal or **MySQL Command Line Client** and log in:
```bash
mysql -u root -p
```

### 3. Initialize the Database
Once logged in, you can set up the project database in two ways:

**Method A: Using the SQL Script (Recommended)**
Run the following command in your terminal (not inside the MySQL prompt):
```bash
mysql -u root -p < database_schema.sql
```

**Method B: Manual Setup**
Copy and paste the contents of `mysql_setup.sql` into your MySQL workbench/client. This will:
1. Create the `CommunityTrackerDB` database.
2. Create a default user `tracker_user` with password `tracker_password`.
3. Set up all 15 necessary tables and relationships.

---

## 💻 Usage

To run the application, you need to start **two** processes (Backend & Frontend):

### 1. Start the Backend Server
This handles database connections and API requests.
```bash
node backend-server.js
```
The backend will run on `http://localhost:3001`.

### 2. Start the Frontend (Next.js)
In a **new terminal tab**, run:
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`.

### 3. Access Admin Panel
- Navigate to `/admin` on the website.
- You can create an initial admin account by running:
  ```bash
  node create-admin.js
  ```

---

## 🏗️ Project Structure

```text
├── app/                  # Next.js Pages & Layouts
├── components/           # Reusable UI Components
├── config/               # DB & System Configurations
├── models/               # Sequelize Data Models
├── routes/               # Express API Endpoints
├── public/               # Static Assets & Image Uploads
├── database_schema.sql  # Full DB Schema (17 Tables)
├── mysql_setup.sql      # Quick User & DB Setup Script
└── backend-server.js     # Express App Entry Point
```

---

## 🤝 Contributing

Contributions make the community better!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📧 Contact

**Author**: Salik Ahmad  
**Email**: salikahmad702@gmail.com  
**Project Link**: [https://github.com/your-username/community-lost-found-tracker](https://github.com/your-username/community-lost-found-tracker)

---

<p align="center">Made with ❤️ for the Community</p>
