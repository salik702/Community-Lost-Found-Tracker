# 🌟 Community Lost & Found Tracker

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express)

**A modern, professional platform to track, report, and recover lost items.**  
*Built with premium UI/UX, real-time tracking, and robust data management.*



</div>

---

## 📖 Table of Contents
- [✨ Key Features](#-key-features)
- [🚀 Tech Stack](#-tech-stack)
- [🛠️ Installation](#️-installation)
- [🗄️ Database Setup](#️-database-setup)
- [💻 Usage](#-usage)
- [📡 API Reference](#-api-reference)
- [🔧 Troubleshooting](#-troubleshooting)
- [🏗️ Project Structure](#️-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📧 Contact](#-contact)

---

## ✨ Key Features

This application isn't just functional; it's designed to be **beautiful** and **intuitive**.

- **🔍 Smart Discovery**: Filter by condition, status (Lost/Found/Stolen), location, and category.
- **📝 Easy Reporting**: Detailed forms with image uploads, priority levels, and map integration.
- **💬 Community Hub**: Comment system for leads and updates on items.
- **⚡ Real-time**: Instant status updates and notifications.
- **🛡️ Admin Panel**: Complete control over users, reports, and platform health.
- **🎨 Premium UI/UX**:
  - ✨ Interactive Particle Backgrounds
  - 🍱 Modern Bento-style Grids
  - 🌑 Polished Dark/Light Modes
  - 💫 Fluid Framer Motion Animations

---

## 🚀 Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat-square)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize)
![Multer](https://img.shields.io/badge/Multer-F28D35?style=flat-square)

### Database
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql)

---

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/community-lost-found-tracker.git
   cd community-lost-found-tracker
   ```

2. **Navigate to Source**:
   All code resides in the `main` directory.
   ```bash
   cd main
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Configure Environment**:
   Update `config/database.js` with your MySQL credentials:
   ```javascript
   const sequelize = new Sequelize({
     host: 'localhost',
     username: 'your_username',
     password: 'your_password',
     database: 'CommunityTrackerDB',
     dialect: 'mysql',
     // ...
   });
   ```

---

## 🗄️ Database Setup

### 1. Install MySQL
- **Windows**: [MySQL Installer](https://dev.mysql.com/downloads/installer/)
- **macOS**: `brew install mysql`
- **Linux**: `sudo apt install mysql-server`

### 2. Initialize Database
You can set up the 15+ tables automatically using the provided script.
Ensure you are in the `main` directory:

```bash
mysql -u root -p < database_schema.sql
```

Alternatively, copy the contents of `mysql_setup.sql` into your MySQL Workbench.

---

## 💻 Usage

### 1. Start Backend
Handles API requests and database connections (Port 3001).
```bash
# In terminal tab 1 (inside 'main' folder)
node backend-server.js
```

### 2. Start Frontend
The user interface (Port 3000).
```bash
# In terminal tab 2 (inside 'main' folder)
npm run dev
```

### 3. Admin Access
Visit `http://localhost:3000/admin`.
Create an initial admin user:
```bash
node create-admin.js
```

---

## 📡 API Reference

Here are the key endpoints available in the backend:

### Items (`/api/items`)
- `GET /` - List all items (supports filtering by status, limit).
- `GET /:id` - Get details for a specific item.
- `POST /` - Report a new missing/found item (requires form-data).
- `PUT /:id` - Update item status or details.
- `DELETE /:id` - Remove an item entry.
- `POST /:id/contact` - Send an email alert to the item reporter.

### Comments (`/api/comments`)
- `GET /:itemId/comments` - Get discussion for an item.
- `POST /` - Add a comment to an item.

---

## 🔧 Troubleshooting

**Common Issues:**

1. **"Invalid time value" Error**:
   - This usually happens if the date format in the database is incompatible. Ensure your columns use the `DATETIME` type and the backend is passing valid JS `Date` objects.

2. **Database Connection Refused**:
   - Check if your MySQL server is running.
   - Verify credentials in `config/database.js`.
   - Ensure port 3306 is open.

3. **Images Not Loading**:
   - Ensure the `uploads/` directory exists in `main/`.
   - The backend serves static files from `/uploads`.

---

## 🏗️ Project Structure

```text
├── main/                 
│   ├── app/              # Next.js App Router (Frontend)
│   ├── components/       # Radix UI & Custom Components
│   ├── config/           # Database Config
│   ├── models/           # Sequelize Models (User, Item, etc.)
│   ├── routes/           # Express Routes (API Logic)
│   ├── public/           # Assets
│   ├── backend-server.js # Entry Point
│   └── ...
├── LICENSE
└── README.md
```

---

## 🤝 Contributing

We welcome contributions!
1. Fork the repo.
2. Create a feature branch: `git checkout -b feature/CoolFeature`
3. Commit changes: `git commit -m 'Add CoolFeature'`
4. Push to branch: `git push origin feature/CoolFeature`
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

## 📧 Contact

<div align="center">

<a href="https://salikahmad.vercel.app/">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=2196F3&center=true&vCenter=true&width=435&lines=Made+With+%E2%9D%A4%EF%B8%8F+By+Salik+Ahmad;Copyright+(c)+2026" alt="Typing SVG" />
</a>

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit%20Site-blue?style=for-the-badge&logo=google-chrome)](https://salikahmad.vercel.app/)
[![Email](https://img.shields.io/badge/Email-salikahmad702%40gmail.com-red?style=for-the-badge&logo=gmail)](mailto:salikahmad702@gmail.com)

</div>
