import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

const LegalReferenceList = () => {
    const [references, setReferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get the grievance number passed from the dashboard
    // const targetGrvnNum = location.state?.grvnNum;

    // useEffect(() => {
    //     if (!targetGrvnNum) {
    //         alert("No grievance selected. Redirecting...");
    //         navigate("/officer");
    //         return;
    //     }
    //     fetchLegalReferences();
    // }, [targetGrvnNum]);
    useEffect(() => {
    fetchLegalReferences();
}, []);


    const fetchLegalReferences = async () => {
        try {
            const res = await api.get("/legal-references"); // Adjust endpoint as needed
            setReferences(res.data);
        } catch (err) {
            console.error("Error fetching legal references:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (refId) => {
        try {
            const payload = {
                grvnNum: targetGrvnNum,
                refId: refId
            };
            // This endpoint should insert into grievances_legalrefs table 
            await api.post(`/officer/grievances/apply-legal-ref`, payload);
            alert(`Legal Reference ${refId} applied to Grievance ${targetGrvnNum}`);
        } catch (err) {
            alert("Failed to apply legal reference.");
        }
    };

    return (
        <div className="container">
            <h2>Legal References for Grievance: {targetGrvnNum}</h2>
            {loading ? <p>Loading...</p> : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Ref ID</th>
                            <th>Section</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {references.map((ref) => (
                            <tr key={ref.refId}>
                                <td>{ref.refId}</td>
                                <td>{ref.sectionName}</td>
                                <td>{ref.description}</td>
                                <td>
                                    <button 
                                        className="btn-primary" 
                                        onClick={() => handleApply(ref.refId)}
                                    >
                                        Apply
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LegalReferenceList;