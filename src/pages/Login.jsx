import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [loginType, setLoginType] = useState("employee"); // employee | officer
  const [credentials, setCredentials] = useState({
    userNum: "",
    password: "",
    authKey: ""
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // Stores red validation messages
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Popup for Invalid Details from Backend
  useEffect(() => {
    if (error) {
      alert("⚠️ Login Failed: " + error);
    }
  }, [error]);

  // Validation Logic (Same as Registration)
  const validateField = (name, value) => {
    let err = "";
    if (name === "userNum") {
      if (!value) err = "User Number is required";
      else if (value.length !== 4) err = "ID must be exactly 4 characters (e.g., E001)";
    }
    if (name === "password") {
      if (!value) err = "Password is required";
      else if (value.length < 8) err = "Password must be at least 8 characters";
    }
    if (name === "authKey" && loginType === "officer") {
      if (!value) err = "Auth Key is required for Officers/Admins";
    }
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });

    // Real-time validation: updates red text while typing
    setFieldErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Final Validation Check
    const errors = {};
    Object.keys(credentials).forEach((key) => {
      if (key === "authKey" && loginType === "employee") return;
      const err = validateField(key, credentials[key]);
      if (err) errors[key] = err;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      alert("Please fix the errors highlighted in red.");
      return;
    }

    setLoading(true);

    const payload =
      loginType === "employee"
        ? {
            userNum: credentials.userNum,
            password: credentials.password
          }
        : {
            userNum: credentials.userNum,
            password: credentials.password,
            authKey: credentials.authKey
          };

    const result = await login(payload);

    if (!result.success) {
      setError(result.error);
    }
    // AuthContext handles localStorage storage and navigation automatically

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Grievance Management System</h1>

        <h2>
          {loginType === "employee"
            ? "Employee Login"
            : "Officer / Admin Login"}
        </h2>

        <div className="form-group">
          <select
            value={loginType}
            onChange={(e) => {
              setLoginType(e.target.value);
              setFieldErrors({}); // Clear red text when changing role
            }}
          >
            <option value="employee">Employee</option>
            <option value="officer">Officer / Admin</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User Number</label>
            <input
              type="text"
              name="userNum"
              placeholder="e.g. E001"
              maxLength={4}
              value={credentials.userNum}
              onChange={handleChange}
              required
              style={fieldErrors.userNum ? { border: '1px solid red' } : {}}
            />
            {/* RED VALIDATION MESSAGE */}
            {fieldErrors.userNum && (
              <span style={{ color: "red", fontSize: "12px", marginTop: "4px", display: "block" }}>
                {fieldErrors.userNum}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min 8 characters"
              value={credentials.password}
              onChange={handleChange}
              required
              style={fieldErrors.password ? { border: '1px solid red' } : {}}
            />
            {/* RED VALIDATION MESSAGE */}
            {fieldErrors.password && (
              <span style={{ color: "red", fontSize: "12px", marginTop: "4px", display: "block" }}>
                {fieldErrors.password}
              </span>
            )}
          </div>

          {loginType === "officer" && (
            <div className="form-group">
              <label>Auth Key</label>
              <input
                type="text"
                name="authKey"
                value={credentials.authKey}
                onChange={handleChange}
                required
                style={fieldErrors.authKey ? { border: '1px solid red' } : {}}
              />
              {/* RED VALIDATION MESSAGE */}
              {fieldErrors.authKey && (
                <span style={{ color: "red", fontSize: "12px", marginTop: "4px", display: "block" }}>
                  {fieldErrors.authKey}
                </span>
              )}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-links">
          <p>Don't have an account?</p>
          <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;