import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./AddLeave.css";

const AddLeave = () => {
  const [values, setValues] = useState({
    employee_id: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setValues((prev) => ({ ...prev, employee_id: id }));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/employee/addleave", values);
      alert("Leave applied successfully!");
      navigate(`/employee_detail/${id}/leave`);
    } catch (err) {
      console.error(err);
      alert("Error submitting leave");
    }
  };

  return (
    <div className="add-leave-container">
      <h2>Apply for Leave</h2>
      <form onSubmit={handleSubmit} className="add-leave-form">
        <label>Employee ID:</label>
        <input
          type="text"
          name="employee_id"
          value={values.employee_id}
          onChange={(e) => setValues({ ...values, employee_id: e.target.value })}
          required
          readOnly
        />

        <label>Leave Type:</label>
        <input
          type="text"
          name="leave_type"
          value={values.leave_type}
          onChange={(e) => setValues({ ...values, leave_type: e.target.value })}
          required
        />

        <label>From Date:</label>
        <input
          type="date"
          name="start_date"
          value={values.start_date}
          onChange={(e) => setValues({ ...values, start_date: e.target.value })}
          required
        />

        <label>To Date:</label>
        <input
          type="date"
          name="end_date"
          value={values.end_date}
          onChange={(e) => setValues({ ...values, end_date: e.target.value })}
          required
        />

        <label>Description:</label>
        <textarea
          name="reason"
          value={values.reason}
          onChange={(e) => setValues({ ...values, reason: e.target.value })}
          required
        />

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddLeave;
