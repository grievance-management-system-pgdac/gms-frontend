import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

// EXACT MATCH FROM YOUR DB TABLE SCREENSHOT
const CATEGORIES = [
  { ctgnum: "HR",   ctgname: "Human Resource Issues" },
  { ctgnum: "SAL",  ctgname: "Salary & Wage Issues" },
  { ctgnum: "SAF",  ctgname: "Workplace Safety" },
  { ctgnum: "FIN",  ctgname: "Statutory Benefits" },
  { ctgnum: "CON",  ctgname: "Contractual Issues" },
  { ctgnum: "TRF",  ctgname: "Transfer Issues" },
  { ctgnum: "IT",   ctgname: "Data Privacy Issues" },
  { ctgnum: "BCDA", ctgname: "DEPARTMENTAL" }
];

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("employee");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    userNum: "",
    name: "",
    email: "",
    password: "",
    address: "",
    department: "",
    contactNum: "",
    employeeRole: "",
    categoryNum: "", // This maps to ctgnum in your DB
    authKey: ""      
  });

  const validateField = (name, value) => {
    let err = "";
    switch (name) {
      case "userNum":
        if (value.length !== 4) err = "ID must be exactly 4 characters.";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) err = "Invalid email format.";
        break;
      case "password":
        if (value.length < 8) err = "Min 8 characters required.";
        break;
      case "categoryNum":
        if (role === "officer" && !value) err = "Please select a category.";
        break;
      default: break;
    }
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errors = {};
    const keysToCheck = role === 'employee' 
      ? ['userNum', 'name', 'email', 'password', 'address', 'department', 'contactNum', 'employeeRole']
      : ['userNum', 'name', 'email', 'password', 'address', 'categoryNum', 'authKey'];

    keysToCheck.forEach(key => {
      const err = validateField(key, formData[key]);
      if (err) errors[key] = err;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix the highlighted errors.");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/register/${role}`, formData);
      alert("Registration Successful!");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Check ID/Email uniqueness.";
      setError(msg);
      alert("⚠️ Registration Failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const ErrorSpan = ({ name }) => (
    fieldErrors[name] ? <span style={styles.errorText}>{fieldErrors[name]}</span> : null
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.header}>GMS Registration</h2>
        
        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* ROLE & ID ROW */}
          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Register As</label>
              <select value={role} onChange={(e) => {setRole(e.target.value); setFieldErrors({});}} style={styles.input}>
                <option value="employee">Employee</option>
                <option value="officer">Officer</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>User ID (4 Chars)</label>
              <input name="userNum" onChange={handleChange} maxLength={4} placeholder="E001" required style={styles.input} />
              <ErrorSpan name="userNum" />
            </div>
          </div>

          <label style={styles.label}>Full Name</label>
          <input name="name" onChange={handleChange} required style={styles.input} />

          <label style={styles.label}>Email Address</label>
          <input name="email" type="email" onChange={handleChange} required style={styles.input} />
          <ErrorSpan name="email" />

          <label style={styles.label}>Residential Address</label>
          <input name="address" onChange={handleChange} required style={styles.input} />

          {/* EMPLOYEE SPECIFIC FIELDS */}
          {role === 'employee' && (
            <>
              <div style={styles.row}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Department</label>
                  <input name="department" onChange={handleChange} required style={styles.input} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Job Role</label>
                  <input name="employeeRole" onChange={handleChange} required style={styles.input} />
                </div>
              </div>
              <label style={styles.label}>Contact Number (10 digits)</label>
              <input name="contactNum" onChange={handleChange} maxLength={10} required style={styles.input} />
            </>
          )}

          {/* OFFICER SPECIFIC FIELDS - DISPLAYING DB CATEGORIES */}
          {role === 'officer' && (
            <>
              <div style={{ marginBottom: '15px' }}>
                <label style={styles.label}>Officer Specialty (Category)</label>
                <select name="categoryNum" onChange={handleChange} required style={styles.input}>
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => (
                    <option key={c.ctgnum} value={c.ctgnum}>
                      {c.ctgname} ({c.ctgnum})
                    </option>
                  ))}
                </select>
                <ErrorSpan name="categoryNum" />
              </div>
              
              <label style={styles.label}>Officer Auth Key</label>
              <input name="authKey" onChange={handleChange} placeholder="Provided by Admin" required style={styles.input} />
            </>
          )}

          <label style={styles.label}>Create Password</label>
          <input name="password" type="password" onChange={handleChange} required style={styles.input} />
          <ErrorSpan name="password" />

          <button 
            type="submit" 
            disabled={loading}
            style={{...styles.btn, backgroundColor: loading ? '#94a3b8' : '#4f46e5'}}
          >
            {loading ? "Registering..." : "REGISTER NOW"}
          </button>
        </form>

        <p style={styles.footer}>
          Already registered? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

// ... Styles remain the same as your provided code ...
const styles = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px' },
  card: { width: '100%', maxWidth: '520px', background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' },
  header: { textAlign: 'center', marginBottom: '30px', color: '#1e293b', fontSize: '24px' },
  label: { display: 'block', fontWeight: '600', marginBottom: '6px', color: '#475569', fontSize: '14px' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' },
  row: { display: 'flex', gap: '15px' },
  btn: { width: '100%', padding: '18px', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  errorBanner: { backgroundColor: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fecaca', textAlign: 'center', fontSize: '14px' },
  errorText: { color: '#ef4444', fontSize: '12px', display: 'block', marginTop: '-12px', marginBottom: '12px' },
  footer: { textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '14px' },
  link: { color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold' }
};

export default Register;