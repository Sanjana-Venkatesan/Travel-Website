import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Hotel, BookOpen, Map, Github, Mail, LogOut } from 'lucide-react';
import './styles/Sidebar.css';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate();

  const navItems = [
    { id: "historical-sites", icon: <Landmark size={18} />, label: "Sites & Landmarks" },
    { id: "hotels", icon: <Hotel size={18} />, label: "Hotels" },
    { id: "travel-tips", icon: <BookOpen size={18} />, label: "Travel Tips" },
    { id: "trip-planner", icon: <Map size={18} />, label: "Trip Planner" },
    { id: "Faq", icon: <Map size={18} />, label: "Faq" },
    { id: "Recommendation", icon: <Map size={18} />, label: "Try Recommendations" }
  
  ];

  const handleLogout = () => {
    localStorage.removeItem("travelTipsUsername")
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <span className="logo-icon">✈️</span>
          <h1 className="logo-text">Travel Explorer</h1>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? "active" : ""}`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <h3 className="footer-heading">Connect With Us</h3>
        <div className="footer-links">
          <a 
            href="https://github.com/yourusername/travel-explorer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>
          <a 
            href="mailto:youremail@example.com"
            className="footer-link"
          >
            <Mail size={16} />
            <span>Contact</span>
          </a>
        </div>

        {/* Logout Button */}
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
