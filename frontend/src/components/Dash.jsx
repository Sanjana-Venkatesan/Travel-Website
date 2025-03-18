import React, { useState } from 'react';
import './styles/dash.css';
import Sidebar from './Sidebar';
import HistoricalSites from './Sites'
import Hotels from './Hotels';
import TravelTips from './Traveltips';
import TripPlanner from './TripPlanner';
import FaqContainer from './FaqContainer';
import TravelRecommendation from './Recommendation';

// Main Dashboard Layout
const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("historical-sites");

  // Render the appropriate component based on activeSection
  const renderContent = () => {
    switch (activeSection) {
      case "historical-sites":
        return <HistoricalSites />;
      case "hotels":
        return <Hotels />;
      case "travel-tips":
        return <TravelTips />;
      case "trip-planner":
        return <TripPlanner />;
      case "Faq":
        return <FaqContainer />
      case "Recommendation":
        return <TravelRecommendation />
      default:
        return <HistoricalSites />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;