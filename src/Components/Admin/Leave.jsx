  import { useEffect, useState } from "react";
  import axios from "axios";
  import "./Leave.css";
  import { 
    FaUmbrellaBeach, FaSearch, FaFilter,
    FaCalendarAlt, FaClock, FaCheckCircle,
    FaTimesCircle, FaHourglassHalf
  } from "react-icons/fa";

  const Leave = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
      fetchLeaves();
    }, []);

    const fetchLeaves = () => {
      setLoading(true);
      axios
        .get("http://localhost:3000/auth/leaves")
        .then((result) => {
          if (result.data.Status) {
            setLeaves(result.data.Result);
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    };

    const filteredLeaves = leaves.filter(leave => {
      const matchesSearch = (leave.leave_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.description?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "all" || leave.status?.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const getStatusIcon = (status) => {
      switch (status?.toLowerCase()) {
        case 'approved':
          return <FaCheckCircle />;
        case 'rejected':
          return <FaTimesCircle />;
        default:
          return <FaHourglassHalf />;
      }
    };

    const getStatusCount = (status) => {
      return leaves.filter(leave => leave.status?.toLowerCase() === status).length;
    };

    const safeDate = (dateStr) => {
      return dateStr && !isNaN(new Date(dateStr)) ?
        new Date(dateStr).toLocaleDateString() : "N/A";
    };

    const daysBetween = (from, to) => {
      if (!from || !to) return "N/A";
      const start = new Date(from), end = new Date(to);
      if (isNaN(start) || isNaN(end)) return "N/A";
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    };


  const handleStatusChange = async (leaveId, status) => {
    try {
      await axios.patch(`http://localhost:3000/auth/update_leave_status/${leaveId}`, { status });
      setLeaves(leaves.map(l =>
        l.id === leaveId
          ? { ...l, status }
          : l
      ));
      alert(`Leave marked as ${status}`);
    } catch (err) {
      alert('Failed to update status!');
      console.error(err);
    }
  };


    if (loading) {
      return (
        <div className="leave-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading leave requests...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="leave-container">
        {/* Header Section */}
        <div className="leave-header">
          <div className="header-content">
            <div className="header-info">
              <div className="header-icon"><FaUmbrellaBeach /></div>
              <div className="header-text">
                <h1>Leave Management</h1>
                <p>Manage and track employee leave requests</p>
              </div>
            </div>
            <button className="refresh-btn" onClick={fetchLeaves}>Refresh</button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon total"><FaUmbrellaBeach /></div>
            <div className="stat-info">
              <h3>{leaves.length}</h3>
              <p>Total Requests</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending"><FaHourglassHalf /></div>
            <div className="stat-info">
              <h3>{getStatusCount('pending')}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon approved"><FaCheckCircle /></div>
            <div className="stat-info">
              <h3>{getStatusCount('approved')}</h3>
              <p>Approved</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon rejected"><FaTimesCircle /></div>
            <div className="stat-info">
              <h3>{getStatusCount('rejected')}</h3>
              <p>Rejected</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by leave type or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-options">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="filter-btn">
              <FaFilter /> More Filters
            </button>
          </div>
        </div>

        {/* Leaves Table */}
        <div className="leaves-section">
          <div className="section-header">
            <h3>Leave Requests ({filteredLeaves.length})</h3>
          </div>
          <div className="table-container">
            {filteredLeaves.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><FaUmbrellaBeach /></div>
                <h4>No Leave Requests Found</h4>
                <p>No leave requests match your current filters</p>
                <button 
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >Clear Filters</button>
              </div>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Duration</th>
                    <th>Description</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map(leave => (
                    <tr key={leave.id} className="leave-row">
                      <td>
                        <div className="employee-info">
                          <div className="employee-avatar">
                            {leave.employee_name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="employee-details">
                            <span className="employee-name">{leave.employee_name || 'Unknown'}</span>
                            <span className="employee-id">ID: {leave.employee_id || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="type-badge">{leave.leave_type || "N/A"}</span>
                      </td>
                      <td>
                        <div className="duration-info">
                          <div className="date-range">
                            <FaCalendarAlt className="date-icon" />
                            {safeDate(leave.start_date)}
                          </div>
                          <div className="to-text">to</div>
                          <div className="date-range">
                            {safeDate(leave.end_date)}
                          </div>
                          <div className="days-count">
                            {daysBetween(leave.start_date, leave.end_date)} days
                          </div>
                        </div>
                      </td>
                      <td>
                        {leave.description ? (
                          <div className="description-content" title={leave.description}>{leave.description}</div>
                        ) : <span className="no-description">No description</span>}
                      </td>
                      <td>
                        <div className="applied-date">
                          <FaClock className="clock-icon" />
                          {safeDate(leave.applied_date)}
                        </div>
                      </td>
                      <td>
                        <div className={`status-badge ${leave.status?.toLowerCase()}`}>
                          {getStatusIcon(leave.status)}
                          <span>{leave.status || "N/A"}</span>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {leave.status?.toLowerCase() === 'pending' && (
                            <>
                              <button
                                className="btn-approve"
                                title="Approve Leave"
                                onClick={() => handleStatusChange(leave.id, 'approved')}
                              >
                                <FaCheckCircle />
                              </button>
                              <button
                                className="btn-reject"
                                title="Reject Leave"
                                onClick={() => handleStatusChange(leave.id, 'rejected')}
                              >
                                <FaTimesCircle />
                              </button>
                            </>
                          )}
                          <button className="btn-view" title="View Details">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default Leave;
