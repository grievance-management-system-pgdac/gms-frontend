import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OfficerAnalytics = () => {
  const navigate = useNavigate();
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Detailed grievance list (you would fetch this from your backend/API)
  const grievancesList = [
    {
      grievanceNo: "G001",
      employeeName: "Alice Johnson",
      employeeId: "E123",
      category: "Workplace Harassment",
      subject: "Inappropriate behavior from supervisor",
      status: "Pending",
      severity: "High",
      date: "2026-01-25",
      description: "Employee reported repeated inappropriate comments and gestures from direct supervisor during team meetings. The behavior has been ongoing for the past two weeks and is creating a hostile work environment.",
      department: "Marketing",
      contactEmail: "alice.j@company.com",
      contactPhone: "+91-9876543210"
    },
    {
      grievanceNo: "G002",
      employeeName: "Bob Smith",
      employeeId: "E124",
      category: "Compensation Issue",
      subject: "Overtime payment not received",
      status: "Pending",
      severity: "Medium",
      date: "2026-01-24",
      description: "Employee worked 20 hours of overtime in December 2025 but did not receive overtime compensation in the January payroll. Requesting immediate review and payment of pending overtime.",
      department: "Operations",
      contactEmail: "bob.s@company.com",
      contactPhone: "+91-9876543211"
    },
    {
      grievanceNo: "G003",
      employeeName: "Carol White",
      employeeId: "E125",
      category: "Work Conditions",
      subject: "Unsafe working conditions in warehouse",
      status: "Pending",
      severity: "High",
      date: "2026-01-23",
      description: "Multiple safety hazards identified in Warehouse B including damaged flooring, inadequate lighting, and malfunctioning fire safety equipment. Immediate attention required to prevent accidents.",
      department: "Warehouse",
      contactEmail: "carol.w@company.com",
      contactPhone: "+91-9876543212"
    },
    {
      grievanceNo: "G004",
      employeeName: "David Brown",
      employeeId: "E126",
      category: "Discrimination",
      subject: "Denied promotion based on age",
      status: "Pending",
      severity: "High",
      date: "2026-01-22",
      description: "Employee believes they were passed over for promotion in favor of a younger, less experienced candidate. Multiple instances of age-related comments documented.",
      department: "Sales",
      contactEmail: "david.b@company.com",
      contactPhone: "+91-9876543213"
    },
    {
      grievanceNo: "G005",
      employeeName: "Emma Davis",
      employeeId: "E127",
      category: "Leave Policy",
      subject: "Medical leave request denied",
      status: "Pending",
      severity: "Medium",
      date: "2026-01-21",
      description: "Request for medical leave was denied despite providing proper medical documentation. Employee needs surgery and recovery time.",
      department: "Finance",
      contactEmail: "emma.d@company.com",
      contactPhone: "+91-9876543214"
    },
    {
      grievanceNo: "G006",
      employeeName: "Frank Miller",
      employeeId: "E128",
      category: "Workplace Harassment",
      subject: "Bullying by team members",
      status: "Pending",
      severity: "High",
      date: "2026-01-20",
      description: "Employee experiencing systematic bullying and exclusion from team activities. This includes being left out of important meetings and work-related communications.",
      department: "IT",
      contactEmail: "frank.m@company.com",
      contactPhone: "+91-9876543215"
    },
    {
      grievanceNo: "G007",
      employeeName: "Grace Lee",
      employeeId: "E129",
      category: "Work Hours",
      subject: "Forced to work beyond contracted hours",
      status: "Pending",
      severity: "Medium",
      date: "2026-01-19",
      description: "Regularly required to work 12+ hour days without proper compensation or consideration for work-life balance. This violates the employment contract terms.",
      department: "Customer Service",
      contactEmail: "grace.l@company.com",
      contactPhone: "+91-9876543216"
    },
    {
      grievanceNo: "G008",
      employeeName: "Henry Wilson",
      employeeId: "E130",
      category: "Benefits",
      subject: "Health insurance benefits not activated",
      status: "Pending",
      severity: "Medium",
      date: "2026-01-18",
      description: "Joined company 3 months ago but health insurance benefits have not been activated despite multiple follow-ups with HR department.",
      department: "Engineering",
      contactEmail: "henry.w@company.com",
      contactPhone: "+91-9876543217"
    },
    {
      grievanceNo: "G009",
      employeeName: "Iris Taylor",
      employeeId: "E131",
      category: "Retaliation",
      subject: "Retaliation after filing previous complaint",
      status: "Pending",
      severity: "High",
      date: "2026-01-17",
      description: "After filing a complaint about discriminatory practices, employee has been given undesirable assignments and excluded from important projects.",
      department: "HR",
      contactEmail: "iris.t@company.com",
      contactPhone: "+91-9876543218"
    },
    {
      grievanceNo: "G010",
      employeeName: "Jack Anderson",
      employeeId: "E132",
      category: "Work Environment",
      subject: "Inadequate equipment and tools",
      status: "Pending",
      severity: "Low",
      date: "2026-01-16",
      description: "Outdated computer equipment causing significant delays in work completion. Multiple requests for equipment upgrade have been ignored.",
      department: "Design",
      contactEmail: "jack.a@company.com",
      contactPhone: "+91-9876543219"
    },
    {
      grievanceNo: "G011",
      employeeName: "Karen Martinez",
      employeeId: "E133",
      category: "Policy Violation",
      subject: "Manager not following company leave policy",
      status: "Pending",
      severity: "Medium",
      date: "2026-01-15",
      description: "Manager is denying approved leave requests at the last minute, violating company policy and causing personal hardship.",
      department: "Legal",
      contactEmail: "karen.m@company.com",
      contactPhone: "+91-9876543220"
    },
    {
      grievanceNo: "G012",
      employeeName: "Liam Garcia",
      employeeId: "E134",
      category: "Performance Review",
      subject: "Unfair performance evaluation",
      status: "Pending",
      severity: "Medium",
      date: "2026-01-14",
      description: "Received unfair performance rating that does not reflect actual work output and achievements. Request for review and re-evaluation.",
      department: "Research",
      contactEmail: "liam.g@company.com",
      contactPhone: "+91-9876543221"
    },
    {
      grievanceNo: "G013",
      employeeName: "Mia Rodriguez",
      employeeId: "E135",
      category: "Training",
      subject: "Denied access to professional development",
      status: "Pending",
      severity: "Low",
      date: "2026-01-13",
      description: "Repeatedly denied access to training programs and professional development opportunities that are being provided to other team members.",
      department: "Analytics",
      contactEmail: "mia.r@company.com",
      contactPhone: "+91-9876543222"
    },
    {
      grievanceNo: "G014",
      employeeName: "Noah Thompson",
      employeeId: "E136",
      category: "Compensation Issue",
      subject: "Salary not matching offer letter",
      status: "In Progress",
      severity: "High",
      date: "2026-01-12",
      description: "Current salary does not match the amount specified in the offer letter. There is a discrepancy of 15% which has been ongoing for 2 months.",
      department: "Product",
      contactEmail: "noah.t@company.com",
      contactPhone: "+91-9876543223"
    }
  ];

  const handleViewDetails = (grievance) => {
    setSelectedGrievance(grievance);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGrievance(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return { backgroundColor: "#FEF3C7", color: "#D97706", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" };
      case "In Progress":
        return { backgroundColor: "#DBEAFE", color: "#2563EB", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" };
      case "Resolved":
        return { backgroundColor: "#D1FAE5", color: "#059669", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" };
      default:
        return { backgroundColor: "#E5E7EB", color: "#6B7280", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" };
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "High":
        return { backgroundColor: "#FEE2E2", color: "#DC2626", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" };
      case "Medium":
        return { backgroundColor: "#FED7AA", color: "#EA580C", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" };
      case "Low":
        return { backgroundColor: "#D1FAE5", color: "#059669", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" };
      default:
        return { backgroundColor: "#E5E7EB", color: "#6B7280", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" };
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.mainFrame}>
        {/* HEADER SECTION - Back Button Only */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate("/officer")}>
            ← Back to Dashboard
          </button>
        </div>

        {/* GRIEVANCE LIST TABLE */}
        <div style={styles.grievanceSection}>
          <h3 style={styles.sectionTitle}>Grievance Investigation List</h3>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>Grievance No</th>
                  <th style={styles.th}>Employee</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Severity</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {grievancesList.map((grievance) => (
                  <tr key={grievance.grievanceNo} style={styles.tr}>
                    <td style={styles.td}><strong>{grievance.grievanceNo}</strong></td>
                    <td style={styles.td}>{grievance.employeeName}</td>
                    <td style={styles.td}>{grievance.category}</td>
                    <td style={styles.td}>{grievance.subject}</td>
                    <td style={styles.td}>
                      <span style={getStatusStyle(grievance.status)}>
                        {grievance.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={getSeverityStyle(grievance.severity)}>
                        {grievance.severity}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(grievance.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td style={styles.td}>
                      <button 
                        style={styles.viewBtn} 
                        onClick={() => handleViewDetails(grievance)}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#3d5ac4"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#4f6fe6"}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL FOR GRIEVANCE DETAILS */}
      {showModal && selectedGrievance && (
        <div style={styles.modal} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Grievance Details - {selectedGrievance.grievanceNo}</h2>
              <span style={styles.closeBtn} onClick={handleCloseModal}>&times;</span>
            </div>
            <div style={styles.modalBody}>
              {/* Grid Layout for Details */}
              <div style={styles.detailGrid}>
                <div style={styles.detailGroup}>
                  <div style={styles.detailLabel}>Grievance Number</div>
                  <div style={styles.detailValue}>{selectedGrievance.grievanceNo}</div>
                </div>
                <div style={styles.detailGroup}>
                  <div style={styles.detailLabel}>Status</div>
                  <div>
                    <span style={getStatusStyle(selectedGrievance.status)}>
                      {selectedGrievance.status}
                    </span>
                  </div>
                </div>
                <div style={styles.detailGroup}>
                  <div style={styles.detailLabel}>Severity</div>
                  <div>
                    <span style={getSeverityStyle(selectedGrievance.severity)}>
                      {selectedGrievance.severity}
                    </span>
                  </div>
                </div>
                <div style={styles.detailGroup}>
                  <div style={styles.detailLabel}>Submission Date</div>
                  <div style={styles.detailValue}>
                    {new Date(selectedGrievance.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>

              <div style={styles.divider}></div>

              {/* Employee Information */}
              <h4 style={styles.sectionHeading}>Employee Information</h4>
              <div style={styles.detailGrid}>
                <div style={styles.detailGroup}>
                  <div style={styles.detailLabel}>Employee Name</div>
                  <div style={styles.detailValue}>{selectedGrievance.employeeName}</div>
                </div>
                <div style={styles.detailGroup}>
                  <div style={styles.detailLabel}>Employee ID</div>
                  <div style={styles.detailValue}>{selectedGrievance.employeeId}</div>
                </div>
                <div style={styles.detailGroup}>
                  <div style={styles.detailLabel}>Department</div>
                  <div style={styles.detailValue}>{selectedGrievance.department}</div>
                </div>
                <div style={styles.detailGroup}>
                  <div style={styles.detailLabel}>Email</div>
                  <div style={styles.detailValue}>{selectedGrievance.contactEmail}</div>
                </div>
                <div style={styles.detailGroup}>
                  <div style={styles.detailLabel}>Phone</div>
                  <div style={styles.detailValue}>{selectedGrievance.contactPhone}</div>
                </div>
              </div>

              <div style={styles.divider}></div>

              {/* Grievance Information */}
              <h4 style={styles.sectionHeading}>Grievance Information</h4>
              <div style={styles.detailGroup}>
                <div style={styles.detailLabel}>Category</div>
                <div style={styles.detailValue}>{selectedGrievance.category}</div>
              </div>
              <div style={styles.detailGroup}>
                <div style={styles.detailLabel}>Subject</div>
                <div style={styles.detailValue}>{selectedGrievance.subject}</div>
              </div>
              <div style={styles.detailGroup}>
                <div style={styles.detailLabel}>Description</div>
                <div style={styles.detailDescription}>
                  {selectedGrievance.description}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={styles.modalActions}>
                <button 
                  style={styles.updateBtn}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#2563EB"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#4299e1"}
                >
                  Update Status
                </button>
                <button 
                  style={styles.closeModalBtn} 
                  onClick={handleCloseModal}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#4b5563"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#6B7280"}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageBackground: {
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
    padding: "40px",
    display: "flex",
    justifyContent: "center",
  },
  mainFrame: {
    width: "100%",
    maxWidth: "1400px",
    backgroundColor: "#fff",
    border: "10px solid #ffffff",
    borderRadius: "24px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
    padding: "30px",
  },
  header: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: "#1a365d",
    fontWeight: "700",
  },
  subtitle: {
    color: "#718096",
    margin: "5px 0 0 0",
  },
  backBtn: {
    backgroundColor: "#4169E1",
    color: "#fff",
    border: "none",
    padding: "12px 25px",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(65, 105, 225, 0.3)",
    transition: "transform 0.2s",
  },
  statsRow: {
    marginBottom: "40px",
  },
  card: {
    width: "280px",
    padding: "25px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #edf2f7",
    boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
    position: "relative",
    overflow: "hidden",
  },
  cardLabel: {
    color: "#4a5568",
    fontSize: "15px",
    fontWeight: "600",
    margin: 0,
  },
  cardValue: {
    fontSize: "36px",
    color: "#2d3748",
    margin: "10px 0 0 0",
  },
  blueBar: {
    position: "absolute",
    left: 0,
    bottom: 0,
    height: "5px",
    width: "100%",
    backgroundColor: "#4169E1",
  },
  tableSection: {
    marginTop: "20px",
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "20px",
    color: "#2d3748",
    marginBottom: "20px",
    fontWeight: "600",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
  },
  thRow: {
    backgroundColor: "#1a365d",
  },
  th: {
    color: "#fff",
    padding: "15px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "600",
  },
  tr: {
    borderBottom: "1px solid #edf2f7",
    transition: "background-color 0.2s",
  },
  td: {
    padding: "18px 15px",
    color: "#4a5568",
  },
  tdCenter: {
    padding: "18px 15px",
    textAlign: "center",
    fontWeight: "bold",
  },
  tdPending: {
    color: "#ed8936",
    fontWeight: "bold",
    textAlign: "center",
  },
  tdProgress: {
    color: "#4299e1",
    fontWeight: "bold",
    textAlign: "center",
  },
  tdResolved: {
    color: "#48bb78",
    fontWeight: "bold",
    textAlign: "center",
  },
  grievanceSection: {
    marginTop: "0px",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "12px",
    border: "1px solid #edf2f7",
  },
  viewBtn: {
    backgroundColor: "#4f6fe6",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
    transition: "background-color 0.3s",
  },
  // Modal Styles
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    width: "90%",
    maxWidth: "900px",
    maxHeight: "90vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
  modalHeader: {
    backgroundColor: "#1a365d",
    color: "#fff",
    padding: "24px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "600",
  },
  closeBtn: {
    fontSize: "32px",
    fontWeight: "300",
    cursor: "pointer",
    lineHeight: "1",
    transition: "opacity 0.3s",
  },
  modalBody: {
    padding: "30px",
    overflowY: "auto",
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  detailGroup: {
    marginBottom: "16px",
  },
  detailLabel: {
    color: "#6b7280",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "6px",
    fontWeight: "600",
  },
  detailValue: {
    color: "#1a365d",
    fontSize: "16px",
    fontWeight: "500",
  },
  detailDescription: {
    backgroundColor: "#f9fafb",
    padding: "16px",
    borderRadius: "8px",
    borderLeft: "4px solid #4f6fe6",
    lineHeight: "1.6",
    color: "#374151",
    marginTop: "8px",
  },
  divider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    margin: "24px 0",
  },
  sectionHeading: {
    color: "#1a365d",
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
    marginTop: "8px",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    marginTop: "30px",
    justifyContent: "flex-end",
  },
  updateBtn: {
    backgroundColor: "#4299e1",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s",
  },
  closeModalBtn: {
    backgroundColor: "#6B7280",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s",
  },
};

export default OfficerAnalytics;