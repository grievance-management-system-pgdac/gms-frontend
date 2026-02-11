import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const OfficerDashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();
  
  // Feature Flags
  const [featureFlags, setFeatureFlags] = useState({
    officer_table_view: true,
    grievance_self_assignment: true, 
  });

  // Assigned Grievances State
  const [assignedGrievances, setAssignedGrievances] = useState(() => {
    return JSON.parse(localStorage.getItem("assignedGrievances")) || [];
  });

  /* Color Mapping Helper */
  const getStatusStyles = (status) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case "PENDING":
        return { backgroundColor: "#FFD2D2", color: "#D8000C" }; // Light Red
      case "IN_PROCESS":
        return { backgroundColor: "#FFE5B4", color: "#E67E22" }; // Light Orange
      case "RESOLVED":
        return { backgroundColor: "#DFF2BF", color: "#27AE60" }; // Light Green
      default:
        return { backgroundColor: "#E0E0E0", color: "#333" };
    }
  };

  /* Normalize backend status safely */
  const normalizeStatus = (status) => {
    if (!status) return "";
    return String(status).trim().replace(/\s+/g, "_").toUpperCase();
  };

  /* Initial Fetch */
  useEffect(() => {
    fetchFeatureFlags();
    fetchGrievances();
  }, []);

  const fetchFeatureFlags = async () => {
    try {
      const stored = localStorage.getItem("featureFlags");
      if (stored) {
        setFeatureFlags(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Error fetching feature flags:", err);
    }
  };

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const res = await api.get("/officer/grievances");
      setGrievances(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching grievances:", err);
      setGrievances([]);
    } finally {
      setLoading(false);
    }
  };

  /* Logic to calculate counts for each status */
  const getCounts = () => {
    return {
      ALL: grievances.length,
      PENDING: grievances.filter(g => normalizeStatus(g.status) === "PENDING").length,
      IN_PROCESS: grievances.filter(g => normalizeStatus(g.status) === "IN_PROCESS").length,
      RESOLVED: grievances.filter(g => normalizeStatus(g.status) === "RESOLVED").length,
    };
  };

  const counts = getCounts();

  /* Frontend filtering logic */
  const filteredGrievances =
    statusFilter === "ALL"
      ? grievances
      : grievances.filter(
          (g) => normalizeStatus(g.status) === statusFilter
        );

  const handleView = (grvnNum) => {
    if (!featureFlags.officer_table_view) return;
    navigate(`/officer/grievances/${grvnNum}`);
  };

  const handleAssign = async (grievance) => {
    const { grvnNum, status } = grievance;
    const normalized = normalizeStatus(status);

    if (normalized !== "PENDING") {
      alert(`Grievance ${grvnNum} is already '${normalized.replace("_", " ")}' and cannot be re-assigned.`);
      return;
    }

    try {
      const officerNum = localStorage.getItem("officerNum") || "OFF001";
      const response = await api.post(`/officer/grievances/${grvnNum}/assign`, {
        officerNum: officerNum,
        remarks: "Assigned via Dashboard"
      });

      if (response.status === 200 || response.status === 201) {
        const stored = JSON.parse(localStorage.getItem("assignedGrievances")) || [];
        if (!stored.includes(grvnNum)) {
          const updated = [...stored, grvnNum];
          localStorage.setItem("assignedGrievances", JSON.stringify(updated));
          setAssignedGrievances(updated);
        }
        alert(`Grievance ${grvnNum} successfully assigned.`);
        fetchGrievances(); 
      }
    } catch (error) {
      const errorMsg = error.response?.data?.details || "Failed to assign. Ensure it is PENDING.";
      alert(errorMsg);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content" style={{ padding: "20px" }}>
        <div className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ margin: 0 }}>Officer Dashboard</h1>
            <p style={{ color: "#666" }}>Manage and investigate filed grievances</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={fetchGrievances} className="btn-small btn-secondary">Refresh List</button>
            <Link to="/officer/analytics" className="btn-primary" style={{ textDecoration: "none", padding: "8px 16px", borderRadius: "4px" }}>
              View Analytics
            </Link>
          </div>
        </div>

        {/* STATUS FILTERS WITH DYNAMIC COUNTS & COLORS */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "25px", background: "#f8f9fa", padding: "10px", borderRadius: "8px" }}>
          {["ALL", "PENDING", "IN_PROCESS", "RESOLVED"].map((s) => {
            const statusStyle = getStatusStyles(s);
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`btn-small ${statusFilter === s ? "btn-primary" : "btn-secondary"}`}
                style={{ 
                  padding: "8px 20px", 
                  borderRadius: "20px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px",
                  fontWeight: statusFilter === s ? "bold" : "normal"
                }}
              >
                {s.replace("_", " ")}
                <span style={{ 
                  backgroundColor: statusFilter === s ? "white" : statusStyle.backgroundColor,
                  color: statusFilter === s ? "#333" : statusStyle.color,
                  padding: "2px 8px", 
                  borderRadius: "10px", 
                  fontSize: "0.85em",
                  minWidth: "20px",
                  textAlign: "center"
                }}>
                  {counts[s]}
                </span>
              </button>
            );
          })}
        </div>

        {/* DATA TABLE */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
             <p>Loading grievances...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f4f4f4" }}>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd", textAlign: "left" }}>Grievance #</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd", textAlign: "left" }}>Emp ID</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd", textAlign: "left" }}>Category</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd", textAlign: "left" }}>Subject</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #ddd", textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrievances.map((g) => {
                  const isAssigned = assignedGrievances.includes(g.grvnNum);
                  const isPending = normalizeStatus(g.status) === "PENDING";
                  const statusColors = getStatusStyles(g.status);

                  return (
                    <tr key={g.grvnNum} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px", fontWeight: "bold" }}>{g.grvnNum}</td>
                      <td style={{ padding: "12px" }}>{g.empNum}</td>
                      <td style={{ padding: "12px" }}>{g.categoryName}</td>
                      <td style={{ padding: "12px" }}>{g.subject}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ 
                          backgroundColor: statusColors.backgroundColor,
                          color: statusColors.color,
                          padding: "6px 12px", 
                          borderRadius: "15px", 
                          fontSize: "0.85em",
                          fontWeight: "bold",
                          display: "inline-block"
                        }}>
                          {normalizeStatus(g.status).replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ padding: "12px", display: "flex", gap: "8px" }}>
                        <button className="btn-small btn-secondary" onClick={() => handleView(g.grvnNum)}>
                          View
                        </button>
                        
                        <button
                          className="btn-small btn-warning"
                          disabled={isAssigned || !isPending}
                          onClick={() => handleAssign(g)}
                          style={{
                            opacity: (isAssigned || !isPending) ? 0.6 : 1,
                            cursor: (isAssigned || !isPending) ? "not-allowed" : "pointer"
                          }}
                        >
                          {isAssigned ? "Assigned" : !isPending ? "Locked" : "Assign"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerDashboard;