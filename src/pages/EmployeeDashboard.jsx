import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

const EmployeeDashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);


  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return { 
          bg: "#fff5f5", 
          text: "#c53030", 
          border: "#feb2b2",
          label: "Pending"
        };
      case "IN_PROCESS":
      case "INTENDED_RESOLVE":
        return { 
          bg: "#fffaf0", 
          text: "#975a16", 
          border: "#fbd38d",
          label: "In Progress"
        };
      case "RESOLVED":
        return { 
          bg: "#f0fff4", 
          text: "#22543d", 
          border: "#9ae6b4",
          label: "Resolved"
        };
      default:
        return { bg: "#edf2f7", text: "#2d3748", border: "#cbd5e0", label: status };
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, [filter]);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      let url = '/employee/grievances';
      if (filter !== 'all') url += `?status=${filter}`;

      const response = await api.get(url);
      const data = response.data || [];

      setGrievances(data);
      setStats({
        total: data.length,
        pending: data.filter(g => g.status === 'PENDING').length,
        inProgress: data.filter(g => g.status === 'IN_PROCESS' || g.status === 'INTENDED_RESOLVE').length,
        resolved: data.filter(g => g.status === 'RESOLVED').length
      });
    } catch (error) {
      console.error('Error fetching grievances:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container" style={{ backgroundColor: "#f4f7fa", minHeight: "100vh" }}>
      <Navbar />

      <style>{`
        .status-pill {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
          border: 1px solid;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .data-table thead th {
          background-color: #ffffff;
          color: #4a5568;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.05em;
          padding: 15px;
          border-bottom: 2px solid #e2e8f0;
        }
        .data-table tbody tr {
          background-color: #ffffff;
          transition: background-color 0.2s;
        }
        .data-table tbody tr:hover {
          background-color: #f8fafc;
        }
        .btn-view {
          background: #4A90E2;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-view:hover {
          background: #357ABD;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
      `}</style>

      <div className="dashboard-content" style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>
        <div className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#2d3748", fontSize: "28px", fontWeight: "700" }}>Employee Dashboard</h1>
          <Link to="/employee/apply" style={{ textDecoration: 'none' }}>
            <button className="btn-view" style={{ padding: "12px 24px", fontSize: "14px" }}>
              + File New Grievance
            </button>
          </Link>
        </div>

        {/* STATS GRID */}
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          {[
            { label: "Total", val: stats.total, color: "#4A90E2" },
            { label: "Pending", val: stats.pending, color: "#e53e3e" },
            { label: "In Progress", val: stats.inProgress, color: "#dd6b20" },
            { label: "Resolved", val: stats.resolved, color: "#38a169" }
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", padding: "20px", borderRadius: "12px", borderLeft: `6px solid ${s.color}`, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
              <h3 style={{ margin: 0, fontSize: "13px", color: "#718096", textTransform: "uppercase" }}>{s.label}</h3>
              <p style={{ margin: "10px 0 0", fontSize: "28px", fontWeight: "800", color: "#2d3748" }}>{s.val}</p>
            </div>
          ))}
        </div>

        <div className="filter-section" style={{ background: "#fff", padding: "15px 20px", borderRadius: "10px", marginBottom: "20px", display: "flex", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>
          <label style={{ marginRight: "15px", fontWeight: "600", color: "#4a5568" }}>Status Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", outline: "none" }}>
            <option value="all">All Grievances</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROCESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        <div className="grievances-list" style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Grievance #</th>
                <th>Category</th>
                <th>Subject</th>
                <th style={{ textAlign: "center" }}>Status</th>
                <th>Severity</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {grievances.map((g) => {
                const style = getStatusStyle(g.status);
                return (
                  <tr key={g.grvnNum} style={{ borderBottom: "1px solid #edf2f7" }}>
                    <td style={{ padding: "18px 15px", fontWeight: "600", color: "#4a5568" }}>{g.grvnNum}</td>
                    <td style={{ padding: "15px" }}>{g.categoryName || g.category || '—'}</td>
                    <td style={{ padding: "15px", color: "#2d3748" }}>{g.subject}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <span className="status-pill" style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}>
                        {style.label}
                      </span>
                    </td>
                    <td style={{ padding: "15px" }}>
                      <span style={{ color: g.severity === 'HIGH' ? '#e53e3e' : '#718096', fontWeight: "500" }}>{g.severity}</span>
                    </td>
                    <td style={{ padding: "15px", color: "#718096" }}>
                      {g.dateFiled ? new Date(g.dateFiled).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: "15px" }}>
                      <button className="btn-view" onClick={() => navigate(`/employee/grievance/${g.grvnNum}`)}>
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;