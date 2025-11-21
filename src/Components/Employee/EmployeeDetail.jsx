// Updated EmployeeDetail.jsx
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link, useLocation, Outlet } from 'react-router-dom'
import './EmployeeDetail.css'
import { 
  FaUser, 
  FaTachometerAlt, 
  FaMoneyBill, 
  FaCogs, 
  FaClipboardList, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaBell,
  FaCalendarAlt,
  FaFileAlt,
  FaIdCard
} from 'react-icons/fa'

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState({})
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    axios.get(`http://localhost:3000/employee/detail/${id}`)
      .then(result => setEmployee(result.data[0]))
      .catch(err => console.log(err))
  }, [id])

  const handleLogout = () => {
    axios.get('http://localhost:3000/employee/logout')
      .then(result => {
        if (result.data.Status) {
          localStorage.removeItem("valid")
          navigate('/')
        }
      }).catch(err => console.log(err))
  }

  const path = location.pathname

  return (
    <div className="emp-dashboard">
      {/* Modern Sidebar */}
      <div className="emp-sidebar">
        <h4>Employee Portal</h4>
        <ul className="nav flex-column">
          <li className={`nav-item ${path === `/employee_detail/${id}` ? 'active' : ''}`}>
            <Link to={`/employee_detail/${id}`} className="nav-link">
              <FaTachometerAlt className="me-2" /> Dashboard
            </Link>
          </li>
          <li className={`nav-item ${path === `/employee_detail/${id}/leave` ? 'active' : ''}`}>
            <Link to={`/employee_detail/${id}/leave`} className="nav-link">
              <FaClipboardList className="me-2" /> Leave Management
            </Link>
          </li>
          <li className={`nav-item ${path === `/employee-dashboard/setting/${id}` ? 'active' : ''}`}>
            <Link to={`/employee-dashboard/setting/${id}`} className="nav-link">
              <FaCogs className="me-2" /> Settings
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="emp-main">
        {/* Topbar */}
        <div className="emp-topbar">
          <div className="welcome-text_h">
           <h2 className="welcome-badge">Employee ID: #{employee.id}</h2>
          </div>
          <div className="topbar-actions">
            <button className="btn-notification">
              <FaBell />
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        {path === `/employee_detail/${id}` && (
          <div className="dashboard-content">
            {/* Welcome Card */}
            <div className="welcome-card">
              <div className="welcome-content">
                <div className="d-flex align-items-center">
                  
                  <div className="welcome-text">
                    <h5 className="mb-1 opacity-90">Welcome Back</h5>
                    <h2 className="mb-0 fw-bold">{employee.name}</h2>
                    <p className="mb-0 opacity-80">Have a productive day!</p>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Profile & Quick Actions Section */}
            <div className="profile-section">
              {/* Profile Card */}
              <div className="profile-card">
                <img
                  src={`http://localhost:3000/Images/${employee.image}`}
                  alt="Employee"
                  className="emp-photo"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/120x120/667eea/ffffff?text=EMP'
                  }}
                />
                <h5 className="fw-bold mb-2">{employee.name}</h5>
                <p className="text-muted mb-3">{employee.email}</p>
                
              </div>
            </div>
          </div>
        )}

        {/* Nested Routes */}
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default EmployeeDetail