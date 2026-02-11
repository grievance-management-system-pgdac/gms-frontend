import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Employee pages
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ApplyGrievance from "./pages/ApplyGrievance";
import EmployeeHelp from "./pages/EmployeeHelp";
import EmployeeProfile from "./pages/EmployeeProfile";
import GrievanceDetails from './pages/GrievanceDetails';
// import EmployeeLegalReferences from "./pages/EmployeeLegalReferences";
import EmployeeLegalReferences from "./pages/EmployeeLEgalReferences";

// Officer pages
import OfficerDashboard from "./pages/OfficerDashboard-simplified";
import OfficerAnalytics from "./pages/OfficerAnalytics";
import OfficerGrievanceView from './pages/OfficerGrievanceView';
import OfficerLegalReferences from "./pages/OfficerLegalReferences";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import OfficerProfile from "./pages/OfficerProfilePage";

// Styles
import "./styles/App.css";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ================= EMPLOYEE ROUTES ================= */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/apply"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <ApplyGrievance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/grievance/:grvnNum"
            element={<GrievanceDetails />}
          />
          <Route
            path="/employee/help"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <EmployeeHelp />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />

          {/* ✅ ADDED: Employee Legal Reference */}
          {/* <Route
            path="/employee/legal-reference"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <LegalReferencePage />
              </ProtectedRoute>
            }
          />  */}

             <Route
                path="/employee/legal-references"
                element={
                <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <EmployeeLegalReferences />
                </ProtectedRoute>
             }
             />
          {/* ================= OFFICER ROUTES ================= */}
          <Route
            path="/officer"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/officer/analytics"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerAnalytics />
              </ProtectedRoute>
            }
          />
          

          <Route
            path="/officer/profile"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/legal-references"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerLegalReferences />
              </ProtectedRoute>
            }
          />

          <Route path="/officer/grievances/:grvnNum" element={<OfficerGrievanceView />} />
        {/* <Route path="/officer/investigate/:grvnNum" element={<InvestigatePage />} /> */}
          {/* ================= ADMIN ROUTES ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= DEFAULT ROUTES ================= */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;