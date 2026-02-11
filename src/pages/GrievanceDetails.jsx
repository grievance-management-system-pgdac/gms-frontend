import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

const GrievanceDetails = () => {
  const { grvnNum } = useParams();
  const navigate = useNavigate();

  const [grievance, setGrievance] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [resolution, setResolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [intendedResolveClicked, setIntendedResolveClicked] = useState(false);

  // Modal States
  const [showInvAppealModal, setShowInvAppealModal] = useState(false);
  const [selectedInvNum, setSelectedInvNum] = useState(null);
  const [invAppealContent, setInvAppealContent] = useState('');

  useEffect(() => {
    fetchGrievanceData();
  }, [grvnNum]);

  const fetchGrievanceData = async () => {
    try {
      // Fetch full details including description
      const grievanceRes = await api.get(`/grievances/${grvnNum}`);
      setGrievance(grievanceRes.data);

      const timelineRes = await api.get(`/grievance/${grvnNum}/timeline`);
      setTimeline(timelineRes.data);

      if (grievanceRes.data.status === 'RESOLVED') {
        const resRes = await api.get(`/resolutions/${grvnNum}`);
        setResolution(resRes.data);
      }
    } catch (err) {
      setError('Failed to load grievance details');
    } finally {
      setLoading(false);
    }
  };

  const handleIntendedResolve = async () => {
    if (!window.confirm('Mark this grievance for resolution?')) return;
    try {
      await api.put(`/employee/grievances/${grvnNum}/intended-resolve`);
      setIntendedResolveClicked(true);
      alert('Grievance marked for resolution.');
      fetchGrievanceData();
    } catch (err) {
      alert('Action failed.');
    }
  };

  if (loading) return <div style={styles.infoMsg}>Loading...</div>;
  if (error) return <div style={styles.errorMsg}>{error}</div>;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        
        <div style={styles.topRow}>
          <button style={styles.simpleBtn} onClick={() => navigate(-1)}>← Back</button>
          <h2 style={styles.mainTitle}>Grievance: {grievance.grvnNum}</h2>
        </div>

        {/* DETAILS SECTION */}
        <div style={styles.card}>
          <div style={styles.row}>
            <div style={styles.col}><strong>Status:</strong> {grievance.status}</div>
            <div style={styles.col}><strong>Severity:</strong> {grievance.severity}</div>
            <div style={styles.col}><strong>Filed On:</strong> {new Date(grievance.dateFiled).toLocaleDateString()}</div>
          </div>
          <hr style={styles.hr} />
          
          <p style={styles.label}>Subject</p>
          <p style={styles.subjectText}>{grievance.subject}</p>

          <p style={styles.label}>Description</p>
          <div style={styles.descriptionBox}>
            {grievance.description || "No description provided."}
          </div>
        </div>

        {/* TIMELINE SECTION */}
        <div style={styles.card}>
          <h3 style={styles.subTitle}>Investigation History</h3>
          {timeline?.investigations?.length > 0 ? (
            timeline.investigations.map((inv, idx) => (
              <div key={idx} style={styles.invBlock}>
                <div style={styles.invHeader}>
                  <strong>Inv #{inv.investigationNum}</strong>
                  <span>{inv.outcome}</span>
                </div>
                <p><strong>Findings:</strong> {inv.findings || "In progress..."}</p>
                {inv.remarks && <p><strong>Remarks:</strong> {inv.remarks}</p>}
                
                {grievance.status !== 'RESOLVED' && (
                  <button 
                    style={styles.appealBtn} 
                    onClick={() => { setSelectedInvNum(inv.investigationNum); setShowInvAppealModal(true); }}
                  >
                    File Appeal
                  </button>
                )}
              </div>
            ))
          ) : (
            <p style={styles.muted}>No investigations started yet.</p>
          )}
        </div>

        {/* ACTION AREA */}
        <div style={styles.actionArea}>
          {grievance.status !== 'RESOLVED' ? (
            <button style={styles.resolveBtn} onClick={handleIntendedResolve}>
              Confirm Resolution (Intended Resolve)
            </button>
          ) : (
            <div style={styles.successBox}>✓ This grievance is Resolved.</div>
          )}
        </div>

      </div>

      {/* APPEAL MODAL (SIMPLE) */}
      {showInvAppealModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Appeal Investigation {selectedInvNum}</h3>
            <textarea 
              style={styles.textarea} 
              placeholder="Explain your appeal..."
              value={invAppealContent}
              onChange={(e) => setInvAppealContent(e.target.value)}
            />
            <div style={styles.modalBtns}>
              <button style={styles.simpleBtn} onClick={() => setShowInvAppealModal(false)}>Cancel</button>
              <button style={{...styles.resolveBtn, width: 'auto'}} onClick={() => alert('Submit appeal logic')}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { background: '#f9f9f9', minHeight: '100vh', fontFamily: 'sans-serif' },
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  mainTitle: { margin: 0, color: '#333' },
  card: { background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' },
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  label: { fontSize: '12px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '15px', marginBottom: '5px' },
  subjectText: { fontSize: '18px', fontWeight: 'bold', margin: 0 },
  descriptionBox: { background: '#f4f4f4', padding: '15px', borderRadius: '5px', borderLeft: '4px solid #ccc', lineHeight: '1.5' },
  subTitle: { borderBottom: '1px solid #eee', paddingBottom: '10px' },
  invBlock: { border: '1px solid #eee', borderRadius: '5px', padding: '15px', marginBottom: '10px' },
  invHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' },
  hr: { border: 0, borderTop: '1px solid #eee', margin: '20px 0' },
  muted: { color: '#888', fontStyle: 'italic' },
  simpleBtn: { padding: '8px 15px', border: '1px solid #ccc', background: '#fff', borderRadius: '4px', cursor: 'pointer' },
  resolveBtn: { width: '100%', padding: '15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
  appealBtn: { marginTop: '10px', padding: '5px 10px', background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer' },
  successBox: { padding: '15px', background: '#d4edda', color: '#155724', textAlign: 'center', borderRadius: '5px', fontWeight: 'bold' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { background: '#fff', padding: '30px', borderRadius: '8px', width: '400px' },
  textarea: { width: '100%', height: '100px', margin: '15px 0', padding: '10px', boxSizing: 'border-box' },
  modalBtns: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  infoMsg: { textAlign: 'center', padding: '50px' },
  errorMsg: { textAlign: 'center', color: 'red', padding: '50px' }
};

export default GrievanceDetails;