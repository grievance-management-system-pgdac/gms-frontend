import Navbar from "../components/Navbar";

const EmployeeHelp = () => {
  return (
    <>
      <Navbar />

      {/* ✅ PAGE STYLES (SAME FILE) */}
      <style>{`
        .help-container {
          max-width: 1100px;
          margin: 30px auto;
          padding: 30px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .help-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .help-subtitle {
          color: #555;
          margin-bottom: 20px;
        }

        .help-basic ul {
          margin-left: 20px;
          margin-bottom: 30px;
        }

        .help-basic li {
          margin-bottom: 6px;
        }

        .help-steps {
          margin-top: 20px;
        }

        .help-steps h3 {
          font-size: 22px;
          margin-bottom: 20px;
          border-bottom: 2px solid #eaeaea;
          padding-bottom: 8px;
        }

        .step {
          background: #f9fafc;
          border-left: 5px solid #2b6ef3;
          padding: 16px 18px;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .step h4 {
          margin: 0 0 6px;
          font-size: 16px;
          color: #2b6ef3;
        }

        .step p {
          margin: 0;
          color: #333;
          line-height: 1.6;
        }

        .step ul {
          margin-top: 8px;
          margin-left: 20px;
        }

        .step ul li {
          margin-bottom: 5px;
        }
      `}</style>

      <div className="help-container">
        <h2 className="help-title">Employee Help</h2>


        {/* ✅ STEP BY STEP GUIDE */}
        <div className="help-steps">
          <h3>Grievance Management Process</h3>

          <div className="step">
            <h4>Step 1: Employee Login</h4>
            <p>
              Employee logs in using registered employee number and password.
              System verifies credentials and redirects to the Employee Dashboard.
            </p>
          </div>

          <div className="step">
            <h4>Step 2: File New Grievance</h4>
            <p>
              Click on “File Grievance / New Grievance” from the dashboard to open
              the grievance submission form.
            </p>
          </div>

          <div className="step">
            <h4>Step 3: Select Grievance Category</h4>
            <p>Select the appropriate grievance type:</p>
            <ul>
              <li>Workplace Harassment</li>
              <li>Salary / Payroll Issue</li>
              <li>Leave / Attendance Issue</li>
              <li>Work Environment / Safety</li>
              <li>Promotion / Appraisal Issue</li>
              <li>IT / Infrastructure Issue</li>
              <li>Other</li>
            </ul>
          </div>

          <div className="step">
            <h4>Step 4: Enter Grievance Details</h4>
            <p>
              Enter grievance title, description, date of occurrence, and
              department/person involved (if applicable).
            </p>
          </div>

          <div className="step">
            <h4>Step 5: Attach Supporting Documents (Optional)</h4>
            <p>
              Upload screenshots, emails, PDFs, or images as supporting evidence.
            </p>
          </div>

          <div className="step">
            <h4>Step 6: Submit Grievance</h4>
            <p>
              System generates a unique grievance ID, stores details securely,
              and sets status as <b>Submitted</b>.
            </p>
          </div>

          <div className="step">
            <h4>Step 7: Track Grievance Status</h4>
            <p>
              View grievance progress under “My Grievances” with status updates
              like Submitted, Under Review, In Investigation, Resolved, or Closed.
            </p>
          </div>

          <div className="step">
            <h4>Step 8: Respond to Officer Queries</h4>
            <p>
              If clarification is required, add comments or upload additional
              documents.
            </p>
          </div>

          <div className="step">
            <h4>Step 9: Resolution Notification</h4>
            <p>
              Employee receives notification once grievance is resolved and can
              view resolution details.
            </p>
          </div>

          <div className="step">
            <h4>Step 10: Appeal (Optional)</h4>
            <p>
              If unsatisfied, employee can raise an appeal. Status becomes
              <b> Appeal in Progress</b>.
            </p>
          </div>

          <div className="step">
            <h4>Step 11: Final Decision</h4>
            <p>
              Higher authority reviews the appeal and records final decision.
              Status becomes <b>Closed</b>.
            </p>
          </div>

          <div className="step">
            <h4>Step 12: Feedback Submission</h4>
            <p>
              Employee submits feedback on response time, fairness, and overall
              satisfaction.
            </p>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default EmployeeHelp;