import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Category.css";
import { FaBuilding, FaPlus, FaUsers, FaEdit, FaTrash } from "react-icons/fa";

const Category = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" department?`)) {
      axios.delete(`http://localhost:3000/auth/delete_category/${id}`)
        .then(result => {
          if (result.data.Status) {
            fetchCategories();
          } else {
            alert(result.data.Error);
          }
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <div className="category-container">
      {/* Header Section */}
      <div className="category-header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <FaBuilding />
            </div>
            <div className="header-text">
              <h1>Department Management</h1>
              <p>Manage your organization's departments and teams</p>
            </div>
          </div>
          <Link to="/dashboard/add_category" className="add-department-btn">
            <FaPlus className="btn-icon" />
            Add Department
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      

      {/* Departments Table */}
      <div className="departments-section">
        <div className="section-header">
          <h3>All Departments ({category.length})</h3>
          <button className="refresh-btn" onClick={fetchCategories}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading departments...</p>
          </div>
        ) : (
          <div className="table-container">
            {category.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaBuilding />
                </div>
                <h4>No Departments Found</h4>
                <p>Get started by creating your first department</p>
                <Link to="/dashboard/add_category" className="empty-btn">
                  <FaPlus className="btn-icon" />
                  Add Department
                </Link>
              </div>
            ) : (
              <div className="modern-table-wrapper">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>ID</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.map((c, index) => (
                      <tr key={c.id} className="department-row">
                        <td>
                          <div className="department-info">
                            <div className="dept-avatar">
                              <FaBuilding />
                            </div>
                            <div className="dept-details">
                              <span className="dept-name">{c.name}</span>
                              <span className="dept-meta">{index + 1} of {category.length}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="dept-id">DEPT-{c.id.toString().padStart(3, '0')}</span>
                        </td>
                        <td>
                          <span className="status-badge active">Active</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(c.id, c.name)}
                              title="Delete Department"
                            >
                              <FaTrash />
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
        )}
      </div>
    </div>
  );
};

export default Category;