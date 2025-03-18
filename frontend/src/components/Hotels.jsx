import React, { useState, useEffect } from 'react';
import './styles/hotel.css'
const HotelComponent = () => {
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    rating: 0,
    image: '',
    amenities: '',
    contactInfo: {
      phone: '',
      email: '',
      website: ''
    },
    isAvailable: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'form'
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };  
  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (hotel.description && hotel.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Fetch all hotels on component mount
  useEffect(() => {
    fetchHotels();
  }, []);

  // API calls
  const fetchHotels = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/hotel');
      if (!response.ok) throw new Error('Failed to fetch hotels');
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchHotelById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/hotel/${id}`);
      if (!response.ok) throw new Error('Failed to fetch hotel');
      const data = await response.json();
      setSelectedHotel(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const createHotel = async () => {
    try {
      // Convert amenities string to array
      const hotelData = {
        ...formData,
        amenities: formData.amenities.split(',').map(item => item.trim()),
      };

      const response = await fetch('http://localhost:3000/api/hotel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hotelData),
      });

      if (!response.ok) throw new Error('Failed to create hotel');
      
      setSuccess('Hotel created successfully');
      resetForm();
      fetchHotels();
      setActiveTab('list'); // Switch to list view after creating
    } catch (error) {
      setError(error.message);
    }
  };

  const updateHotel = async () => {
    try {
      // Convert amenities string to array if it's a string
      const amenitiesData = typeof formData.amenities === 'string' 
        ? formData.amenities.split(',').map(item => item.trim())
        : formData.amenities;
        
      const hotelData = {
        ...formData,
        amenities: amenitiesData,
      };

      const response = await fetch(`http://localhost:3000/api/hotel/${selectedHotel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hotelData),
      });

      if (!response.ok) throw new Error('Failed to update hotel');
      
      setSuccess('Hotel updated successfully');
      setIsEditing(false);
      resetForm();
      fetchHotels();
      setActiveTab('list'); // Switch to list view after updating
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteHotel = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/hotel/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete hotel');
      
      setSuccess('Hotel deleted successfully');
      setSelectedHotel(null);
      fetchHotels();
    } catch (error) {
      setError(error.message);
    }
  };

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'isAvailable' ? e.target.checked : value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateHotel();
    } else {
      createHotel();
    }
  };

  const handleEdit = (hotel) => {
    // Prepare amenities as a string for the form
    const amenitiesString = Array.isArray(hotel.amenities) ? hotel.amenities.join(', ') : '';
    
    setFormData({
      name: hotel.name,
      location: hotel.location,
      price: hotel.price,
      rating: hotel.rating,
      image: hotel.image || '',
      amenities: amenitiesString,
      contactInfo: {
        phone: hotel.contactInfo?.phone || '',
        email: hotel.contactInfo?.email || '',
        website: hotel.contactInfo?.website || ''
      },
      isAvailable: hotel.isAvailable
    });
    
    setSelectedHotel(hotel);
    setIsEditing(true);
    setActiveTab('form'); // Switch to form view when editing
  };

  const handleAddNewClick = () => {
    resetForm();
    setActiveTab('form');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      price: '',
      rating: 0,
      image: '',
      amenities: '',
      contactInfo: {
        phone: '',
        email: '',
        website: ''
      },
      isAvailable: true
    });
    setSelectedHotel(null);
    setIsEditing(false);
  };

  const handleCancelForm = () => {
    resetForm();
    setActiveTab('list');
  };

  // Group form fields for better organization
  const formFields = [
    { section: "Basic Information", fields: [
      { name: "name", label: "Hotel Name", type: "text", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "price", label: "Price", type: "text", required: true },
      { name: "rating", label: "Rating", type: "number", min: 0, max: 5, step: 0.1, required: true },
      { name: "isAvailable", label: "Available", type: "checkbox" },
    ]},
    { section: "Additional Information", fields: [
      { name: "image", label: "Image URL", type: "text" },
      { name: "amenities", label: "Amenities (comma separated)", type: "text" },
    ]},
    { section: "Contact Information", fields: [
      { name: "contactInfo.phone", label: "Phone", type: "text" },
      { name: "contactInfo.email", label: "Email", type: "email" },
      { name: "contactInfo.website", label: "Website", type: "text" },
    ]},
  ];

  // Clear messages after delay
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`}>⭐</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half-star">✨</span>);
    }
    
    return stars;
  };

  return (
    <div className="hotel-management-container">
      <header className="dashboard-header">
        <h1>Hotel Management System</h1>
        
        {/* Notification area */}
        <div className="notification-area">
          {error && <div className="notification error">{error}</div>}
          {success && <div className="notification success">{success}</div>}
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="navigation-tabs">
        <button 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Hotels List
        </button>
        <button 
          className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
          onClick={handleAddNewClick}
        >
          {isEditing ? "Edit Hotel" : "Add New Hotel"}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="content-area">
        {/* Hotel List Tab */}
        {activeTab === 'list' && (
          <div className="hotels-list-container">
            <div className="list-header">
              <h2>Available Hotels</h2>
              <button className="add-hotel-button" onClick={handleAddNewClick}>
                + Add New Hotel
              </button>
            </div>

            <div className="search-container">
            <input
            type="text"
            placeholder=" Search hotels by name, location, or description..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"/>
            </div>

            
            {filteredHotels.length === 0? (
              <div className="empty-state">
                <div className="empty-icon">🏨</div>
                <p>No hotels found. Add your first hotel to get started!</p>
                <button className="start-button" onClick={handleAddNewClick}>
                  Add Your First Hotel
                </button>
              </div>
            ) : (
              <div className="hotels-grid">
                {filteredHotels.map((hotel) => (
                  <div key={hotel.id} className="hotel-card">
                    <div className="card-header">
                      {hotel.isAvailable ? (
                        <span className="status available">Available</span>
                      ) : (
                        <span className="status unavailable">Not Available</span>
                      )}
                    </div>
                    
                    <div className="card-image">
                      {hotel.image ? (
                        <img src={hotel.image} alt={hotel.name} />
                      ) : (
                        <div className="placeholder-image">🏨</div>
                      )}
                    </div>
                    
                    <div className="card-content">
                      <h3>{hotel.name}</h3>
                      <p className="location">📍 {hotel.location}</p>
                      <p className="price">💰 {hotel.price}</p>
                      <div className="rating">{renderStars(hotel.rating)} ({hotel.rating})</div>
                    </div>
                    
                    <div className="card-actions">
                      <button onClick={() => fetchHotelById(hotel.id)}>
                        View Details
                      </button>
                      <button onClick={() => handleEdit(hotel)}>
                        Edit
                      </button>
                      <button onClick={() => deleteHotel(hotel.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hotel Form Tab */}
        {activeTab === 'form' && (
          <div className="hotel-form-container">
            <h2>{isEditing ? `Edit Hotel: ${formData.name}` : "Add New Hotel"}</h2>
            
            <form onSubmit={handleSubmit}>
              {formFields.map((section) => (
                <div key={section.section} className="form-section">
                  <h3>{section.section}</h3>
                  
                  <div className="form-section-fields">
                    {section.fields.map((field) => (
                      <div key={field.name} className={`form-field ${field.type === 'checkbox' ? 'checkbox-field' : ''}`}>
                        {field.type !== 'checkbox' && (
                          <label htmlFor={field.name}>{field.label}:</label>
                        )}
                        
                        {field.type === 'checkbox' ? (
                          <div className="checkbox-container">
                            <input
                              id={field.name}
                              type="checkbox"
                              name={field.name}
                              checked={formData.isAvailable}
                              onChange={handleInputChange}
                            />
                            <label htmlFor={field.name}>{field.label}</label>
                          </div>
                        ) : (
                          <input
                            id={field.name}
                            type={field.type}
                            name={field.name}
                            value={field.name.includes('.') 
                              ? formData[field.name.split('.')[0]][field.name.split('.')[1]] 
                              : formData[field.name]}
                            onChange={handleInputChange}
                            required={field.required}
                            min={field.min}
                            max={field.max}
                            step={field.step}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="form-actions">
                <button type="submit" className="primary-button">
                  {isEditing ? "Update Hotel" : "Add Hotel"}
                </button>
                <button type="button" className="secondary-button" onClick={handleCancelForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* Hotel Details Modal */}
      {selectedHotel && !isEditing && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedHotel.name}</h3>
              <button className="close-button" onClick={() => setSelectedHotel(null)}>
                ✖
              </button>
            </div>
            
            <div className="modal-body">
              <div className="hotel-detail-layout">
                <div className="hotel-detail-image">
                  {selectedHotel.image ? (
                    <img src={selectedHotel.image} alt={selectedHotel.name} />
                  ) : (
                    <div className="placeholder-detail-image">🏨</div>
                  )}
                  
                  <div className="quick-info">
                    <div className="badge-container">
                      {selectedHotel.isAvailable ? (
                        <span className="badge available">Available</span>
                      ) : (
                        <span className="badge unavailable">Not Available</span>
                      )}
                    </div>
                    <div className="detail-rating">
                      {renderStars(selectedHotel.rating)} ({selectedHotel.rating}/5)
                    </div>
                  </div>
                </div>
                
                <div className="hotel-detail-info">
                  <div className="info-section">
                    <h4>Basic Information</h4>
                    <p><strong>Location:</strong> {selectedHotel.location}</p>
                    <p><strong>Price:</strong> {selectedHotel.price}</p>
                  </div>

                  <div className="info-section">
                    <h4>Amenities</h4>
                    <ul>
                      {selectedHotel.amenities?.length > 0 ? (
                        selectedHotel.amenities.map((amenity, index) => (
                          <li key={index}>✅ {amenity}</li>
                        ))
                      ) : (
                        <p>No amenities listed.</p>
                      )}
                    </ul>
                  </div>

                  <div className="info-section">
                    <h4>Contact Information</h4>
                    <p><strong>Phone:</strong> {selectedHotel.contactInfo?.phone || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedHotel.contactInfo?.email || 'N/A'}</p>
                    <p>
                      <strong>Website:</strong>{' '}
                      {selectedHotel.contactInfo?.website ? (
                        <a href={selectedHotel.contactInfo.website} target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-button" onClick={() => setSelectedHotel(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelComponent;
