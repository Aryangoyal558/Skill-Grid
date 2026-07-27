import React from 'react';
import { Link } from 'react-router-dom';
import './css/Dashboard.css';

const ExaminerDashboard = () => {
    return (
        <div className="examiner-layout">
            {/* Sidebar Navigation */}
            <nav className="sidebar">
                <img src="https://cdn-icons-png.flaticon.com/512/1162/1162846.png" alt="Logo" className="sidebar-logo" />
                
                <div className="nav-item active" title="Platform Overview">
                    <i className="fas fa-home"></i>
                </div>
                <div className="nav-item" title="User Management">
                    <i className="fas fa-users"></i>
                </div>
                <div className="nav-item" title="Assessments">
                    <i className="fas fa-file-alt"></i>
                </div>
                <div className="nav-item" title="Reports">
                    <i className="fas fa-chart-line"></i>
                </div>
                <div className="nav-item" title="Settings">
                    <i className="fas fa-cog"></i>
                </div>
                
                <div className="spacer"></div>
                
                <Link to="/login" className="nav-item" title="Logout">
                    <i className="fas fa-sign-out-alt"></i>
                </Link>
            </nav>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Platform Overview</h1>
                </header>

                {/* Top Statistics Row */}
                <div className="stats-row">
                    <div className="stat-card" style={{ backgroundColor: '#e0f2fe' }}>
                        <h3>Total Students</h3>
                        <h2>3,540+</h2>
                        <i className="fas fa-user-graduate stat-icon" style={{ color: '#0284c7' }}></i>
                    </div>
                    <div className="stat-card" style={{ backgroundColor: '#dcfce7' }}>
                        <h3>Active Assessments</h3>
                        <h2>15</h2>
                        <i className="fas fa-file-signature stat-icon" style={{ color: '#166534' }}></i>
                    </div>
                    <div className="stat-card" style={{ backgroundColor: '#fef9c3' }}>
                        <h3>Certificates Issued</h3>
                        <h2>1,920+</h2>
                        <i className="fas fa-certificate stat-icon" style={{ color: '#a16207' }}></i>
                    </div>
                    <div className="stat-card" style={{ backgroundColor: '#ffedd5' }}>
                        <h3>Question Bank</h3>
                        <h2>25,000+</h2>
                        <i className="fas fa-database stat-icon" style={{ color: '#c2410c' }}></i>
                    </div>
                </div>

                {/* Middle Grid */}
                <div className="dashboard-grid">
                    {/* Assessments Management */}
                    <div className="card">
                        <div className="card-header">
                            <h2>Assessments Management</h2>
                            <button className="btn-primary">Create New Assessment</button>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '30px' }}>
                            {/* Mock Bar Chart */}
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.85em', color: '#666', marginTop: 0 }}>Tests in Draft/Published</p>
                                <div className="chart-placeholder">
                                    <div className="bar" style={{ height: '40%' }}></div>
                                    <div className="bar alt" style={{ height: '70%' }}></div>
                                    <div className="bar" style={{ height: '50%' }}></div>
                                    <div className="bar alt" style={{ height: '90%' }}></div>
                                    <div className="bar" style={{ height: '60%' }}></div>
                                    <div className="bar alt" style={{ height: '80%' }}></div>
                                    <div className="bar" style={{ height: '45%' }}></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7em', color: '#999' }}>
                                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                </div>
                            </div>

                            {/* Quick View List */}
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.85em', color: '#666', marginTop: 0 }}>Quick View</p>
                                <div className="list-item">
                                    <div className="list-item-left">
                                        <img src="https://cdn-icons-png.flaticon.com/512/2965/2965306.png" alt="Draft" />
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '0.9em' }}>Tests in Draft:</div>
                                            <div style={{ fontSize: '0.8em', color: '#666' }}>17 student participants</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="list-item">
                                    <div className="list-item-left">
                                        <img src="https://cdn-icons-png.flaticon.com/512/1126/1126012.png" alt="React" />
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '0.9em' }}>React.js Advanced</div>
                                            <div style={{ fontSize: '0.8em', color: '#666' }}>21 student participants</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Question Bank Visual Summary */}
                    <div className="card">
                        <h2>Question Bank</h2>
                        <p style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>Visual summary of questions</p>
                        
                        <div className="chart-placeholder" style={{ height: '120px', gap: '10px', justifyContent: 'center' }}>
                            <div className="bar" style={{ height: '60%', backgroundColor: '#facc15' }}></div>
                            <div className="bar" style={{ height: '100%', backgroundColor: '#3b82f6' }}></div>
                            <div className="bar" style={{ height: '40%', backgroundColor: '#10b981' }}></div>
                            <div style={{ width: '20px' }}></div> {/* Spacer */}
                            <div className="bar" style={{ height: '30%', backgroundColor: '#fdba74' }}></div>
                            <div className="bar" style={{ height: '70%', backgroundColor: '#f97316' }}></div>
                            <div className="bar" style={{ height: '50%', backgroundColor: '#ef4444' }}></div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button className="btn-primary" style={{ flex: 1 }}>Add Question</button>
                            <button className="btn-primary" style={{ flex: 1, backgroundColor: '#f3f4f6', color: '#333' }}>Manage Categories</button>
                        </div>
                    </div>
                </div>

                {/* Bottom Grid */}
                <div className="dashboard-grid">
                    {/* Result Verification & Reports */}
                    <div className="card">
                        <h2>Result Verification & Reports</h2>
                        <div style={{ display: 'flex', gap: '30px', marginTop: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.85em', color: '#666', marginTop: 0, textAlign: 'center' }}>Candidate Performance Trends</p>
                                {/* Placeholder for Line Chart */}
                                <div style={{ height: '120px', borderBottom: '2px solid #ccc', borderLeft: '2px solid #ccc', position: 'relative' }}>
                                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <polyline points="0,80 20,60 40,70 60,30 80,50 100,20" fill="none" stroke="#3b82f6" strokeWidth="3" />
                                    </svg>
                                </div>
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <p style={{ fontSize: '0.85em', color: '#666', marginTop: 0 }}>Pass Rate by Category</p>
                                {/* CSS Pie Chart Mock */}
                                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'conic-gradient(#3b82f6 0% 40%, #10b981 40% 70%, #f59e0b 70% 100%)' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Right side Bottom stacked cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        
                        {/* Quick Verification */}
                        <div className="card" style={{ padding: '20px' }}>
                            <h2 style={{ fontSize: '1em' }}>Quick Certificate Verification</h2>
                            <div className="search-bar">
                                <input type="text" placeholder="Enter Certificate ID" />
                                <button><i className="fas fa-search"></i></button>
                            </div>
                        </div>

                        {/* User Management */}
                        <div className="card" style={{ padding: '20px', flex: 1 }}>
                            <h2 style={{ fontSize: '1em', marginBottom: '15px' }}>User Management</h2>
                            <div className="list-item" style={{ padding: '5px 0' }}>
                                <div className="list-item-left">
                                    <i className="fas fa-user-clock" style={{ color: '#3b82f6', fontSize: '1.2em' }}></i>
                                    <div style={{ fontSize: '0.85em', fontWeight: '600' }}>Quick activity</div>
                                </div>
                                <div style={{ fontSize: '0.85em' }}><strong>334</strong> user actively</div>
                            </div>
                            <div className="list-item" style={{ padding: '5px 0' }}>
                                <div className="list-item-left">
                                    <i className="fas fa-user-plus" style={{ color: '#f59e0b', fontSize: '1.2em' }}></i>
                                    <div style={{ fontSize: '0.85em', fontWeight: '600' }}>Pending registrations</div>
                                </div>
                                <div style={{ fontSize: '0.85em' }}><strong>30</strong> registrations</div>
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
};

export default ExaminerDashboard;