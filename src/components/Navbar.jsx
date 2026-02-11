import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const goHome = () => {
    if (user.role === "EMPLOYEE") navigate("/employee");
    else if (user.role === "OFFICER") navigate("/officer");
    else if (user.role === "ADMIN") navigate("/admin");
  };

  const goToProfile = () => {
    if (user.role === "EMPLOYEE") navigate("/employee/profile");
    else if (user.role === "OFFICER") navigate("/officer/profile");
  };

  return (
    <>
      <style>{`
        .gms-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .gms-navbar-left h2 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: bold;
          color: #0066cc;
          letter-spacing: 0.5px;
        }

        .gms-navbar-center {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .gms-nav-link {
          color: #333;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.5rem 0;
          transition: color 0.3s ease;
          position: relative;
        }

        .gms-nav-link:hover {
          color: #0066cc;
        }

        .gms-nav-link.active {
          color: #0066cc;
          font-weight: 600;
        }

        .gms-nav-link.active::after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 0;
          right: 0;
          height: 3px;
          background: #0066cc;
          border-radius: 2px;
        }

        .gms-navbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .gms-user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .gms-user-id {
          font-size: 1rem;
          font-weight: 600;
          color: #333;
        }

        .gms-role-badge {
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .gms-role-employee {
          background: #d4edda;
          color: #155724;
        }

        .gms-role-officer {
          background: #d1ecf1;
          color: #0c5460;
        }

        .gms-role-admin {
          background: #f8d7da;
          color: #721c24;
        }

        .gms-logout-btn {
          padding: 0.4rem 1rem;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .gms-logout-btn:hover {
          background: #c82333;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .gms-navbar {
            flex-wrap: wrap;
            padding: 1rem;
          }

          .gms-navbar-center {
            order: 3;
            width: 100%;
            justify-content: center;
            margin-top: 1rem;
            gap: 1rem;
          }

          .gms-nav-link {
            font-size: 0.9rem;
          }

          .gms-navbar-right {
            gap: 0.5rem;
          }

          .gms-user-id {
            font-size: 0.85rem;
          }

          .gms-role-badge {
            font-size: 0.8rem;
            padding: 0.3rem 0.8rem;
          }

          .gms-logout-btn {
            padding: 0.35rem 0.8rem;
            font-size: 0.85rem;
          }
        }
      `}</style>

      <nav className="gms-navbar">
        {/* LEFT */}
        <div className="gms-navbar-left">
          <h2 onClick={goHome} style={{ cursor: "pointer" }}>GMS</h2>
        </div>

        {/* CENTER */}
        <div className="gms-navbar-center">
          {user.role === "EMPLOYEE" && (
            <>
              <NavLink to="/employee" className="gms-nav-link">
                Home
              </NavLink>
              <NavLink to="/employee/profile" className="gms-nav-link">
                Profile
              </NavLink>
              <NavLink to="/employee/help" className="gms-nav-link">
                Help
              </NavLink>
              <NavLink to="/employee/legal-references" className="gms-nav-link">
  Legal Reference
</NavLink>
            </>
          )}

          {user.role === "OFFICER" && (
            <>
              <NavLink to="/officer" className="gms-nav-link">
                Home
              </NavLink>
              <NavLink to="/officer/profile" className="gms-nav-link">
                Profile
              </NavLink>
              <NavLink to="/officer/legal-references" className="gms-nav-link">
  Legal Reference
</NavLink>
            </>
          )}

          {user.role === "ADMIN" && (
            <>
              <NavLink to="/admin" className="gms-nav-link">
                Home
              </NavLink>
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="gms-navbar-right">
          <div className="gms-user-info">
            <span className="gms-user-id">{user.userNum}</span>
            <span
              className={`gms-role-badge ${
                user.role === "EMPLOYEE"
                  ? "gms-role-employee"
                  : user.role === "OFFICER"
                  ? "gms-role-officer"
                  : "gms-role-admin"
              }`}
            >
              {user.role || "USER"}
            </span>
          </div>

          <button className="gms-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;