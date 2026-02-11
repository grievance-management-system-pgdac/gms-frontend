import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

// --- Helper Function ---
const normalizeStatus = (status) => {
  if (!status) return "";
  const s = status.toString().toLowerCase();
  if (s.includes("pending")) return "pending";
  if (s.includes("process")) return "in_progress";
  if (s.includes("resolve")) return "resolved";
  return "";
};

const AdminDashboard = () => {
  // ================= STATE MANAGEMENT =================

  // Data States
  const [analytics, setAnalytics] = useState({
    employeesByDept: [],
    workload: []
  });
  const [employees, setEmployees] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [allGrievances, setAllGrievances] = useState([]);
  
  // UI States
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);
  
  // Stats State
  const [grievanceStats, setGrievanceStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  // Modal/Selection States
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  // Delete States (Employee)
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Delete States (Officer)
  const [deleteOfficerTarget, setDeleteOfficerTarget] = useState(null);
  const [deleteOfficerSuccess, setDeleteOfficerSuccess] = useState(false);
  const [deleteOfficerError, setDeleteOfficerError] = useState(null);

  // ================= EFFECTS & FETCHING =================

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // --- ANALYTICS TAB ---
      if (activeTab === 'analytics') {
        const [empByDept, workload, grievancesRes] = await Promise.all([
          api.get('/admin/analytics/employees-by-department'),
          api.get('/admin/analytics/officer-workload'),
          api.get('/admin/grievances')
        ]);

        setAnalytics({
          employeesByDept: empByDept.data,
          workload: workload.data
        });

        const grievances = grievancesRes.data || [];
        setAllGrievances(grievances);

        // Calculate Stats
        const stats = { total: 0, pending: 0, inProgress: 0, resolved: 0 };
        grievances.forEach(g => {
          stats.total++;
          const st = normalizeStatus(g.status);
          if (st === 'pending') stats.pending++;
          if (st === 'in_progress') stats.inProgress++;
          if (st === 'resolved') stats.resolved++;
        });
        setGrievanceStats(stats);
      }

      // --- EMPLOYEES TAB ---
      if (activeTab === 'employees') {
        const res = await api.get('/admin/analytics/employees');
        setEmployees(res.data);
      }

      // --- OFFICERS TAB ---
      if (activeTab === 'officers') {
        const res = await api.get('/admin/analytics/officers-list');
        setOfficers(res.data);
      }

    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLERS =================

  // Employee Delete Handlers
  const handleDeleteEmployee = (emp) => {
    setDeleteTarget(emp);
    setDeleteError(null);
  };

  const confirmDeleteEmployee = async () => {
    if (!deleteTarget) return;
    try {
      // Fixed: Match the backend endpoint exactly - /admin/delete_employees/:empnum
      await api.delete(`/admin/delete_employees/${deleteTarget.empnum}`);
      setDeleteTarget(null);
      setDeleteSuccess(true);
      setDeleteError(null);
      
      // Refresh the employee list after a short delay
      setTimeout(() => {
        fetchData();
      }, 500);
      
    } catch (error) {
      console.error('Error deleting employee:', error);
      setDeleteError(
        error.response?.data?.message || 
        error.response?.data?.error ||
        'Failed to delete employee. Please try again.'
      );
    }
  };

  // Officer Delete Handlers
  const handleDeleteOfficer = (officer) => {
    setDeleteOfficerTarget(officer);
    setDeleteOfficerError(null);
  };

  const confirmDeleteOfficer = async () => {
    if (!deleteOfficerTarget) return;
    try {
      // Fixed: Match the backend endpoint exactly - /admin/delete_officers/:officernum
      await api.delete(`/admin/delete_officers/${deleteOfficerTarget.officernum}`);
      setDeleteOfficerTarget(null);
      setDeleteOfficerSuccess(true);
      setDeleteOfficerError(null);
      
      // Refresh the officer list after a short delay
      setTimeout(() => {
        fetchData();
      }, 500);
      
    } catch (err) {
      console.error('Error deleting officer:', err);
      setDeleteOfficerError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        'Failed to delete officer. Please try again.'
      );
    }
  };

  // ================= RENDER =================

  return (
    <div className="dashboard-container">
      <Navbar />

      {/* Internal CSS for Modals and Cards */}
      <style>{`
        .action-btn {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          border: none;
          margin-right: 8px;
          transition: all 0.2s ease;
        }
        .action-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-view { background-color: #5b6ef5; color: #fff; }
        .btn-delete { background-color: #e63946; color: #fff; }
        
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
        }
        .modal-box {
          background: #fff;
          width: 500px;
          max-width: 90%;
          padding: 24px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 16px;
          font-size: 14px;
        }
        .modal-grid span { font-weight: 600; }

        .error-message {
          background: #fee2e2;
          border: 2px solid #ef4444;
          color: #991b1b;
          padding: 12px;
          border-radius: 6px;
          margin: 15px 0;
          font-size: 14px;
        }

        .stat-card {
           background: #fff; padding: 20px; border-radius: 8px; 
           box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative;
        }
        .stat-border {
           position: absolute; top: 0; left: 0; right: 0; height: 4px;
           border-top-left-radius: 8px; border-top-right-radius: 8px;
        }
        .border-blue { background: #4a90e2; }
        .border-yellow { background: #f5a623; }
        .border-cyan { background: #50e3c2; }
        .border-green { background: #7ed321; }
      `}</style>

      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>

        <div className="tabs">
          <button onClick={() => setActiveTab('analytics')} className={activeTab === 'analytics' ? 'active' : ''}>Analytics</button>
          <button onClick={() => setActiveTab('employees')} className={activeTab === 'employees' ? 'active' : ''}>Manage Employees</button>
          <button onClick={() => setActiveTab('officers')} className={activeTab === 'officers' ? 'active' : ''}>Manage Officers</button>
        </div>

        {/* ================= TAB 1: ANALYTICS ================= */}
        {!loading && activeTab === 'analytics' && (
          <>
            <h2>Analytics Overview</h2>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '35px' }}>
              <div className="stat-card">
                <div className="stat-border border-blue"></div>
                <h4>Total Grievances</h4><h2>{grievanceStats.total}</h2>
              </div>
              <div className="stat-card">
                <div className="stat-border border-yellow"></div>
                <h4>Pending</h4><h2>{grievanceStats.pending}</h2>
              </div>
              <div className="stat-card">
                <div className="stat-border border-cyan"></div>
                <h4>In Progress</h4><h2>{grievanceStats.inProgress}</h2>
              </div>
              <div className="stat-card">
                <div className="stat-border border-green"></div>
                <h4>Resolved</h4><h2>{grievanceStats.resolved}</h2>
              </div>
            </div>

            {/* Employees By Dept Table */}
            <div style={{ marginBottom: '30px' }}>
              <h3>Employees by Department</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total Employees</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.employeesByDept.length === 0 ? (
                    <tr><td colSpan="2" style={{ textAlign: 'center' }}>No data available</td></tr>
                  ) : (
                    analytics.employeesByDept.map((dept, index) => (
                      <tr key={index}>
                        <td>{dept.department}</td>
                        {/* Robust check for different count property names */}
                        <td>{dept.count ?? dept.total ?? dept.totalEmployees ?? 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Officer Workload Table */}
            <div>
              <h3>Officer Workload</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Officer #</th>
                    <th>Name</th>
                    <th>Assigned Grievances</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.workload.map((o, i) => (
                    <tr key={i}>
                      <td>{o.officernum}</td>
                      <td>{o.officername}</td>
                      <td>{o.assignedCount ?? o.totalGrievances ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* All Grievances Table */}
            <h3 style={{ marginTop: '40px' }}>All Grievances</h3>
            {allGrievances.length === 0 ? (
              <p>No grievances available</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee</th>
                    <th>Category</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Severity</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allGrievances.map(g => (
                    <tr key={g.grvnNum}>
                      <td>{g.grvnNum}</td>
                      <td>{g.empNum}</td>
                      <td>{g.categoryName}</td>
                      <td>{g.subject}</td>
                      <td>{normalizeStatus(g.status).replace("_", " ")}</td>
                      <td>{g.severity}</td>
                      <td>{g.dateFiled ? new Date(g.dateFiled).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* ================= TAB 2: EMPLOYEES ================= */}
        {!loading && activeTab === 'employees' && (
          <>
            <h2>Employee Management</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.empnum}>
                    <td>{emp.empnum}</td>
                    <td>{emp.empname}</td>
                    <td>{emp.empEmail}</td>
                    <td>{emp.department}</td>
                    <td>
                      <button className="action-btn btn-view" onClick={() => setSelectedEmployee(emp)}>View</button>
                      <button className="action-btn btn-delete" onClick={() => handleDeleteEmployee(emp)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ================= TAB 3: OFFICERS ================= */}
        {!loading && activeTab === 'officers' && (
          <>
            <h2>Officer Management</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Officer ID</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {officers.map(officer => (
                  <tr key={officer.officernum}>
                    <td>{officer.officernum}</td>
                    <td>{officer.officername}</td>
                    <td>
                      <button className="action-btn btn-view" onClick={() => setSelectedOfficer(officer)}>View</button>
                      <button className="action-btn btn-delete" onClick={() => handleDeleteOfficer(officer)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. View Employee Modal */}
      {selectedEmployee && (
        <div className="modal-overlay" onClick={() => setSelectedEmployee(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Employee Details</h2>
            <div className="modal-grid">
              <p><span>Employee ID:</span> {selectedEmployee.empnum}</p>
              <p><span>Name:</span> {selectedEmployee.empname}</p>
              <p><span>Email:</span> {selectedEmployee.empEmail}</p>
              <p><span>Department:</span> {selectedEmployee.department}</p>
            </div>
            <br />
            <button className="action-btn btn-view" onClick={() => setSelectedEmployee(null)}>Close</button>
          </div>
        </div>
      )}

      {/* 2. View Officer Modal */}
      {selectedOfficer && (
        <div className="modal-overlay" onClick={() => setSelectedOfficer(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Officer Details</h2>
            <div className="modal-grid">
              <p><span>Officer ID:</span> {selectedOfficer.officernum}</p>
              <p><span>Name:</span> {selectedOfficer.officername}</p>
              <p><span>Email:</span> {selectedOfficer.officer_email || selectedOfficer.officerEmail || '—'}</p>
            </div>
            <br />
            <button className="action-btn btn-view" onClick={() => setSelectedOfficer(null)}>Close</button>
          </div>
        </div>
      )}

      {/* 3. Delete Employee Confirmation */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Employee?</h3>
            <p>Are you sure you want to delete <b>{deleteTarget.empname}</b> ({deleteTarget.empnum})?</p>
            
            {deleteError && (
              <div className="error-message">
                {deleteError}
              </div>
            )}
            
            <br />
            <button className="action-btn btn-delete" onClick={confirmDeleteEmployee}>Yes, Delete</button>
            <button className="action-btn btn-view" onClick={() => setDeleteTarget(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* 4. Delete Officer Confirmation */}
      {deleteOfficerTarget && (
        <div className="modal-overlay" onClick={() => setDeleteOfficerTarget(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Officer?</h3>
            <p>Are you sure you want to delete <b>{deleteOfficerTarget.officername}</b> ({deleteOfficerTarget.officernum})?</p>
            
            {deleteOfficerError && (
              <div className="error-message">
                {deleteOfficerError}
              </div>
            )}
            
            <br />
            <button className="action-btn btn-delete" onClick={confirmDeleteOfficer}>Yes, Delete</button>
            <button className="action-btn btn-view" onClick={() => setDeleteOfficerTarget(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* 5. Success Message (Employee) */}
      {deleteSuccess && (
        <div className="modal-overlay" onClick={() => setDeleteSuccess(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>✓ Employee deleted successfully</h3>
            <p>The employee has been removed from the system.</p>
            <br />
            <button className="action-btn btn-view" onClick={() => setDeleteSuccess(false)}>OK</button>
          </div>
        </div>
      )}

      {/* 6. Success Message (Officer) */}
      {deleteOfficerSuccess && (
        <div className="modal-overlay" onClick={() => setDeleteOfficerSuccess(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>✓ Officer deleted successfully</h3>
            <p>The officer has been removed from the system.</p>
            <br />
            <button className="action-btn btn-view" onClick={() => setDeleteOfficerSuccess(false)}>OK</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;