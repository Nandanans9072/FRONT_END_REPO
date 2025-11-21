import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [image, setImage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLink, setActiveLink] = useState("dashboard");
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalAdmins: 0,
    totalSalary: 0,
    pendingLeaves: 0
  });
  const [employeeStats, setEmployeeStats] = useState({
    totalEmployees: 0,
    totalSalary: 0,
    activeEmployees: 0
  });
  const navigate = useNavigate();
  
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/employee') || path.includes('/add_employee') || path.includes('/edit_employee')) {
      setActiveLink('employee');
    } else if (path.includes('Category')) setActiveLink('category');
    else if (path.includes('leaves')) setActiveLink('leaves');
    else if (path.includes('setting')) setActiveLink('setting');
    else setActiveLink('dashboard');

    fetchDashboardStats();
    fetchEmployeeStats(); // Add this line
  }, []);

  const fetchDashboardStats = () => {
    // Keep your existing mock data or replace with API calls
    setStats({
      totalEmployees: 124,
      totalAdmins: 8,
      totalSalary: 284500,
      pendingLeaves: 12
    });
  };

  // Add this function to fetch real employee data
  const fetchEmployeeStats = () => {
    axios.get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          const employees = result.data.Result;
          const totalSalary = employees.reduce((total, emp) => total + parseInt(emp.salary || 0), 0);
          
          setEmployeeStats({
            totalEmployees: employees.length,
            totalSalary: totalSalary,
            activeEmployees: employees.length // You can modify this based on your status field
          });

          // Update the main stats with real employee data
          setStats(prevStats => ({
            ...prevStats,
            totalEmployees: employees.length,
            totalSalary: totalSalary
          }));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
      .then(result => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate('/');
        }
      });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavClick = (link) => {
    setActiveLink(link);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Add function to handle stat card clicks
  const handleStatCardClick = (type) => {
    if (type === 'employees') {
      navigate('/dashboard/employee');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar - No changes needed here */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="brand-wrapper">
            <div className="logo">
              <i className="bi bi-building"></i>
            </div>
            {sidebarOpen && (
              <div className="brand-content">
                <h3 className="brand-title">EmployeeMS</h3>
                <span className="brand-subtitle">Admin Portal</span>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className={`bi ${sidebarOpen ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
          </button>
        </div>

        {/* Profile Section */}
        <div className="sidebar-profile">
          <div className="profile-content">
            <label htmlFor="uploadImage" className="profile-image-container">
              {image ? (
                <img src={image} alt="Profile" className="profile-image" />
              ) : (
                <div className="profile-avatar">
                  <i className="bi bi-person-circle"></i>
                </div>
              )}
            </label>
            <input
              type="file"
              id="uploadImage"
              accept="image/*"
              onChange={handleImageUpload}
              className="d-none"
            />
            {sidebarOpen && (
              <div className="profile-info">
                <h5 className="profile-name">Admin User</h5>
                <span className="profile-role">Administrator</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link 
                to="/dashboard" 
                className={`nav-link ${activeLink === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavClick('dashboard')}
              >
                <div className="nav-icon">
                  <i className="bi bi-speedometer2"></i>
                </div>
                {sidebarOpen && <span className="nav-text">Dashboard</span>}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/dashboard/employee" 
                className={`nav-link ${activeLink === 'employee' ? 'active' : ''}`}
                onClick={() => handleNavClick('employee')}
              >
                <div className="nav-icon">
                  <i className="bi bi-people"></i>
                </div>
                {sidebarOpen && <span className="nav-text">Employees</span>}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/dashboard/Category" 
                className={`nav-link ${activeLink === 'category' ? 'active' : ''}`}
                onClick={() => handleNavClick('category')}
              >
                <div className="nav-icon">
                  <i className="bi bi-building"></i>
                </div>
                {sidebarOpen && <span className="nav-text">Departments</span>}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/dashboard/leaves" 
                className={`nav-link ${activeLink === 'leaves' ? 'active' : ''}`}
                onClick={() => handleNavClick('leaves')}
              >
                <div className="nav-icon">
                  <i className="bi bi-calendar-check"></i>
                </div>
                {sidebarOpen && <span className="nav-text">Leaves</span>}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/dashboard/settings" 
                className={`nav-link ${activeLink === 'settings' ? 'active' : ''}`}
                onClick={() => handleNavClick('settings')}
              >
                <div className="nav-icon">
                  <i className="bi bi-gear"></i>
                </div>
                {sidebarOpen && <span className="nav-text">Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <div className="logout-icon">
              <i className="bi bi-box-arrow-right"></i>
            </div>
            {sidebarOpen && <span className="logout-text">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <i className="bi bi-list"></i>
            </button>
            <div className="breadcrumb">
              <span className="page-title capitalize">{activeLink}</span>
            </div>
          </div>
          
          <div className="topbar-right">
            <div className="user-actions">
              <button className="notification-btn">
                <i className="bi bi-bell"></i>
                <span className="notification-badge">3</span>
              </button>
            </div>
          </div>
        </header>

        <main className="content-area">
          <div className="content-wrapper">
            {activeLink === 'dashboard' ? (
              <div className="dashboard-overview">
                {/* Updated Stats Grid with Real Employee Data */}
                <div className="stats-grid">
                  <div 
                    className="stat-card clickable" 
                    onClick={() => handleStatCardClick('employees')}
                    title="Click to view employees"
                  >
                    <div className="stat-icon employees">
                      <i className="bi bi-people-fill"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-info">
                        <h3>{employeeStats.totalEmployees}</h3>
                        <p>Total Employees</p>
                      </div>
                      <div className="stat-trend up">
                        <i className="bi bi-arrow-up"></i>
                        {employeeStats.totalEmployees > 0 ? 'Live' : '0%'}
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon admins">
                      <i className="bi bi-shield-check"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-info">
                        <h3>{stats.totalAdmins}</h3>
                        <p>Administrators</p>
                      </div>
                      <div className="stat-trend up">
                        <i className="bi bi-arrow-up"></i>
                        5%
                      </div>
                    </div>
                  </div>

                  <div 
                    className="stat-card clickable"
                    onClick={() => handleStatCardClick('salary')}
                    title="Click to view salary details"
                  >
                    <div className="stat-icon salary">
                      <i className="bi bi-cash-coin"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-info">
                        <h3>{formatCurrency(employeeStats.totalSalary)}</h3>
                        <p>Total Salary</p>
                      </div>
                      <div className="stat-trend up">
                        <i className="bi bi-arrow-up"></i>
                        Live
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon leaves">
                      <i className="bi bi-calendar-x"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-info">
                        <h3>{stats.pendingLeaves}</h3>
                        <p>Pending Leaves</p>
                      </div>
                      <div className="stat-trend up">
                        <i className="bi bi-arrow-up"></i>
                        8%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="main-dashboard-content">
                  <div className="dashboard-column main-column">
                    <div className="dashboard-card">
                      <div className="card-header">
                        <h3>Recent Employees</h3>
                        <button 
                          className="view-all-btn"
                          onClick={() => navigate('/dashboard/employee')}
                        >
                          View All
                        </button>
                      </div>
                      <div className="table-container">
                        <table className="modern-table">
                          <thead>
                            <tr>
                              <th>Employee</th>
                              <th>Department</th>
                              <th>Position</th>
                              <th>Status</th>
                              <th>Join Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <div className="employee-cell">
                                  <div className="avatar-sm">
                                    <i className="bi bi-person-circle"></i>
                                  </div>
                                  <div className="employee-info">
                                    <span className="name">John Smith</span>
                                    <span className="email">john@company.com</span>
                                  </div>
                                </div>
                              </td>
                              <td>Engineering</td>
                              <td>Senior Developer</td>
                              <td>
                                <span className="status-badge active">Active</span>
                              </td>
                              <td>2024-01-15</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="employee-cell">
                                  <div className="avatar-sm">
                                    <i className="bi bi-person-circle"></i>
                                  </div>
                                  <div className="employee-info">
                                    <span className="name">Sarah Johnson</span>
                                    <span className="email">sarah@company.com</span>
                                  </div>
                                </div>
                              </td>
                              <td>Marketing</td>
                              <td>Marketing Manager</td>
                              <td>
                                <span className="status-badge active">Active</span>
                              </td>
                              <td>2024-02-01</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="employee-cell">
                                  <div className="avatar-sm">
                                    <i className="bi bi-person-circle"></i>
                                  </div>
                                  <div className="employee-info">
                                    <span className="name">Mike Chen</span>
                                    <span className="email">mike@company.com</span>
                                  </div>
                                </div>
                              </td>
                              <td>HR</td>
                              <td>HR Specialist</td>
                              <td>
                                <span className="status-badge on-leave">On Leave</span>
                              </td>
                              <td>2023-11-20</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-column side-column">
                    <div className="dashboard-card">
                      <div className="card-header">
                        <h3>Quick Actions</h3>
                      </div>
                      <div className="quick-actions">
                        <button 
                          className="action-btn"
                          onClick={() => navigate('/dashboard/add_employee')}
                        >
                          <i className="bi bi-person-plus"></i>
                          <span>Add Employee</span>
                        </button>
                        <button className="action-btn">
                          <i className="bi bi-cash-coin"></i>
                          <span>Process Salary</span>
                        </button>
                        <button className="action-btn">
                          <i className="bi bi-calendar-check"></i>
                          <span>Manage Leaves</span>
                        </button>
                        <button className="action-btn">
                          <i className="bi bi-graph-up"></i>
                          <span>View Reports</span>
                        </button>
                      </div>
                    </div>

                    <div className="dashboard-card">
                      <div className="card-header">
                        <h3>Department Summary</h3>
                      </div>
                      <div className="department-list">
                        <div className="department-item">
                          <span className="dept-name">Engineering</span>
                          <span className="dept-count">45 employees</span>
                        </div>
                        <div className="department-item">
                          <span className="dept-name">Marketing</span>
                          <span className="dept-count">28 employees</span>
                        </div>
                        <div className="department-item">
                          <span className="dept-name">Sales</span>
                          <span className="dept-count">32 employees</span>
                        </div>
                        <div className="department-item">
                          <span className="dept-name">HR</span>
                          <span className="dept-count">12 employees</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;