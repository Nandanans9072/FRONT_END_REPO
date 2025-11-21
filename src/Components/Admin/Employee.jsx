import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Employee.css";

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      axios.delete('http://localhost:3000/auth/delete_employee/'+id)
      .then(result => {
          if(result.data.Status) {
              fetchEmployees();
          } else {
              alert(result.data.Error);
          }
      })
      .catch(err => console.log(err));
    }
  };

  const filteredEmployees = employee.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(salary);
  };

  if (loading) {
    return (
      <div className="employee-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-container">
      <div className="employee-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Employee Management</h1>
            <p>Manage your team members and their information</p>
          </div>
          <Link to="/dashboard/add_employee" className="add-employee-btn">
            <i className="bi bi-person-plus"></i>
            Add Employee
          </Link>
        </div>
      </div>

      <div className="employee-content">
        
        
        {/* Search and Filters */}
        <div className="search-section">
          <div className="search-box">
            
            <input
              type="text"
              placeholder="Search employees by name, email, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
        </div>

        {/* Employee Table */}
        <div className="table-container">
          <div className="table-header">
            <h3>Employee List ({filteredEmployees.length})</h3>
            <div className="table-actions">
              <button className="refresh-btn" onClick={fetchEmployees}>
                <i className="bi bi-arrow-clockwise"></i>
                Refresh
              </button>
            </div>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="no-data">
              <i className="bi bi-people"></i>
              <h4>No employees found</h4>
              <p>Try adjusting your search or add a new employee</p>
              <Link to="/dashboard/add_employee" className="add-btn">
                Add Employee
              </Link>
            </div>
          ) : (
            <div className="modern-table-wrapper">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Salary</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((e) => (
                    <tr key={e.id} className="employee-row">
                      <td>
                        <div className="employee-info-cell">
                          <div className="employee-avatar">
                            {e.image ? (
                              <img
                                src={`http://localhost:3000/Images/` + e.image}
                                alt={e.name}
                                className="avatar-img"
                              />
                            ) : (
                              <div className="avatar-placeholder">
                                <i className="bi bi-person-circle"></i>
                              </div>
                            )}
                          </div>
                          <div className="employee-details">
                            <span className="employee-name">{e.name}</span>
                            <span className="employee-id">ID: {e.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <span className="email">{e.email}</span>
                          <span className="phone">{e.phone || "N/A"}</span>
                        </div>
                      </td>
                      <td>
                        <div className="address-info">
                          <span className="address">{e.address}</span>
                        </div>
                      </td>
                      <td>
                        <div className="salary-info">
                          <span className="salary-amount">{formatSalary(e.salary)}</span>
                          <span className="salary-period">/month</span>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/dashboard/edit_employee/` + e.id}
                            className="btn-edit"
                            title="Edit Employee"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(e.id, e.name)}
                            title="Delete Employee"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                          <button
                            className="btn-view"
                            onClick={() => navigate(`/dashboard/employee_detail/` + e.id)}
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employee;