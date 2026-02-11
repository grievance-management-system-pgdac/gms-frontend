# 🚀 GRIEVANCE MANAGEMENT SYSTEM - COMPLETE SETUP GUIDE

## 📦 What You're Getting

A **fully integrated, production-ready** React + Vite frontend that connects seamlessly with your Spring Boot backend. This is **copy-paste runnable** - no additional coding required!

## ✅ Requirements Met

- ✅ React 18 + Vite
- ✅ React Router v6
- ✅ Axios with `withCredentials: true`
- ✅ Context API (NO Redux/Zustand/MobX)
- ✅ Backend base URL: http://localhost:8081
- ✅ JWT via HttpOnly cookie
- ✅ Role-based routing with ProtectedRoute
- ✅ Auto-redirect after login
- ✅ All required features implemented

## 📂 Project Structure

```
gms-frontend/
├── src/
│   ├── components/           # Reusable components
│   │   ├── Navbar.jsx       # Navigation bar with logout
│   │   └── ProtectedRoute.jsx  # Role-based route protection
│   ├── contexts/
│   │   └── AuthContext.jsx  # Central auth state management
│   ├── pages/               # All page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── EmployeeDashboard.jsx
│   │   ├── ApplyGrievance.jsx
│   │   ├── OfficerDashboard.jsx
│   │   ├── OfficerAnalytics.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/
│   │   └── api.js           # Axios configuration
│   ├── styles/
│   │   └── App.css          # All styling
│   ├── App.jsx              # Main app with routing
│   └── main.jsx             # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Step-by-Step Setup

### Step 1: Extract the Frontend

```bash
# Navigate to your desired location
cd /path/to/your/projects

# Copy the gms-frontend folder here
# The folder is ready to run!
```

### Step 2: Install Dependencies

```bash
cd gms-frontend
npm install
```

This will install:
- React 18.2.0
- React Router DOM 6.20.0
- Axios 1.6.2
- Vite 5.0.8

### Step 3: Ensure Backend is Running

Make sure your Spring Boot backend is running on:
```
http://localhost:8081
```

**Important Backend Configuration:**

Your backend MUST have CORS configured to allow the frontend. Add this to your Spring Boot project:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")  // Frontend URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

Also ensure your JWT cookies are set correctly:

```java
Cookie cookie = new Cookie("jwt", token);
cookie.setHttpOnly(true);
cookie.setSecure(false);  // Set to true in production with HTTPS
cookie.setPath("/");
cookie.setMaxAge(3600);   // 1 hour
cookie.setSameSite("Lax");
response.addCookie(cookie);
```

### Step 4: Start the Frontend

```bash
npm run dev
```

The app will start at:
```
http://localhost:5173
```

### Step 5: Test the Application

1. **Register a new user:**
   - Go to http://localhost:5173
   - Click "Register here"
   - Fill in details and select a role
   - Click Register

2. **Login:**
   - Enter credentials
   - You'll be automatically redirected based on your role:
     - EMPLOYEE → `/employee`
     - OFFICER → `/officer`
     - ADMIN → `/admin`

## 🎭 Features by Role

### 👤 EMPLOYEE Features
**Dashboard:** `/employee`
- View grievance statistics (total, pending, in progress, resolved)
- Filter grievances by status
- Quick access to file new grievance

**File Grievance:** `/employee/apply`
- Select category (work environment, harassment, discrimination, etc.)
- Set severity (low, medium, high, critical)
- Enter subject and detailed description
- Submit to backend via POST `/employee/grievances`

**My Grievances:**
- View all submitted grievances
- See status (pending, in_progress, resolved)
- Filter by status
- Track submission dates

### 🧑‍⚖️ OFFICER Features
**Dashboard:** `/officer`
- View all grievances
- Filter by status
- Resolve grievances with resolution text
- Modal dialog for entering resolution details

**Analytics:** `/officer/analytics`
- View all employees list
- See employees grouped by department
- Toggle between list and department views

### 🛡️ ADMIN Features
**Dashboard:** `/admin`
Three main tabs:

1. **Analytics Tab:**
   - Employees by department (card view)
   - Officer workload table
   - System-wide statistics

2. **Manage Employees Tab:**
   - View all employees
   - Delete employees (with confirmation)

3. **Manage Officers Tab:**
   - View all officers
   - Delete officers (with confirmation)

## 🔒 Security Features

1. **JWT Authentication:**
   - HttpOnly cookies prevent XSS attacks
   - Automatic token handling
   - No manual token storage in localStorage

2. **Protected Routes:**
   - All routes require authentication
   - Role-based access control
   - Automatic redirect to login if unauthorized

3. **API Security:**
   - All requests use `withCredentials: true`
   - 401 responses trigger automatic logout
   - CSRF protection via SameSite cookies

## 🎨 UI/UX Features

- **Responsive Design:** Works on desktop, tablet, and mobile
- **Color-Coded Status:**
  - Pending: Yellow
  - In Progress: Blue
  - Resolved: Green
- **Severity Indicators:**
  - Low: Green
  - Medium: Yellow
  - High: Red
  - Critical: Dark Red
- **Loading States:** All async operations show loading indicators
- **Error Handling:** User-friendly error messages
- **Confirmation Dialogs:** For destructive actions (delete)

## 🐛 Troubleshooting

### Problem: CORS Error
**Solution:** Add CORS configuration to your Spring Boot backend (see Step 3)

### Problem: 401 Unauthorized
**Solution:** Ensure:
1. Backend is running on port 8081
2. JWT cookie is being set correctly
3. Cookie attributes: HttpOnly, SameSite=Lax

### Problem: Cannot connect to backend
**Solution:**
1. Check backend is running: `http://localhost:8081`
2. Test backend directly in browser/Postman
3. Check firewall/antivirus settings

### Problem: Login works but redirects to login again
**Solution:**
1. Check browser console for errors
2. Verify JWT cookie is being set (check browser DevTools → Application → Cookies)
3. Ensure `withCredentials: true` in axios (already configured)

### Problem: Grievances not loading
**Solution:**
1. Check network tab in browser DevTools
2. Verify backend endpoints are working
3. Check console for API errors

## 📝 API Endpoints Reference

### Authentication
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/register/employee` - Register employee
- `POST /auth/register/officer` - Register officer
- `POST /auth/register/admin` - Register admin

### Employee
- `GET /employee/grievances` - Get all employee grievances
- `GET /employee/grievances?status=pending` - Filter by status
- `POST /employee/grievances` - File new grievance

### Officer
- `GET /officer/grievances` - Get all grievances
- `GET /officer/grievances?status=pending` - Filter by status
- `PUT /officer/grievances/{grvnNum}/resolve` - Resolve grievance
- `GET /officer/analytics/employees` - Get employees list
- `GET /officer/analytics/employees/by-department` - Get by department

### Admin
- `GET /admin/analytics/employees-by-department` - Department analytics
- `GET /admin/analytics/officers-list` - Officers list
- `GET /admin/analytics/officer-workload` - Officer workload
- `GET /admin/analytics/employees` - All employees
- `DELETE /admin/delete_employees/{empnum}` - Delete employee
- `DELETE /admin/delete_officers/{officernum}` - Delete officer

## 🚀 Production Deployment

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Environment Variables

For production, update the API base URL in `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:8081',
  withCredentials: true
});
```

Create `.env.production`:
```
VITE_API_URL=https://your-production-backend.com
```

### Deployment Options

1. **Vercel/Netlify:** Upload the `dist` folder
2. **Docker:** Create Dockerfile with Nginx
3. **AWS S3:** Upload static files
4. **Traditional Server:** Use Nginx/Apache to serve `dist`

## 💡 Customization Tips

### Adding New Features

1. **New Page:**
   - Create component in `src/pages/NewPage.jsx`
   - Add route in `src/App.jsx`
   - Add navigation link where needed

2. **New API Endpoint:**
   - Import api from `src/services/api.js`
   - Use `api.get()`, `api.post()`, etc.
   - Handle response/errors

3. **Styling Changes:**
   - Edit `src/styles/App.css`
   - All styles are in one file for easy management

### Backend Response Format

The frontend expects these response formats:

**Login Response:**
```json
{
  "userNum": "EMP001",
  "role": "EMPLOYEE",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Grievance Response:**
```json
{
  "grvnNum": "GRV001",
  "empNum": "EMP001",
  "category": "work_environment",
  "subject": "Issue subject",
  "description": "Detailed description",
  "status": "pending",
  "severity": "medium",
  "submittedDate": "2024-01-15T10:30:00"
}
```

## 📞 Support

If you encounter any issues:

1. Check browser console for errors (F12)
2. Check network tab for failed API calls
3. Verify backend is running and endpoints work
4. Review CORS configuration
5. Check JWT cookie is being set

## ✨ Success Criteria

You'll know everything is working when:

✅ You can register a new user
✅ Login redirects to the correct dashboard
✅ Navbar shows user info
✅ Data loads without errors
✅ All CRUD operations work
✅ Logout redirects to login
✅ Protected routes block unauthorized access
✅ No console errors

## 🎉 You're All Set!

Your Grievance Management System frontend is ready to use. Just follow the setup steps, and you'll have a fully functional application connected to your backend.

**Key Points:**
- Everything is pre-configured
- No additional code needed
- Just install dependencies and run
- Full integration with your backend
- Production-ready code structure

Happy coding! 🚀
