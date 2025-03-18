import React, { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import './styles/trip-plan.css';

const TripPlanner = () => {
  // Form state
  const [formData, setFormData] = useState({
    location: '',
    preferences: '',
    budget: 'Moderate',
    dates: '',
    interests: '',
    groupType: 'Solo traveler',
    transportation: 'Public transit',
    accommodation: 'Hotel',
    additionalInfo: ''
  });
  
  // Results state
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.location) {
      setError('Please enter a destination to continue.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:3000/api/generate', formData);
      setItinerary(response.data.itinerary);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle itinerary download as TXT
  const handleDownloadTxt = () => {
    if (!itinerary) return;
    
    const element = document.createElement('a');
    const file = new Blob([itinerary.replace(/<[^>]*>/g, '')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `travel_plan_${formData.location.replace(/[, ]+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPdf = () => {
    if (!itinerary) return;
  
    const element = document.createElement('div');
    element.innerHTML = `
      <h2>Travel Itinerary: ${formData.location}</h2>
      <p><strong>Destination:</strong> ${formData.location}</p>
      <p><strong>Dates:</strong> ${formData.dates || 'Not specified'}</p>
      <p><strong>Budget:</strong> ${formData.budget}</p>
      <p><strong>Group Type:</strong> ${formData.groupType}</p>
      <hr />
      <div>${itinerary}</div>
    `;
  
    html2pdf()
      .set({
        margin: 10,
        filename: `travel_plan_${formData.location.replace(/[, ]+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save();
  };

  // Save current itinerary
  const handleSaveItinerary = () => {
    if (!itinerary) return;
    
    const newSavedItem = {
      id: Date.now(),
      location: formData.location,
      dates: formData.dates,
      content: itinerary
    };
    
    setSavedItineraries([...savedItineraries, newSavedItem]);
    
    // Show confirmation toast
    alert('Itinerary saved! View it in your saved itineraries.');
  };
  
  // Load a saved itinerary
  const loadSavedItinerary = (saved) => {
    setItinerary(saved.content);
    setShowSaved(false);
    window.scrollTo(0, document.querySelector('.trip-planner-results').offsetTop);
  };
  
  // Delete a saved itinerary
  const deleteSavedItinerary = (id) => {
    setSavedItineraries(savedItineraries.filter(item => item.id !== id));
  };

  return (
    <div className="trip-planner-container">
      {/* Header */}
      <div className="trip-planner-header">
        <h2 className="main-header">✈️ Trip Planner Crew 🌍</h2>
        <p className="description">
          Generate a personalized travel itinerary with our AI-powered planner. 
          Get detailed day-by-day plans tailored to your preferences, budget, and travel style.
        </p>
        
        {/* Added navigation buttons */}
        <div className="nav-buttons">
          <button 
            className={`nav-button ${!showSaved ? 'active' : ''}`} 
            onClick={() => setShowSaved(false)}
          >
            🗺️ Plan New Trip
          </button>
          <button 
            className={`nav-button ${showSaved ? 'active' : ''}`} 
            onClick={() => setShowSaved(true)}
          >
            📚 Saved Itineraries ({savedItineraries.length})
          </button>
        </div>
      </div>
      
      {/* Saved Itineraries Section */}
      {showSaved ? (
        <div className="saved-itineraries">
          <h3 className="sub-header">📚 Your Saved Itineraries</h3>
          
          {savedItineraries.length === 0 ? (
            <div className="empty-state">
              <p>You haven't saved any itineraries yet. Generate and save an itinerary to see it here.</p>
            </div>
          ) : (
            <div className="saved-grid">
              {savedItineraries.map(item => (
                <div key={item.id} className="saved-card">
                  <h4>{item.location}</h4>
                  <p>{item.dates}</p>
                  <div className="saved-actions">
                    <button onClick={() => loadSavedItinerary(item)}>View</button>
                    <button onClick={() => deleteSavedItinerary(item.id)} className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Main Form */}
          <div className="trip-planner-form-container">
            <h3 className="sub-header">🗺️ Plan Your Adventure</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="location">🌎 Destination</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="France, Paris"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="preferences">🎯 Travel Preferences</label>
                    <input
                      type="text"
                      id="preferences"
                      name="preferences"
                      placeholder="Historical sites, museums, local cuisine"
                      value={formData.preferences}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="budget">💰 Budget Range</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                    >
                      <option value="Budget-friendly">Budget-friendly</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Ultra-luxury">Ultra-luxury</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="transportation">🚌 Transportation</label>
                    <select
                      id="transportation"
                      name="transportation"
                      value={formData.transportation}
                      onChange={handleInputChange}
                    >
                      <option value="Public transit">Public transit</option>
                      <option value="Rental car">Rental car</option>
                      <option value="Walking/biking">Walking/biking</option>
                      <option value="Combination">Combination</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="dates">📅 Travel Dates/Duration</label>
                    <input
                      type="text"
                      id="dates"
                      name="dates"
                      placeholder="7 days in June 2025"
                      value={formData.dates}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="interests">🎭 Special Interests</label>
                    <input
                      type="text"
                      id="interests"
                      name="interests"
                      placeholder="Art, photography, adventure sports"
                      value={formData.interests}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="groupType">👫 Travel Group</label>
                    <select
                      id="groupType"
                      name="groupType"
                      value={formData.groupType}
                      onChange={handleInputChange}
                    >
                      <option value="Solo traveler">Solo traveler</option>
                      <option value="Couple">Couple</option>
                      <option value="Family with kids">Family with kids</option>
                      <option value="Group of friends">Group of friends</option>
                      <option value="Business trip">Business trip</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="accommodation">🏨 Accommodation</label>
                    <select
                      id="accommodation"
                      name="accommodation"
                      value={formData.accommodation}
                      onChange={handleInputChange}
                    >
                      <option value="Hotel">Hotel</option>
                      <option value="Hostel">Hostel</option>
                      <option value="Apartment/Airbnb">Apartment/Airbnb</option>
                      <option value="Resort">Resort</option>
                      <option value="Camping">Camping</option>
                      <option value="Mix of accommodations">Mix of accommodations</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="additionalInfo">📝 Additional Information</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  placeholder="Any dietary restrictions, accessibility needs, or specific must-see attractions?"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                />
              </div>
              
              <button type="submit" className="generate-button" disabled={loading}>
                {loading ? '✨ Creating Itinerary...' : '🚀 Generate Travel Itinerary'}
              </button>
            </form>
            
            {error && <div className="error-message">{error}</div>}
          </div>
        </>
      )}
      
      {/* Results Section */}
      {itinerary && (
        <div className="trip-planner-results">
          <h3 className="sub-header">🎉 Your Travel Itinerary</h3>
          <div className="plan-container">
            <div dangerouslySetInnerHTML={{ __html: itinerary }} />
          </div>
          
          <div className="action-buttons">
            <button onClick={handleSaveItinerary} className="save-button">
              💾 Save This Itinerary
            </button>
            <div className="download-options">
              <button onClick={handleDownloadTxt} className="download-button">
                📄 Download as TXT
              </button>
              <button onClick={handleDownloadPdf} className="download-button">
                📑 Download as PDF
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Tips Sidebar */}
      <div className="trip-planner-sidebar">
        <h3>💡 Quick Tips</h3>
        <ul>
          <li>Be specific about your travel preferences</li>
          <li>Include dietary restrictions if applicable</li>
          <li>Specify if you prefer public transit or driving</li>
          <li>Mention any mobility considerations</li>
          <li>Save your itineraries to revisit them later</li>
          <li>Download as PDF for better formatting</li>
        </ul>
        
        {/* Weather forecast section */}
        {formData.location && (
          <div className="weather-preview">
            <h3>🌤️ Weather Forecast</h3>
            <p>Weather data for {formData.location} will appear here when generated. This requires API integration.</p>
            <button className="small-button">Check Weather</button>
          </div>
        )}
        
        {/* Language phrases section */}
        {formData.location && (
          <div className="language-phrases">
            <h3>🗣️ Useful Phrases</h3>
            <p>Language phrases for {formData.location} will appear here when generated.</p>
            <button className="small-button">Get Phrases</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlanner;