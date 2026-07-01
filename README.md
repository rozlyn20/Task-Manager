# 🧠 Productive Mind

A modern **MERN Stack Task Management** application designed to help users organize their daily work, manage deadlines, and boost productivity through an intuitive and responsive interface.

> 🚧 **Status:** Currently under active development.

---

## ✨ Features

### ✅ Task Management

* Create new tasks
* Edit existing tasks
* Delete tasks
* Mark tasks as completed
* Add task descriptions
* Set due dates
* Organize tasks using categories

### 📅 Smart Views

* **Home Dashboard**
* **Today** – Displays tasks due today
* **Tomorrow** – Displays tasks due tomorrow
* **Calendar View** – View tasks on an interactive calendar

### 🔐 Authentication

* User Registration
* User Login
* JWT-based Authentication
* Protected Routes *(In Progress)*

### 🎨 User Interface

* Clean and responsive design
* Modern productivity-focused layout
* Category-based task organization
* Interactive calendar integration

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router
* Axios
* SCSS / CSS
* React Big Calendar
* date-fns

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JSON Web Tokens (JWT)
* bcrypt.js

---

## 📂 Project Structure

```text
Task-Manager/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/rozlyn20/Task-Manager.git
```

### Install dependencies

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Backend

```bash
cd backend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 📸 Screenshots

> Screenshots will be added after the UI is finalized.

---

## 🎯 Current Progress

* [x] React Frontend
* [x] Express Backend
* [x] MongoDB Atlas Integration
* [x] REST API
* [x] Create Tasks
* [x] Update Tasks
* [x] Delete Tasks
* [x] Task Completion
* [x] Today View
* [x] Tomorrow View
* [x] Calendar Integration
* [x] User Registration
* [x] User Login
* [ ] Protected Routes
* [ ] User Profile
* [ ] Notifications
* [ ] AI Productivity Features
* [ ] Deployment

---

## 💡 Future Enhancements

* Email reminders
* Push notifications
* AI-powered task suggestions
* Recurring tasks
* Drag-and-drop task management
* Team collaboration
* Dark mode
* Task analytics and productivity insights

---

## 📚 What I Learned

Building this project has helped me gain hands-on experience with:

* Building full-stack applications using the MERN stack
* Designing and consuming REST APIs
* MongoDB data modeling with Mongoose
* Authentication using JWT
* Password hashing with bcrypt
* Connecting React with Express APIs
* State management and asynchronous data fetching
* Calendar integration for task visualization
* Git and GitHub workflow

---

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome.

Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is open-source and available under the MIT License.
