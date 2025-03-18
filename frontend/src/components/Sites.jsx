import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import './styles/sites.css';

const SiteManager = () => {
    // Core state
    const [sites, setSites] = useState([]);
    const [filteredSites, setFilteredSites] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        image: "",
        description: "",
        latitude: "",
        longitude: "",
        category: "park",
        rating: ""
    });
    
    // UI state
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [viewMode, setViewMode] = useState("grid");
    const [selectedSite, setSelectedSite] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [siteToDelete, setSiteToDelete] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });
    const [isLoading, setIsLoading] = useState(true);

    // Fetch sites on component mount
    useEffect(() => {
        fetchSites();
    }, []);

    // Filter and sort sites whenever dependencies change
    useEffect(() => {
        filterAndSortSites();
    }, [sites, searchTerm, filterCategory, sortBy, sortOrder]);

    // Show notification
    const showNotification = (message, type = "success") => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: "", type: "" });
        }, 3000);
    };

    // Filter and sort sites
    const filterAndSortSites = useCallback(() => {
        const filtered = sites.filter(site => {
            const matchesSearch = 
                site.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                site.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                site.description?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = filterCategory === "" || site.category === filterCategory;
            
            return matchesSearch && matchesCategory;
        });

        const sorted = [...filtered].sort((a, b) => {
            let comparison = 0;
            if (sortBy === "name") {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === "location") {
                comparison = a.location.localeCompare(b.location);
            } else if (sortBy === "rating") {
                comparison = (parseFloat(a.rating) || 0) - (parseFloat(b.rating) || 0);
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

        setFilteredSites(sorted);
    }, [sites, searchTerm, filterCategory, sortBy, sortOrder]);

    // Fetch sites from API
    const fetchSites = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/api/sites");
            setSites(response.data);
            setFilteredSites(response.data);
        } catch (error) {
            console.error("Error fetching sites:", error);
            showNotification("Failed to load sites. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Form handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            if (isEditing && selectedSite) {
                await axios.put(`http://localhost:3000/api/sites/${selectedSite.id}`, formData);
                showNotification(`"${formData.name}" has been updated successfully!`);
                setIsEditing(false);
                setSelectedSite(null);
            } else {
                await axios.post("http://localhost:3000/api/sites", formData);
                showNotification(`"${formData.name}" has been added successfully!`);
            }
            await fetchSites();
            resetForm();
            closeModal();
        } catch (error) {
            console.error("Error saving site:", error);
            showNotification(`Failed to save site: ${error.message}`, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            location: "",
            image: "",
            description: "",
            latitude: "",
            longitude: "",
            category: "park",
            rating: ""
        });
    };

    // Site operation handlers
    const handleDelete = async () => {
        if (!siteToDelete) return;
        
        setIsLoading(true);
        try {
            await axios.delete(`http://localhost:3000/api/sites/${siteToDelete.id}`);
            showNotification(`"${siteToDelete.name}" has been deleted.`);
            
            if (selectedSite && selectedSite.id === siteToDelete.id) {
                setSelectedSite(null);
            }
            
            await fetchSites();
        } catch (error) {
            console.error("Error deleting site:", error);
            showNotification(`Failed to delete site: ${error.message}`, "error");
        } finally {
            setIsLoading(false);
            setIsDeleteModalOpen(false);
            setSiteToDelete(null);
            unlockBodyScroll()
        }
    };

    const confirmDelete = (site) => {
        setSiteToDelete(site);
        setIsDeleteModalOpen(true);
    };

    const handleEdit = (site) => {
        setFormData({
            name: site.name || "",
            location: site.location || "",
            image: site.image || "",
            description: site.description || "",
            latitude: site.latitude || "",
            longitude: site.longitude || "",
            category: site.category || "park",
            rating: site.rating || ""
        });
        setSelectedSite(site);
        setIsEditing(true);
        setIsModalOpen(true);
        lockBodyScroll()
    };

    const handleViewSiteDetails = (site) => {
        setSelectedSite(site);
    };

    // UI control handlers
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const toggleViewMode = (mode) => {
        setViewMode(mode);
    };

    const lockBodyScroll = () => {
      document.body.classList.add('modal-open');
    };
    
    // Function to allow scrolling again
    const unlockBodyScroll = () => {
      document.body.classList.remove('modal-open');
    };

    const openAddSiteModal = () => {
      resetForm();
      setIsEditing(false);
      setIsModalOpen(true);
      lockBodyScroll(); // Add this line
    };
    
    // When closing any modal
    const closeModal = () => {
      setIsModalOpen(false);
      setIsEditing(false);
      resetForm();
      unlockBodyScroll(); // Add this line
    };

    const getCategoryClass = (category) => {
        return `category-${category?.replace(/\s+/g, "-") || "default"}`;
    };

    const renderSiteCard = (site) => {
        return (
            <div key={site.id} className={`site-card animate-fade-in ${selectedSite?.id === site.id ? 'site-card-selected' : ''}`}>
                <div className="site-card-overlay">
                    <div className="site-card-actions">
                        <button onClick={() => handleViewSiteDetails(site)} className="overlay-btn view-btn" aria-label="View details">
                            <span>👁️</span>
                        </button>
                        <button onClick={() => handleEdit(site)} className="overlay-btn edit-btn" aria-label="Edit site">
                            <span>✏️</span>
                        </button>
                        <button onClick={() => confirmDelete(site)} className="overlay-btn delete-btn" aria-label="Delete site">
                            <span>🗑️</span>
                        </button>
                    </div>
                </div>
                {site.image ? (
                    <img src={site.image} alt={site.name} className="site-image" loading="lazy" />
                ) : (
                    <div className="site-image-placeholder">
                        <span>{site.name?.charAt(0)?.toUpperCase() || "?"}</span>
                    </div>
                )}
                <div className="site-content">
                    <h3>{site.name}</h3>
                    <div className="site-meta">
                        <p><strong>Location:</strong> {site.location}</p>
                        <span className={`site-category ${getCategoryClass(site.category)}`}>
                            {site.category}
                        </span>
                        {site.rating && <span className="site-rating">{site.rating}/5</span>}
                    </div>
                    <button 
                        onClick={() => handleViewSiteDetails(site)} 
                        className="btn-primary full-width-btn"
                    >
                        View Details
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="site-manager-container">
            <header className="site-manager-header">
                <h2>Tourist Site Management</h2>
                <button onClick={openAddSiteModal} className="btn-primary add-site-btn">
                    <span>+</span> Add New Site
                </button>
            </header>
            
            <div className="search-filter-section">
                <div className="search-input">
                    <input 
                        type="text" 
                        placeholder="Search sites by name, location, or description..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                    {searchTerm && (
                        <button 
                            className="clear-search" 
                            onClick={() => setSearchTerm("")}
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}
                </div>
                <div className="filter-controls">
                    <select 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="category-select"
                    >
                        <option value="">All Categories</option>
                        <option value="park">Park</option>
                        <option value="monument">Monument</option>
                        <option value="museum">Museum</option>
                        <option value="historical site">Historical Site</option>
                    </select>
                    <div className="sort-controls">
                        <select value={sortBy} onChange={handleSortChange} className="sort-select">
                            <option value="name">Sort by Name</option>
                            <option value="location">Sort by Location</option>
                            <option value="rating">Sort by Rating</option>
                        </select>
                        <button 
                            onClick={toggleSortOrder} 
                            className="btn-neutral sort-direction"
                            aria-label={sortOrder === "asc" ? "Sort ascending" : "Sort descending"}
                        >
                            {sortOrder === "asc" ? "↑" : "↓"}
                        </button>
                    </div>
                    <div className="view-toggle">
                        <button 
                            className={viewMode === "grid" ? "active" : ""} 
                            onClick={() => toggleViewMode("grid")}
                            aria-label="Grid view"
                        >
                            Grid
                        </button>
                        <button 
                            className={viewMode === "list" ? "active" : ""} 
                            onClick={() => toggleViewMode("list")}
                            aria-label="List view"
                        >
                            List
                        </button>
                    </div>
                </div>
            </div>
            
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loader"></div>
                    <p>Loading...</p>
                </div>
            )}
            
            {selectedSite && (
                <div className="site-detail-overlay animate-fade-in">
                  <div className="site-detail-modal">
                    <div className="detail-header">
                        <h3>{selectedSite.name}</h3>
                     <button onClick={() => {
                         setSelectedSite(null);
                         unlockBodyScroll();
                        }} className="btn-neutral close-btn">
                         Close
                      </button>
                    </div>
                    <div className="detail-content">
                        {selectedSite.image ? (
                            <div className="detail-image">
                                <img src={selectedSite.image} alt={selectedSite.name} />
                            </div>
                        ) : (
                            <div className="detail-image-placeholder">
                                <span>{selectedSite.name?.charAt(0)?.toUpperCase() || "?"}</span>
                            </div>
                        )}
                        <div className="detail-info">
                            <div className="info-section">
                                <h4>Location</h4>
                                <p>{selectedSite.location}</p>
                            </div>
                            <div className="info-section">
                                <h4>Category</h4>
                                <span className={`site-category ${getCategoryClass(selectedSite.category)}`}>
                                    {selectedSite.category}
                                </span>
                            </div>
                            {selectedSite.rating && (
                                <div className="info-section">
                                    <h4>Rating</h4>
                                    <div className="star-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < Math.floor(selectedSite.rating) ? "star filled" : "star"}>★</span>
                                        ))}
                                        <span className="rating-value">{selectedSite.rating}/5</span>
                                    </div>
                                </div>
                            )}
                            {selectedSite.description && (
                                <div className="info-section">
                                    <h4>Description</h4>
                                    <p className="site-description">{selectedSite.description}</p>
                                </div>
                            )}
                            {selectedSite.latitude && selectedSite.longitude && (
                                <div className="info-section">
                                    <h4>Coordinates</h4>
                                    <div className="coordinates">
                                        <span>Latitude: {selectedSite.latitude}</span>
                                        <span>Longitude: {selectedSite.longitude}</span>
                                    </div>
                                </div>
                            )}
                            <div className="detail-actions">
                                <button onClick={() => handleEdit(selectedSite)} className="btn-secondary">
                                    Edit Site
                                </button>
                                <button onClick={() => confirmDelete(selectedSite)} className="btn-danger">
                                    Delete Site
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            )}
            
            <div className="sites-container">
                <div className="sites-header">
                    <h3>Sites ({filteredSites.length})</h3>
                    {sites.length > 0 && filteredSites.length === 0 && (
                        <button onClick={() => { setSearchTerm(""); setFilterCategory(""); }} className="btn-neutral reset-filters">
                            Reset Filters
                        </button>
                    )}
                                </div>
                <div className={`sites-list ${viewMode === "grid" ? "grid-view" : "list-view"}`}>
                    {filteredSites.length > 0 ? (
                        filteredSites.map(site => renderSiteCard(site))
                    ) : (
                        <p className="no-results">No sites found matching the criteria.</p>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{isEditing ? "Edit Site" : "Add New Site"}</h3>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Name:
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </label>
                            <label>
                                Location:
                                <input 
                                    type="text" 
                                    name="location" 
                                    value={formData.location} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </label>
                            <label>
                                Image URL:
                                <input 
                                    type="text" 
                                    name="image" 
                                    value={formData.image} 
                                    onChange={handleChange} 
                                />
                            </label>
                            <label>
                                Description:
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                ></textarea>
                            </label>
                            <label>
                                Latitude:
                                <input 
                                    type="number" 
                                    step="any" 
                                    name="latitude" 
                                    value={formData.latitude} 
                                    onChange={handleChange} 
                                />
                            </label>
                            <label>
                                Longitude:
                                <input 
                                    type="number" 
                                    step="any" 
                                    name="longitude" 
                                    value={formData.longitude} 
                                    onChange={handleChange} 
                                />
                            </label>
                            <label>
                                Category:
                                <select 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={handleChange} 
                                >
                                    <option value="park">Park</option>
                                    <option value="monument">Monument</option>
                                    <option value="museum">Museum</option>
                                    <option value="historical site">Historical Site</option>
                                </select>
                            </label>
                            <label>
                                Rating (1-5):
                                <input 
                                    type="number" 
                                    name="rating" 
                                    value={formData.rating} 
                                    onChange={handleChange} 
                                    min="1" 
                                    max="5" 
                                    step="0.1"
                                />
                            </label>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">
                                    {isEditing ? "Update Site" : "Add Site"}
                                </button>
                                <button type="button" onClick={closeModal} className="btn-neutral">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content delete-modal">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete "{siteToDelete?.name}"? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button onClick={handleDelete} className="btn-danger">Delete</button>
                            <button onClick={() => {
                             setIsDeleteModalOpen(false);
                             unlockBodyScroll(); // Add this
                            }} className="btn-neutral">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    <p>{notification.message}</p>
                </div>
            )}
        </div>
    );
};

export default SiteManager;
