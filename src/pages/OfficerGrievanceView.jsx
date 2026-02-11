import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const OfficerGrievanceView = () => {
  const { grvnNum } = useParams();
  const navigate = useNavigate();
  
  const [grievance, setGrievance] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [featureFlags, setFeatureFlags] = useState({
    officer_table_view: true,
    grievance_self_assignment: true,
    investigate_workflow: true
  });

  // Investigation modal state
  const [showInvestigationModal, setShowInvestigationModal] = useState(false);
  const [investigationData, setInvestigationData] = useState({
    grvnNum: grvnNum,
    findings: '',
    remarks: '',
    outcome: ''
  });
  const [submittingInvestigation, setSubmittingInvestigation] = useState(false);

  // Update investigation modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [updateData, setUpdateData] = useState({
    findings: '',
    remarks: '',
    outcome: ''
  });
  const [updatingInvestigation, setUpdatingInvestigation] = useState(false);

  useEffect(() => {
    const userNum = localStorage.getItem("userNum");
    const role = localStorage.getItem("role");
    
    if (!userNum || role !== "OFFICER") {
      setError("Please log in as an officer to view this page");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    
    fetchGrievanceDetails();
    fetchTimeline();
    loadFeatureFlags();
    checkIfAssigned();
  }, [grvnNum]);

  const loadFeatureFlags = () => {
    const stored = localStorage.getItem('featureFlags');
    if (stored) {
      setFeatureFlags(JSON.parse(stored));
    }
  };

  const checkIfAssigned = () => {
    const assigned = JSON.parse(localStorage.getItem("assignedGrievances")) || [];
    setIsAssigned(assigned.includes(grvnNum));
  };

  const fetchGrievanceDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get('/officer/grievances');
      
      const found = res.data.find(g => g.grvnNum === grvnNum);
      
      if (!found) {
        setError('Grievance not found');
        setLoading(false);
        return;
      }
      
      setGrievance(found);
      console.log('Grievance loaded:', found);
    } catch (err) {
      console.error("Error fetching grievance details:", err);
      setError('Failed to load grievance details');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async () => {
    try {
      setTimelineLoading(true);
      console.log(`Fetching timeline for grievance: ${grvnNum}`);
      
      const res = await api.get(`/grievance/${grvnNum}/timeline`);
      
      console.log('Timeline API Response:', res.data);
      console.log('Timeline investigations:', res.data?.investigations);
      console.log('Timeline grievanceLevelAppeals:', res.data?.grievanceLevelAppeals);
      
      setTimeline(res.data);
    } catch (err) {
      console.error("Error fetching timeline:", err);
      console.error("Error response:", err.response?.data);
      // Don't set error here, timeline is optional
    } finally {
      setTimelineLoading(false);
    }
  };

  const handleSelect = async () => {
    if (!featureFlags.grievance_self_assignment) {
      setError("This feature is not yet available. Coming soon!");
      return;
    }

    try {
      setAssigning(true);
      setError('');
      
      const officerNum = localStorage.getItem("userNum");
      
      if (!officerNum) {
        setError("Officer number not found. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      
      const payload = {
        officerNum: officerNum,
        remarks: "Assigned for investigation"
      };
      
      console.log('Assigning grievance:', {
        grvnNum,
        payload,
        endpoint: `/officer/grievances/${grvnNum}/assign`
      });
      
      const response = await api.put(
        `/officer/grievances/${grvnNum}/assign`,
        payload
      );

      console.log('Assignment response:', response);

      if (response.status === 200) {
        const stored = JSON.parse(localStorage.getItem("assignedGrievances")) || [];
        if (!stored.includes(grvnNum)) {
          const updated = [...stored, grvnNum];
          localStorage.setItem("assignedGrievances", JSON.stringify(updated));
        }
        
        setIsAssigned(true);
        setSuccessMessage(`Grievance ${grvnNum} has been assigned to you successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        
        await fetchGrievanceDetails();
        await fetchTimeline();
      }
    } catch (error) {
      console.error("Error assigning grievance:", error);
      console.error("Error response:", error.response?.data);
      
      const errorMessage = error.response?.data?.details
        || error.response?.data?.message 
        || error.response?.data?.error 
        || "Failed to assign grievance. Please try again.";
      
      setError(errorMessage);
    } finally {
      setAssigning(false);
    }
  };

  const handleAddInvestigation = () => {
    if (!isAssigned) {
      setError("Please select this grievance first before adding an investigation");
      return;
    }
    
    // Check if grievance status allows investigation
    const status = normalizeStatus(grievance?.status);
    if (status !== 'IN_PROCESS') {
      setError("Investigations can only be added when grievance is 'In-Process'. Current status: " + status.replace(/_/g, ' '));
      return;
    }
    
    setShowInvestigationModal(true);
  };

  const handleInvestigationChange = (e) => {
    const { name, value } = e.target;
    setInvestigationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitInvestigation = async (e) => {
    e.preventDefault();
    
    if (!investigationData.findings.trim()) {
      setError("Please enter findings");
      return;
    }

    try {
      setSubmittingInvestigation(true);
      setError('');

      const payload = {
        grvnNum: grvnNum,
        findings: investigationData.findings,
        remarks: investigationData.remarks,
        outcome: investigationData.outcome
      };

      console.log('Adding investigation:', payload);

      const response = await api.post('/officer/investigations/add', payload);

      console.log('Investigation added:', response.data);

      setSuccessMessage('Investigation added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Close modal and reset form
      setShowInvestigationModal(false);
      setInvestigationData({
        grvnNum: grvnNum,
        findings: '',
        remarks: '',
        outcome: ''
      });

      // Refresh grievance details and timeline
      await fetchGrievanceDetails();
      await fetchTimeline();

    } catch (error) {
      console.error("Error adding investigation:", error);
      console.error("Error response:", error.response?.data);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || "Failed to add investigation. Please try again.";
      
      setError(errorMessage);
    } finally {
      setSubmittingInvestigation(false);
    }
  };

  const handleUpdateInvestigation = (investigation) => {
    setSelectedInvestigation(investigation);
    setUpdateData({
      findings: investigation.findings,
      remarks: investigation.remarks || '',
      outcome: investigation.outcome || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitUpdate = async (e) => {
  e.preventDefault();
  
  // Clear any previous errors
  setError('');
  
  if (!updateData.findings.trim()) {
    setError("Please enter findings");
    return;
  }

  try {
    setUpdatingInvestigation(true);

    const payload = {
      //investigationNum: selectedInvestigation.investigationNum,
      findings: updateData.findings.trim(),
      remarks: updateData.remarks.trim(),
      outcome: updateData.outcome.trim()
    };

    console.log('=== UPDATE INVESTIGATION DEBUG ===');
    console.log('Selected Investigation:', selectedInvestigation);
    console.log('Update Payload:', payload);
    console.log('API Endpoint: PUT /officer/investigations/update');


    const response = await api.put(
      `/officer/investigations/${selectedInvestigation.investigationNum}/update`,
      payload
    );
    console.log('Update Response Status:', response.status);
    console.log('Update Response Data:', response.data);
    console.log('=== UPDATE SUCCESSFUL ===');

    setSuccessMessage('Investigation updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    
    // Close modal and reset state
    setShowUpdateModal(false);
    setSelectedInvestigation(null);
    setUpdateData({
      findings: '',
      remarks: '',
      outcome: ''
    });

    // *** CRITICAL FIX: Refresh BOTH timeline AND grievance details ***
    console.log('Refreshing timeline and grievance data...');
    await Promise.all([
      fetchTimeline(),
      fetchGrievanceDetails()
    ]);
    console.log('Data refreshed successfully');

  } catch (error) {
    console.error('=== UPDATE INVESTIGATION ERROR ===');
    console.error('Full error object:', error);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      // Provide specific error messages
      if (error.response.status === 404) {
        setError(`Investigation ${selectedInvestigation.investigationNum} not found.`);
      } else if (error.response.status === 403) {
        setError("You don't have permission to update this investigation.");
      } else if (error.response.status === 400) {
        const errorMsg = error.response.data?.message 
          || error.response.data?.error 
          || "Invalid data provided. Please check all fields.";
        setError(errorMsg);
      } else {
        const errorMsg = error.response.data?.message 
          || error.response.data?.error 
          || `Server error (${error.response.status}). Please try again.`;
        setError(errorMsg);
      }
    } else if (error.request) {
      setError("No response from server. Please check your connection.");
    } else {
      setError(`Request failed: ${error.message}`);
    }
    
    console.error('=== END ERROR DEBUG ===');
    
    // Don't close modal on error so user can fix and retry
  } finally {
    setUpdatingInvestigation(false);
  }
};

  const handleEndInvestigation = async (investigationNum) => {
    if (!window.confirm(`Are you sure you want to end investigation ${investigationNum}?`)) {
      return;
    }

    try {
      setError('');
      
      console.log('Ending investigation:', investigationNum);

      const response = await api.put(`/officer/investigations/${investigationNum}/end`);

      console.log('Investigation ended:', response.data);

      setSuccessMessage('Investigation ended successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Refresh timeline
      await fetchTimeline();

    } catch (error) {
      console.error("Error ending investigation:", error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || "Failed to end investigation. Please try again.";
      
      setError(errorMessage);
    }
  };

  const handleBackToDashboard = (e) => {
    e.preventDefault();
    navigate('/officer');
  };

  const normalizeStatus = (status) => {
    if (!status) return "";
    return String(status).trim().replace(/\s+/g, "_").toUpperCase();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-content">
          <p>Loading grievance details...</p>
        </div>
      </div>
    );
  }

  if (error && !grievance) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-content">
          <p style={{ color: '#e53e3e' }}>{error}</p>
          <button 
            onClick={handleBackToDashboard}
            className="btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!grievance) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-content">
          <p>Grievance not found</p>
          <button 
            onClick={handleBackToDashboard}
            className="btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">
        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            padding: '16px 20px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {error}
            <button 
              onClick={() => setError('')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#991b1b',
                padding: 0,
                marginLeft: '12px',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            color: '#166534',
            padding: '16px 20px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {successMessage}
            <button 
              onClick={() => setSuccessMessage('')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#166534',
                padding: 0,
                marginLeft: '12px',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
        )}

        <div className="dashboard-header" style={{ marginBottom: "24px" }}>
          <div>
            <button 
              onClick={handleBackToDashboard}
              className="btn-secondary"
              style={{ marginBottom: "12px", display: "inline-block" }}
            >
              ← Back to Dashboard
            </button>
            <h1>Grievance Details</h1>
          </div>
          
          <div style={{ display: "flex", gap: "12px" }}>
            {featureFlags.grievance_self_assignment && !isAssigned && (
              <button
                onClick={handleSelect}
                disabled={assigning}
                className="btn-warning"
                style={{ minWidth: "120px" }}
              >
                {assigning ? "Selecting..." : "Select"}
              </button>
            )}
          </div>
        </div>

        {/* Grievance Basic Info */}
        <div style={{
          background: "white",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "24px"
        }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}>
            <div>
              <label style={{ 
                display: "block", 
                fontSize: "14px", 
                fontWeight: "600", 
                color: "#666",
                marginBottom: "8px"
              }}>
                Grievance Number
              </label>
              <p style={{ 
                fontSize: "16px", 
                fontWeight: "600",
                margin: 0
              }}>
                {grievance.grvnNum}
              </p>
            </div>

            <div>
              <label style={{ 
                display: "block", 
                fontSize: "14px", 
                fontWeight: "600", 
                color: "#666",
                marginBottom: "8px"
              }}>
                Status
              </label>
              <span className={`status-badge ${normalizeStatus(grievance.status)}`}>
                {normalizeStatus(grievance.status).replace(/_/g, " ")}
              </span>
            </div>

            <div>
              <label style={{ 
                display: "block", 
                fontSize: "14px", 
                fontWeight: "600", 
                color: "#666",
                marginBottom: "8px"
              }}>
                Severity
              </label>
              <p style={{ 
                fontSize: "16px",
                margin: 0
              }}>
                {grievance.severity || "—"}
              </p>
            </div>

            <div>
              <label style={{ 
                display: "block", 
                fontSize: "14px", 
                fontWeight: "600", 
                color: "#666",
                marginBottom: "8px"
              }}>
                Date Filed
              </label>
              <p style={{ 
                fontSize: "16px",
                margin: 0
              }}>
                {grievance.dateFiled
                  ? new Date(grievance.dateFiled).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Employee Information */}
        <div style={{
          background: "white",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "24px"
        }}>
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: "600",
            marginBottom: "16px",
            borderBottom: "2px solid #f3f4f6",
            paddingBottom: "8px"
          }}>
            Employee Information
          </h2>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}>
            <div>
              <label style={{ 
                display: "block", 
                fontSize: "14px", 
                fontWeight: "600", 
                color: "#666",
                marginBottom: "8px"
              }}>
                Employee Number
              </label>
              <p style={{ fontSize: "16px", margin: 0 }}>
                {grievance.empNum || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Grievance Details */}
        <div style={{
          background: "white",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "24px"
        }}>
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: "600",
            marginBottom: "16px",
            borderBottom: "2px solid #f3f4f6",
            paddingBottom: "8px"
          }}>
            Grievance Details
          </h2>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              fontSize: "14px", 
              fontWeight: "600", 
              color: "#666",
              marginBottom: "8px"
            }}>
              Category
            </label>
            <p style={{ fontSize: "16px", margin: 0 }}>
              {grievance.categoryName || "—"}
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              fontSize: "14px", 
              fontWeight: "600", 
              color: "#666",
              marginBottom: "8px"
            }}>
              Subject
            </label>
            <p style={{ fontSize: "16px", margin: 0 }}>
              {grievance.subject || "—"}
            </p>
          </div>

          <div>
            <label style={{ 
              display: "block", 
              fontSize: "14px", 
              fontWeight: "600", 
              color: "#666",
              marginBottom: "8px"
            }}>
              Description
            </label>
            <p style={{ 
              fontSize: "16px", 
              margin: 0,
              lineHeight: "1.6",
              whiteSpace: "pre-wrap"
            }}>
              {grievance.description || "No description provided"}
            </p>
          </div>
        </div>

        {/* DEBUG: Timeline Loading State */}
        {timelineLoading && (
          <div style={{
            background: "#fffbeb",
            border: "2px solid #fbbf24",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px"
          }}>
            <p style={{ margin: 0, fontWeight: "600" }}>⏳ Loading timeline data...</p>
          </div>
        )}

        {/* DEBUG: Timeline Data Info
        {!timelineLoading && (
          <div style={{
            background: "#f3f4f6",
            border: "2px solid #9ca3af",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "16px" }}>🔍 Debug Info:</h3>
            <p style={{ margin: "4px 0" }}>Timeline object exists: {timeline ? "✅ Yes" : "❌ No"}</p>
            <p style={{ margin: "4px 0" }}>
              Investigations count: {timeline?.investigations?.length || 0}
            </p>
            <p style={{ margin: "4px 0" }}>
              Grievance-level appeals count: {timeline?.grievanceLevelAppeals?.length || 0}
            </p>
            {timeline && (
              <details style={{ marginTop: "12px" }}>
                <summary style={{ cursor: "pointer", fontWeight: "600" }}>
                  View Raw Timeline Data
                </summary>
                <pre style={{
                  background: "white",
                  padding: "12px",
                  borderRadius: "4px",
                  overflow: "auto",
                  fontSize: "12px",
                  marginTop: "8px"
                }}>
                  {JSON.stringify(timeline, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )} */}

        {/* Investigations & Appeals Timeline */}
        {timeline && timeline.investigations && timeline.investigations.length > 0 ? (
          <div style={{
            background: "white",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px"
          }}>
            <h2 style={{ 
              fontSize: "18px", 
              fontWeight: "600",
              marginBottom: "16px",
              borderBottom: "2px solid #f3f4f6",
              paddingBottom: "8px"
            }}>
              Investigations & Appeals ({timeline.investigations.length})
            </h2>
            
            {timeline.investigations.map((investigation, index) => (
              <div key={investigation.investigationNum} style={{
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: index < timeline.investigations.length - 1 ? '20px' : '0',
                backgroundColor: '#f9fafb'
              }}>
                {/* Investigation Header */}
                <div style={{
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #d1d5db'
                }}>
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    color: '#1f2937'
                  }}>
                    Investigation {investigation.investigationNum}
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    <span>
                      Started: {new Date(investigation.investigationDate).toLocaleDateString()}
                    </span>
                    {investigation.endDate && (
                      <span>
                        Ended: {new Date(investigation.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Investigation Details */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{
                      display: 'block',
                      marginBottom: '4px',
                      color: '#374151',
                      fontSize: '14px'
                    }}>Findings:</strong>
                    <p style={{
                      margin: 0,
                      color: '#1f2937',
                      lineHeight: '1.5'
                    }}>{investigation.findings}</p>
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{
                      display: 'block',
                      marginBottom: '4px',
                      color: '#374151',
                      fontSize: '14px'
                    }}>Outcome:</strong>
                    <p style={{
                      margin: 0,
                      color: '#1f2937',
                      lineHeight: '1.5'
                    }}>{investigation.outcome || "—"}</p>
                  </div>
                  
                  {investigation.remarks && (
                    <div style={{ marginBottom: '12px' }}>
                      <strong style={{
                        display: 'block',
                        marginBottom: '4px',
                        color: '#374151',
                        fontSize: '14px'
                      }}>Remarks:</strong>
                      <p style={{
                        margin: 0,
                        color: '#1f2937',
                        lineHeight: '1.5'
                      }}>{investigation.remarks}</p>
                    </div>
                  )}
                </div>

                {/* Appeals for this investigation */}
                {investigation.appeals && investigation.appeals.length > 0 ? (
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid #d1d5db'
                  }}>
                    <h4 style={{
                      margin: '0 0 12px 0',
                      fontSize: '16px',
                      color: '#374151'
                    }}>Appeals ({investigation.appeals.length})</h4>
                    {investigation.appeals.map((appeal, appealIndex) => (
                      <div key={appeal.appealNum} style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        marginBottom: appealIndex < investigation.appeals.length - 1 ? '12px' : '0'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <span style={{
                            fontWeight: '600',
                            color: '#1f2937',
                            fontSize: '14px'
                          }}>{appeal.appealNum}</span>
                          <span style={{
                            fontSize: '13px',
                            color: '#6b7280'
                          }}>
                            {new Date(appeal.appealDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p style={{
                          margin: 0,
                          color: '#374151',
                          lineHeight: '1.5',
                          fontSize: '14px'
                        }}>{appeal.appealContent}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid #d1d5db',
                    color: '#6b7280',
                    fontSize: '14px',
                    fontStyle: 'italic'
                  }}>
                    No appeals filed for this investigation
                  </div>
                )}

                {/* Action buttons for investigation */}
                {isAssigned && !investigation.endDate && (
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid #d1d5db'
                  }}>
                    <button
                      onClick={() => handleUpdateInvestigation(investigation)}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                      Update Investigation
                    </button>
                    <button
                      onClick={() => handleEndInvestigation(investigation.investigationNum)}
                      className="btn-danger"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                      End Investigation
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          !timelineLoading && (
            <div style={{
              background: "white",
              borderRadius: "8px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              marginBottom: "24px",
              textAlign: "center",
              color: "#6b7280"
            }}>
              <p style={{ margin: 0, fontSize: "16px" }}>
                📋 No investigations have been added yet
              </p>
            </div>
          )
        )}

        {/* Grievance-Level Appeals */}
        {timeline && timeline.grievanceLevelAppeals && timeline.grievanceLevelAppeals.length > 0 && (
          <div style={{
            background: "white",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px"
          }}>
            <h2 style={{ 
              fontSize: "18px", 
              fontWeight: "600",
              marginBottom: "16px",
              borderBottom: "2px solid #f3f4f6",
              paddingBottom: "8px"
            }}>
              Grievance-Level Appeals ({timeline.grievanceLevelAppeals.length})
            </h2>
            {timeline.grievanceLevelAppeals.map((appeal, index) => (
              <div key={appeal.appealNum} style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '12px 16px',
                marginBottom: index < timeline.grievanceLevelAppeals.length - 1 ? '12px' : '0'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontWeight: '600',
                    color: '#1f2937',
                    fontSize: '14px'
                  }}>{appeal.appealNum}</span>
                  <span style={{
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    {new Date(appeal.appealDate).toLocaleDateString()}
                  </span>
                </div>
                <p style={{
                  margin: 0,
                  color: '#374151',
                  lineHeight: '1.5',
                  fontSize: '14px'
                }}>{appeal.appealContent}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Investigation Button */}
        {isAssigned && (
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <button
              onClick={handleAddInvestigation}
              className="btn-primary"
              style={{ padding: '12px 32px', fontSize: '16px' }}
            >
              + Add Investigation
            </button>
            {normalizeStatus(grievance?.status) !== 'IN_PROCESS' && (
              <p style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                Note: Grievance must be in "In-Process" status to add investigations
              </p>
            )}
          </div>
        )}

        {/* Assignment Indicator */}
        {isAssigned && (
          <div style={{
            background: "#dcfce7",
            border: "2px solid #10b981",
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <span style={{ fontSize: "24px" }}>✓</span>
            <div>
              <p style={{ 
                margin: 0, 
                fontWeight: "600", 
                color: "#166534" 
              }}>
                This grievance is assigned to you
              </p>
              <p style={{ 
                margin: "4px 0 0 0", 
                fontSize: "14px", 
                color: "#166534" 
              }}>
                You can now manage investigations for this grievance
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Investigation Modal */}
      {showInvestigationModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            borderRadius: "8px",
            padding: "32px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "90vh",
            overflow: "auto"
          }}>
            <h2 style={{ 
              marginTop: 0,
              marginBottom: "24px",
              fontSize: "24px",
              fontWeight: "600"
            }}>
              Add Investigation
            </h2>

            <form onSubmit={handleSubmitInvestigation}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px"
                }}>
                  Grievance Number
                </label>
                <input
                  type="text"
                  value={grvnNum}
                  disabled
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    backgroundColor: "#f3f4f6",
                    cursor: "not-allowed"
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px"
                }}>
                  Findings *
                </label>
                <textarea
                  name="findings"
                  value={investigationData.findings}
                  onChange={handleInvestigationChange}
                  required
                  rows={4}
                  placeholder="Enter investigation findings..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px"
                }}>
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={investigationData.remarks}
                  onChange={handleInvestigationChange}
                  rows={3}
                  placeholder="Enter additional remarks (optional)..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px"
                }}>
                  Outcome
                </label>
                <input
                  type="text"
                  name="outcome"
                  value={investigationData.outcome}
                  onChange={handleInvestigationChange}
                  placeholder="Enter outcome (optional)..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowInvestigationModal(false)}
                  disabled={submittingInvestigation}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingInvestigation}
                  className="btn-primary"
                >
                  {submittingInvestigation ? "Submitting..." : "Add Investigation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Investigation Modal */}
     {showUpdateModal && selectedInvestigation && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  }}>
    <div style={{
      background: "white",
      borderRadius: "8px",
      padding: "32px",
      maxWidth: "600px",
      width: "90%",
      maxHeight: "90vh",
      overflow: "auto"
    }}>
      <h2 style={{ 
        marginTop: 0,
        marginBottom: "24px",
        fontSize: "24px",
        fontWeight: "600"
      }}>
        Update Investigation {selectedInvestigation.investigationNum}
      </h2>

      {/* *** NEW: Error display inside modal *** */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          color: '#991b1b',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitUpdate}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "8px"
          }}>
            Findings *
          </label>
          <textarea
            name="findings"
            value={updateData.findings}
            onChange={handleUpdateChange}
            required
            rows={4}
            placeholder="Enter investigation findings..."
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              resize: "vertical",
              fontFamily: "inherit"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "8px"
          }}>
            Remarks
          </label>
          <textarea
            name="remarks"
            value={updateData.remarks}
            onChange={handleUpdateChange}
            rows={3}
            placeholder="Enter additional remarks (optional)..."
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              resize: "vertical",
              fontFamily: "inherit"
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "8px"
          }}>
            Outcome
          </label>
          <input
            type="text"
            name="outcome"
            value={updateData.outcome}
            onChange={handleUpdateChange}
            placeholder="Enter outcome (optional)..."
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "4px"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => {
              setShowUpdateModal(false);
              setSelectedInvestigation(null);
              setError(''); // *** NEW: Clear error when closing ***
            }}
            disabled={updatingInvestigation}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updatingInvestigation || !updateData.findings.trim()}
            className="btn-primary"
            style={{
              opacity: (updatingInvestigation || !updateData.findings.trim()) ? 0.6 : 1
            }}
          >
            {updatingInvestigation ? "Updating..." : "Update Investigation"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default OfficerGrievanceView;