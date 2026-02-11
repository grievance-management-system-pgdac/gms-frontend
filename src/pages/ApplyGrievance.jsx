import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

const CATEGORY_MAP = {
  SAL: ["Non-payment / Delay / Deduction", "Bonus Issues", "Minimum Wages", "Overtime Issues", "Excess Working Hours"],
  HR: ["Leave Rejection", "Workplace Harassment", "Sexual Harassment", "Discrimination", "Promotion Issues", "Illegal Termination", "Retrenchment / Layoff"],
  SAF: ["Unsafe Working Conditions", "Workplace Injuries"],
  FIN: ["Provident Fund Issues", "ESI Issues", "Gratuity Issues"],
  CON: ["Agreement Violation"],
  TRF: ["Forced Transfer"],
  IT: ["Data Misuse"]
};

const ApplyGrievance = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: 'SAL', 
    subject: '',
    description: '',
    severity: 'LOW'
  });
  
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const available = CATEGORY_MAP[formData.category] || [];
    setTopics(available);
    setFormData(prev => ({ ...prev, subject: available[0] || '' }));
  }, [formData.category]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Payload for {call file_grievance(...)}
    const payload = {
      categoryNum: formData.category, 
      subject: formData.subject,
      description: formData.description,
      severity: formData.severity
    };

    try {
      // 1. Submit the Grievance (Triggers the Stored Procedure)
      const res = await api.post('/employee/grievances', payload); 
      
      // LOGIC FIX: 
      // Your logs show 'G005', which is 'grvnNum' in your DB schema.
      // We must extract this ID to link the attachments.
      const newGrievanceNum = res.data.grvnNum || res.data; 

      // 2. Upload attachments ONLY if files exist and we have the ID
      if (selectedFiles.length > 0 && newGrievanceNum) {
        const uploadData = new FormData();
        
        // Append each file to 'files' (matching Backend @RequestParam)
        selectedFiles.forEach(file => {
          uploadData.append("files", file);
        });
        
        // These fields are required for your 'attachments' table
        uploadData.append("parentTable", "grievances");
        uploadData.append("parentId", newGrievanceNum);

        // This call performs the actual INSERT into the attachments table
        await api.post("/attachments/upload", uploadData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      alert('Grievance and attachments filed successfully!');
      navigate('/employee');
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.message || 'Grievance saved, but failed to upload files.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <div className="form-container" style={{ width: '100%', maxWidth: '750px', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h1 style={{ marginBottom: '25px', textAlign: 'center' }}>File New Grievance</h1>
          
          {error && <div style={{ color: '#721c24', background: '#f8d7da', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  {Object.keys(CATEGORY_MAP).map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 2 }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Topic *</label>
                <select name="subject" value={formData.subject} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  {topics.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Severity *</label>
              <select name="severity" value={formData.severity} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="5" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} placeholder="Detail your grievance..." />
            </div>

            <div style={{ marginBottom: '25px', padding: '15px', background: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ccc' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Attachments</label>
              <input type="file" multiple onChange={handleFileChange} style={{ width: '100%', cursor: 'pointer' }} />
              
              {selectedFiles.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} style={{ fontSize: '13px', color: '#4f69f8' }}>📎 {file.name}</div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
              <button type="button" onClick={() => navigate('/employee')} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Submitting...' : 'Submit Grievance'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyGrievance;