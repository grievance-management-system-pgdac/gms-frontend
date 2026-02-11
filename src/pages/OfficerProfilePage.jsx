import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import api from "../services/api";

const OfficerProfilePage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/current-user");
        console.log("Profile Data from Backend:", response.data); // Debug log
        setProfileData(response.data);
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Helper function to get value from multiple possible field names
  const getValue = (obj, possibleKeys) => {
    if (!obj) return "N/A";
    for (let key of possibleKeys) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
        return obj[key];
      }
    }
    return "N/A";
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.loading}>Loading profile...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.error}>{error}</div>
        </div>
      </>
    );
  }

  // Extract values with multiple possible field names
  const officerId = getValue(profileData, ["userNum", "officerNum", "userId", "officerId", "id"]);
  const fullName = getValue(profileData, ["name", "fullName", "firstName", "empname"]);
  const email = getValue(profileData, ["email", "emailAddress", "mail"]);
  const role = profileData?.actorRole?.replace("ROLE_", "") || "OFFICER";
  
  const contactNumber = getValue(profileData, [
    "contactNumber", "phone", "phoneNumber", "mobile", "contact", "mobileNumber"
  ]);
  
  const specialty = getValue(profileData, [
    "specialty", "officerSpecialty", "category", "department", "dept", "specialization"
  ]);
  
  const address = getValue(profileData, [
    "residentialAddress", "address", "fullAddress", "homeAddress", "location"
  ]);

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.avatar}>
              {fullName?.charAt(0).toUpperCase() || "O"}
            </div>
            <h2 style={styles.headerTitle}>{fullName}</h2>
            <span style={styles.roleBadge}>{role}</span>
          </div>

          <div style={styles.details}>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Personal Information</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <label style={styles.label}>Officer ID</label>
                  <p style={styles.value}>{officerId}</p>
                </div>
                <div style={styles.infoItem}>
                  <label style={styles.label}>Full Name</label>
                  <p style={styles.value}>{fullName}</p>
                </div>
                <div style={styles.infoItem}>
                  <label style={styles.label}>Email</label>
                  <p style={styles.value}>{email}</p>
                </div>
                <div style={styles.infoItem}>
                  <label style={styles.label}>Role</label>
                  <p style={styles.value}>{role}</p>
                </div>
                <div style={styles.infoItem}>
                  <label style={styles.label}>Specialty</label>
                  <p style={styles.value}>{specialty}</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "2rem auto",
    padding: "0 1rem",
  },
  card: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "3rem 2rem",
    textAlign: "center",
    color: "white",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "white",
    color: "#667eea",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5rem",
    fontWeight: "bold",
    margin: "0 auto 1rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  headerTitle: {
    margin: "0 0 0.5rem",
    fontSize: "1.8rem",
  },
  roleBadge: {
    display: "inline-block",
    padding: "0.4rem 1rem",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
    textTransform: "uppercase",
    background: "rgba(255, 255, 255, 0.2)",
  },
  details: {
    padding: "2rem",
  },
  section: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    color: "#333",
    marginBottom: "1rem",
    paddingBottom: "0.5rem",
    borderBottom: "2px solid #f0f0f0",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "0.85rem",
    color: "#666",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: "0.5rem",
    letterSpacing: "0.5px",
  },
  value: {
    fontSize: "1rem",
    color: "#333",
    margin: "0",
    padding: "0.75rem",
    background: "#f8f9fa",
    borderRadius: "6px",
    borderLeft: "3px solid #667eea",
    wordBreak: "break-word",
  },
  loading: {
    textAlign: "center",
    padding: "3rem",
    fontSize: "1.2rem",
    color: "#667eea",
  },
  error: {
    textAlign: "center",
    padding: "3rem",
    fontSize: "1.2rem",
    color: "#dc3545",
    background: "#f8d7da",
    borderRadius: "8px",
    margin: "2rem",
  },
  debugSection: {
    marginTop: "2rem",
    padding: "1rem",
    background: "#f8f9fa",
    borderRadius: "8px",
    border: "1px solid #dee2e6",
  },
  debugSummary: {
    cursor: "pointer",
    fontWeight: "600",
    color: "#667eea",
    marginBottom: "0.5rem",
  },
  debugPre: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "4px",
    overflow: "auto",
    fontSize: "0.85rem",
    border: "1px solid #dee2e6",
  },
};

export default OfficerProfilePage;