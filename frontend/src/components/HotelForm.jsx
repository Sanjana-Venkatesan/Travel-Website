import { useState } from "react";

const HotelForm = ({ isEditing, handleSubmit, formData, handleInputChange, resetForm }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleForm = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={toggleForm}>
        {isEditing ? "Edit Hotel" : "Add New Hotel"}
      </button>

      {isVisible && (
        <div className="overlay">
          <div className="form-container">
            <h3>{isEditing ? "Edit Hotel" : "Add New Hotel"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price:</label>
                <input
                  type="text"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Rating:</label>
                <input
                  type="number"
                  name="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  className="form-control"
                  value={formData.rating}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL:</label>
                <input
                  type="text"
                  name="image"
                  className="form-control"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Amenities (comma separated):</label>
                <input
                  type="text"
                  name="amenities"
                  className="form-control"
                  value={formData.amenities}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="text"
                  name="contactInfo.phone"
                  className="form-control"
                  value={formData.contactInfo.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="contactInfo.email"
                  className="form-control"
                  value={formData.contactInfo.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Website:</label>
                <input
                  type="text"
                  name="contactInfo.website"
                  className="form-control"
                  value={formData.contactInfo.website}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                />
                <label>Available</label>
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Update Hotel" : "Add Hotel"}
                </button>
                {isEditing && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                )}
                <button type="button" className="btn btn-danger" onClick={toggleForm}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelForm;
