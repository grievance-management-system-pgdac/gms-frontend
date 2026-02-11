import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setError("");
      const response = await api.get("/current-user");

      // Map backend DTO → frontend-friendly object
      const mappedProfile = {
        empnum: response.data.userNum,
        empname: response.data.name,
        email: response.data.email,
        department: response.data.department,
        contact: response.data.contactNum,
        role: response.data.actorRole,
        designation: response.data.employeeRole,
      };

      setProfile(mappedProfile);
    } catch (err) {
      console.error(err);
      setError("Unable to load profile details from the server.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h3>⌛ Loading your profile...</h3>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <style>{`
        .employee-profile-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        
        .employee-profile-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .employee-profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 3rem 2rem;
          text-align: center;
          color: white;
        }
        
        .employee-profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: white;
          color: #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: bold;
          margin: 0 auto 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .employee-profile-name {
          margin: 0 0 0.5rem;
          font-size: 1.8rem;
          font-weight: 600;
        }
        
        .employee-profile-role-badge {
          display: inline-block;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.2);
        }
        
        .employee-profile-details {
          padding: 2rem;
        }
        
        .employee-profile-section {
          margin-bottom: 2rem;
        }
        
        .employee-profile-section:last-child {
          margin-bottom: 0;
        }
        
        .employee-profile-section-title {
          font-size: 1.2rem;
          color: #333;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f0f0f0;
          font-weight: 600;
        }
        
        .employee-profile-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .employee-profile-info-item {
          display: flex;
          flex-direction: column;
        }
        
        .employee-profile-label {
          font-size: 0.75rem;
          color: #666;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          letter-spacing: 0.5px;
        }
        
        .employee-profile-value {
          font-size: 1rem;
          color: #333;
          margin: 0;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 6px;
          border-left: 3px solid #667eea;
        }
        
        .employee-profile-error {
          background: #ffebee;
          color: #d32f2f;
          padding: 12px;
          margin-bottom: 20px;
          border-radius: 6px;
          text-align: center;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .employee-profile-container {
            margin: 1rem auto;
          }
          
          .employee-profile-header {
            padding: 2rem 1rem;
          }
          
          .employee-profile-avatar {
            width: 80px;
            height: 80px;
            font-size: 2rem;
          }
          
          .employee-profile-name {
            font-size: 1.5rem;
          }
          
          .employee-profile-details {
            padding: 1.5rem;
          }
          
          .employee-profile-info-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>

      <div className="employee-profile-container">
        {error && <div className="employee-profile-error">{error}</div>}

        <div className="employee-profile-card">
          {/* Header with Avatar */}
          <div className="employee-profile-header">
            <div className="employee-profile-avatar">
              {profile?.empname?.charAt(0).toUpperCase() || "E"}
            </div>
            <h2 className="employee-profile-name">{profile?.empname || "Employee"}</h2>
            <span className="employee-profile-role-badge">
              {profile?.role?.replace("ROLE_", "") || "EMPLOYEE"}
            </span>
          </div>

          {/* Profile Details */}
          <div className="employee-profile-details">
            <div className="employee-profile-section">
              <h3 className="employee-profile-section-title">Personal Information</h3>
              <div className="employee-profile-info-grid">
                <div className="employee-profile-info-item">
                  <label className="employee-profile-label">Employee Number</label>
                  <p className="employee-profile-value">{profile?.empnum || "N/A"}</p>
                </div>
                <div className="employee-profile-info-item">
                  <label className="employee-profile-label">Full Name</label>
                  <p className="employee-profile-value">{profile?.empname || "N/A"}</p>
                </div>
                <div className="employee-profile-info-item">
                  <label className="employee-profile-label">Email</label>
                  <p className="employee-profile-value">{profile?.email || "N/A"}</p>
                </div>
                <div className="employee-profile-info-item">
                  <label className="employee-profile-label">Contact Number</label>
                  <p className="employee-profile-value">{profile?.contact || "N/A"}</p>
                </div>
                <div className="employee-profile-info-item">
                  <label className="employee-profile-label">Department</label>
                  <p className="employee-profile-value">{profile?.department || "N/A"}</p>
                </div>
                <div className="employee-profile-info-item">
                  <label className="employee-profile-label">Designation</label>
                  <p className="employee-profile-value">{profile?.designation || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeProfile;