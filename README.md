# TaskForge - Team Task Manager

A full-stack MERN application for managing team projects, tasks, and collaboration with role-based access control.

## Tech Stack

- **MongoDB** - Database
- **Express.js** - Backend framework
- **React.js** - Frontend library
- **Node.js** - Runtime environment
- **Tailwind CSS** - Styling
- **JWT** - Authentication
- **Axios** - HTTP client
- **React Router DOM** - Client-side routing
- **Context API** - State management

## Features

### Authentication
- User Signup and Login
- JWT-based authentication with bcrypt password hashing
- Protected routes and secure token storage

### Roles
- **Admin** - Full access to create, edit, delete projects and tasks, manage team members
- **Member** - View assigned tasks, update task status, track progress

### Admin Features
- Create, edit, and delete projects
- Add and remove team members from projects
- Assign tasks to members
- View analytics dashboard
- Access activity logs

### Member Features
- View assigned tasks
- Update task status (Pending, In Progress, Completed)
- View deadlines and project progress

### Task Management
- Create and assign tasks
- Priority levels: Low, Medium, High
- Status tracking: Pending, In Progress, Completed
- Due dates with overdue highlighting
- Search and filter tasks

### Dashboard
- Total projects and tasks overview
- Completion rate with circular progress chart
- Priority breakdown bars
- Recent activity feed
- Overdue task count

### Additional Features
- Dark mode toggle
- Responsive design for mobile
- Search and filter on projects and tasks
- Pagination
- Profile page with edit functionality
- Activity logs tracking all user actions
- Toast notifications
- Loading states

## Project Structure

```
TaskForge/
  .gitignore                      # Files to ignore in git
  README.md
  backend/
    config/
      db.js                 # MongoDB connection
    controllers/
      authController.js     # Auth operations
      projectController.js  # Project CRUD
      taskController.js     # Task CRUD
      dashboardController.js # Analytics
    middleware/
      auth.js               # JWT and role middleware
      errorHandler.js       # Global error handler
    models/
      User.js               # User schema
      Project.js            # Project schema
      Task.js               # Task schema
      Activity.js           # Activity log schema
    routes/
      authRoutes.js         # Auth endpoints
      projectRoutes.js      # Project endpoints
      taskRoutes.js         # Task endpoints
      dashboardRoutes.js    # Dashboard endpoints
    utils/
      generateToken.js      # JWT token generator
    server.js               # Express app entry point
    .env                    # Environment variables (git ignored)
    .env.example            # Example environment variables
    package.json

  frontend/
    src/
      api/
        axios.js            # Configured Axios instance
      components/
        Header.jsx          # Top navigation bar
        Sidebar.jsx         # Side navigation
        Modal.jsx           # Reusable modal dialog
        TaskCard.jsx        # Task display card
        StatsCard.jsx       # Statistics card
        Pagination.jsx      # Pagination controls
        LoadingSpinner.jsx  # Loading indicator
        ProtectedRoute.jsx  # Auth route guard
      context/
        AuthContext.jsx     # Authentication state
        ThemeContext.jsx     # Dark mode state
      layouts/
        DashboardLayout.jsx # Main app layout
      pages/
        Login.jsx           # Login page
        Register.jsx        # Registration page
        Dashboard.jsx       # Analytics dashboard
        Projects.jsx        # Projects management
        Tasks.jsx           # Tasks management
        Team.jsx            # Team members view
        Activity.jsx        # Activity log
        Profile.jsx         # User profile
      App.jsx               # Root component with routes
      main.jsx              # React entry point
      index.css             # Global styles and Tailwind
    index.html
    vite.config.js
    package.json
```

## API Routes

### Auth Routes
| Method | Endpoint          | Description         | Access  |
|--------|-------------------|---------------------|---------|
| POST   | /api/auth/register | Register new user   | Public  |
| POST   | /api/auth/login    | Login user          | Public  |
| GET    | /api/auth/me       | Get current user    | Private |
| PUT    | /api/auth/profile  | Update profile      | Private |
| GET    | /api/auth/users    | Get all users       | Private |

### Project Routes
| Method | Endpoint                          | Description          | Access |
|--------|-----------------------------------|----------------------|--------|
| GET    | /api/projects                     | Get all projects     | Private |
| GET    | /api/projects/:id                 | Get single project   | Private |
| POST   | /api/projects                     | Create project       | Admin  |
| PUT    | /api/projects/:id                 | Update project       | Admin  |
| DELETE | /api/projects/:id                 | Delete project       | Admin  |
| PUT    | /api/projects/:id/members         | Add member           | Admin  |
| DELETE | /api/projects/:id/members/:userId | Remove member        | Admin  |

### Task Routes
| Method | Endpoint                      | Description           | Access  |
|--------|-------------------------------|-----------------------|---------|
| GET    | /api/tasks                    | Get all tasks         | Private |
| GET    | /api/tasks/:id                | Get single task       | Private |
| GET    | /api/tasks/project/:projectId | Get tasks by project  | Private |
| POST   | /api/tasks                    | Create task           | Admin   |
| PUT    | /api/tasks/:id                | Update task           | Private |
| DELETE | /api/tasks/:id                | Delete task           | Admin   |

### Dashboard Routes
| Method | Endpoint                  | Description         | Access  |
|--------|---------------------------|---------------------|---------|
| GET    | /api/dashboard/stats      | Get statistics       | Private |
| GET    | /api/dashboard/activities | Get activity log     | Private |

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas cloud)
- npm

### Step 1: Clone the repository
```bash
git clone <repository-url>
cd TaskForge
```

### Step 2: Setup Backend
```bash
cd backend
npm install
```

### Step 3: Configure environment variables
Open `backend/.env` and update the values:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

For MongoDB Atlas, your connection string will look like:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskforge
```

For local MongoDB:
```
MONGO_URI=mongodb://localhost:27017/taskforge
```

### Step 4: Setup Frontend
```bash
cd frontend
npm install
```

### Step 5: Run the application

Start the backend server (from the backend folder):
```bash
npm run dev
```

Start the frontend dev server (from the frontend folder):
```bash
npm run dev
```

The backend runs on http://localhost:5000
The frontend runs on http://localhost:5173

## MongoDB Schemas

### User Schema
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed)
- role (String: admin or member)
- avatar (String, optional)
- timestamps (createdAt, updatedAt)

### Project Schema
- name (String, required)
- description (String)
- owner (ObjectId reference to User)
- members (Array of ObjectId references to User)
- status (String: active, completed, archived)
- deadline (Date)
- timestamps

### Task Schema
- title (String, required)
- description (String)
- project (ObjectId reference to Project)
- assignedTo (ObjectId reference to User)
- createdBy (ObjectId reference to User)
- priority (String: low, medium, high)
- status (String: pending, in-progress, completed)
- dueDate (Date)
- completedAt (Date)
- timestamps

### Activity Schema
- user (ObjectId reference to User)
- action (String: created_project, updated_task, etc.)
- description (String)
- project (ObjectId reference to Project)
- task (ObjectId reference to Task)
- timestamps

## License

This project was created as a college assignment.
