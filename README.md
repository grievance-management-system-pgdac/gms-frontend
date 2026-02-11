# Grievance Management System - Frontend

Complete React + Vite frontend for the Grievance Management System backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Backend running on `http://localhost:8081`

### Installation

1. Navigate to the project directory:
```bash
cd gms-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 📁 Project Structure

```
gms-frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── EmployeeDashboard.jsx
│   │   ├── ApplyGrievance.jsx
│   │   ├── OfficerDashboard.jsx
│   │   ├── OfficerAnalytics.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   └── App.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 User Roles & Features

### EMPLOYEE
- View dashboard with grievance statistics
- File new grievances
- View all submitted grievances
- Filter grievances by status

### OFFICER
- View all grievances assigned to them
- Resolve grievances
- View employee analytics
- Filter grievances by status

### ADMIN
- View system-wide analytics
- Manage employees (view, delete)
- Manage officers (view, delete)
- View officer workload statistics
- View employees by department

## 🛠️ Technical Details

### Technologies
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Context API** - State management

### API Configuration
- Base URL: `http://localhost:8081`
- All requests use `withCredentials: true` for JWT cookie handling
- Automatic redirect to login on 401 responses

### Authentication Flow
1. User logs in via `/auth/login`
2. JWT stored in HttpOnly cookie by backend
3. User info stored in Context and localStorage
4. Role-based redirect:
   - EMPLOYEE → `/employee`
   - OFFICER → `/officer`
   - ADMIN → `/admin`
5. Protected routes verify user role before rendering

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 Styling
Custom CSS with responsive design, supporting:
- Desktop, tablet, and mobile layouts
- Role-specific color coding
- Status and severity badges
- Modal dialogs
- Data tables with hover effects

## 🔄 API Endpoints Used

### Authentication
- POST `/auth/login`
- POST `/auth/logout`
- POST `/auth/register/employee`
- POST `/auth/register/officer`
- POST `/auth/register/admin`

### Employee
- GET `/employee/grievances`
- GET `/employee/grievances?status=pending`
- POST `/employee/grievances`

### Officer
- GET `/officer/grievances`
- GET `/officer/grievances?status=pending`
- PUT `/officer/grievances/{grvnNum}/resolve`
- GET `/officer/analytics/employees`
- GET `/officer/analytics/employees/by-department`

### Admin
- GET `/admin/analytics/employees-by-department`
- GET `/admin/analytics/officers-list`
- GET `/admin/analytics/officer-workload`
- GET `/admin/analytics/employees`
- DELETE `/admin/delete_employees/{empnum}`
- DELETE `/admin/delete_officers/{officernum}`

## 🐛 Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend has the following configuration:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
    }
}
```

### Connection Refused
Ensure your backend is running on port 8081 before starting the frontend.

### Cookie Not Being Sent
Verify that:
1. Backend sets cookies with `HttpOnly`, `SameSite=Lax`
2. Axios uses `withCredentials: true` (already configured)
3. Both apps run on localhost (not mixing localhost and 127.0.0.1)

## 📝 Notes

- The app automatically saves user session in localStorage
- All forms include validation and error handling
- Responsive design works on all screen sizes
- Status badges: pending (yellow), in_progress (blue), resolved (green)
- Severity badges: low (green), medium (yellow), high (red), critical (dark red)

## 🤝 Contributing

This is a complete, production-ready frontend. To extend:
1. Add new pages in `src/pages/`
2. Add routes in `src/App.jsx`
3. Update API calls in components as needed
4. Style changes go in `src/styles/App.css`
