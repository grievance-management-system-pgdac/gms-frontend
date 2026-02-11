import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

const OfficerLegalReferences = () => {
  const [legalRefs, setLegalRefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLegalReferences();
  }, []);

  const fetchLegalReferences = async () => {
    try {
      const res = await api.get("/legalrefs/all-legal-references");
      setLegalRefs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch legal references", error);
      setLegalRefs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">
        <h2>📚 Legal References</h2>

        {loading ? (
          <p>Loading legal references...</p>
        ) : legalRefs.length === 0 ? (
          <p className="empty-state">No legal references found</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Legal Ref No</th>
                <th>Category No</th>
                <th>Topic</th>
                <th>Act Name</th>
                <th>Legal Reference</th>
              </tr>
            </thead>
            <tbody>
              {legalRefs.map((ref) => (
                <tr key={ref.legRefsNum}>
                  <td>{ref.legRefsNum}</td>
                  <td>{ref.ctgnum}</td>
                  <td>{ref.topic}</td>
                  <td>{ref.actName}</td>
                  <td>{ref.legRef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OfficerLegalReferences;