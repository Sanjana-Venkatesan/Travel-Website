import { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHeart, FaComment, FaPlane, FaMoneyBillWave, FaShieldAlt, FaGlobeAmericas, FaInfoCircle, FaUser, FaStar } from 'react-icons/fa';

const Tips = () => {
  const [tips, setTips] = useState([]);
  const [newTip, setNewTip] = useState({ 
    title: "", 
    category: "Preparation", 
    content: "", 
    importance: 3,
    username: ""
  });
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");
  const [selectedTip, setSelectedTip] = useState(null);
  const [showUsernameModal, setShowUsernameModal] = useState(true);
  // Add state for filters
const [categoryFilter, setCategoryFilter] = useState("All Categories");
const [sortOrder, setSortOrder] = useState("Newest First");
const [searchQuery, setSearchQuery] = useState("");
const [expandedTips, setExpandedTips] = useState({})
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(4); // Show 4 tips per page (2 rows of 2)


const toggleExpanded = (tipId) => {
  setExpandedTips(prev => ({
    ...prev,
    [tipId]: !prev[tipId]
  }));
};

// Add filtered tips function
const getFilteredTips = () => {
  let filteredTips = [...tips];
  
  if (searchQuery.trim() !== "") {
    filteredTips = filteredTips.filter(tip => 
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Apply category filter
  if (categoryFilter !== "All Categories") {
    filteredTips = filteredTips.filter(tip => tip.category === categoryFilter);
  }
  
  // Apply sorting
  switch (sortOrder) {
    case "Most Liked":
      filteredTips.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      break;
    case "Highest Importance":
      filteredTips.sort((a, b) => parseInt(b.importance) - parseInt(a.importance));
      break;
    case "Newest First":
    default:
      filteredTips.sort((a, b) => b.id - a.id);
      break;
  }
  
  return filteredTips;
};

const getPaginatedTips = () => {
  const filteredTips = getFilteredTips();
  const indexOfLastTip = currentPage * itemsPerPage;
  const indexOfFirstTip = indexOfLastTip - itemsPerPage;
  return filteredTips.slice(indexOfFirstTip, indexOfLastTip);
};

const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fetch all tips
  useEffect(() => {
    axios.get("http://localhost:3000/api/tips")
      .then(res => setTips(res.data))
      .catch(err => console.error("Error fetching tips:", err));
      
    // Check for saved username
    const savedUsername = localStorage.getItem('travelTipsUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setNewTip(prev => ({ ...prev, username: username }));
      setShowUsernameModal(false);
    }
  }, []);

  // Reset to first page when filters change
useEffect(() => {
  setCurrentPage(1);
}, [searchQuery, categoryFilter, sortOrder]);

  // Handle Like
  const handleLike = (id) => {
    axios.post(`http://localhost:3000/api/tips/${id}/like`)
      .then(res => {
        setTips(tips.map(tip => tip.id === id ? { ...tip, likes: res.data.likes } : tip));
      })
      .catch(err => console.error("Error liking tip:", err));
  };

  // Handle Comment
  const handleComment = (id) => {
    if (!comment.trim()) return;
    
    axios.post(`http://localhost:3000/api/tips/${id}/comment`, { user: username || "Anonymous Traveler", comment })
      .then(res => {
        setTips(tips.map(tip => tip.id === id ? { ...tip, comments: res.data.comments } : tip));
        setComment("");
      })
      .catch(err => console.error("Error adding comment:", err));
  };

  // Handle New Tip Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/api/tips", {...newTip, username: username || "Anonymous Traveler"})
      .then(res => {
        setTips([...tips, res.data]);
        setNewTip({ title: "", category: "Preparation", content: "", importance: 3, username: username });
      })
      .catch(err => console.error("Error adding tip:", err));
  };

  // Handle username submission
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('travelTipsUsername', username);
    setNewTip(prev => ({ ...prev, username }));
    setShowUsernameModal(false);
  };

  // Get icon based on category
  const getCategoryIcon = (category) => {
    switch(category) {
      case "Preparation": return <FaPlane className="me-2" />;
      case "Finance": return <FaMoneyBillWave className="me-2" />;
      case "Security": return <FaShieldAlt className="me-2" />;
      case "Culture": return <FaGlobeAmericas className="me-2" />;
      case "General": return <FaInfoCircle className="me-2" />;
      default: return <FaInfoCircle className="me-2" />;
    }
  };

  // Get badge color based on importance
  const getImportanceColor = (importance) => {
    switch(parseInt(importance)) {
      case 1: return "bg-info bg-opacity-50";
      case 2: return "bg-info";
      case 3: return "bg-primary";
      case 4: return "bg-warning text-dark";
      case 5: return "bg-danger";
      default: return "bg-primary";
    }
  };

  // Get stars for importance rating display
  const getImportanceStars = (importance) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i < parseInt(importance) ? "text-warning" : "text-muted"} 
        />
      );
    }
    return stars;
  };

  return (
     <div className="container py-3 px-2 m-auto" style={{backgroundColor: "rgba(240, 247, 248, 0.5)"}}>
      {/* Username Modal */}
      {showUsernameModal && (
        <div className="modal d-block" style={{backgroundColor: "rgba(0,0,0,0.5)"}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{borderRadius: "15px", boxShadow: "0 15px 30px rgba(0,0,0,0.1)"}}>
              <div className="modal-header bg-info bg-opacity-25 text-dark border-0">
                <h5 className="modal-title">Welcome to InsightSpot!</h5>
              </div>
              <div className="modal-body p-4">
                <p className="text-muted mb-4">Choose a username to identify yourself or stay anonymous</p>
                <form onSubmit={handleUsernameSubmit}>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-light border-light">
                      <FaUser className="text-info" />
                    </span>
                    <input 
                      type="text" 
                      className="form-control bg-light border-light"
                      placeholder="Your traveler name (or leave blank to stay anonymous)" 
                      value={username} 
                      onChange={e => setUsername(e.target.value)} 
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-info text-white">
                      Start Exploring
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mb-5">
        <div className="col text-center">
          <div className="p-4 bg-info bg-opacity-25 rounded-3 shadow-sm mb-2">
            <h1 className="display-4 text-primary mb-0">
              <FaPlane className="me-3" />
              InsightSpot
            </h1>
          </div>
          <p className="lead text-muted">Share and discover the best travel advice from fellow adventurers</p>
          {username && (
            <div className="badge bg-info bg-opacity-50 text-dark p-2 mb-4">
              <FaUser className="me-2" /> 
              Traveling as: {username}
              <button 
                className="btn btn-sm btn-link text-dark ms-2 p-0" 
                onClick={() => setShowUsernameModal(true)}
              >
                Change
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add New Tip Card */}
      <div className="row justify-content-center">
  <div className="col-12 col-md-10 mb-5">
    <div className="card border-0 shadow-sm" style={{borderRadius: "15px", backgroundColor: "#fff"}}>
      <div className="card-header text-white border-0" 
        style={{borderRadius: "15px 15px 0 0", background: "linear-gradient(135deg, #6ab7d6 0%, #5773bd 100%)"}}>
        <h4 className="mb-0">Share Your Travel Wisdom</h4>
      </div>
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-6">
            <div className="col-md-6">
              <label className="form-label text-secondary">Tip Title</label>
              <input 
                type="text" 
                className="form-control bg-light border-light" 
                placeholder="E.g., Always pack a power bank" 
                value={newTip.title} 
                onChange={e => setNewTip({ ...newTip, title: e.target.value })} 
                required 
              />
            </div>
            <div className="col-md-3">
              <label className="form-label text-secondary">Category</label>
              <select 
                className="form-select bg-light border-light" 
                value={newTip.category} 
                onChange={e => setNewTip({ ...newTip, category: e.target.value })}
              >
                <option>Preparation</option>
                <option>Finance</option>
                <option>Security</option>
                <option>Culture</option>
                <option>General</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label text-secondary">Importance</label>
              <div className="d-flex align-items-center">
                <input 
                  type="range" 
                  className="form-range flex-grow-1" 
                  min="1" 
                  max="5" 
                  value={newTip.importance} 
                  onChange={e => setNewTip({ ...newTip, importance: e.target.value })} 
                />
                <div className="ms-2 d-flex">
                  {getImportanceStars(newTip.importance)}
                </div>
              </div>
            </div>
            <div className="col-12">
              <label className="form-label text-secondary">Your Experience</label>
              <textarea 
                className="form-control bg-light border-light" 
                rows="3" 
                placeholder="Share your travel advice..." 
                value={newTip.content} 
                onChange={e => setNewTip({ ...newTip, content: e.target.value })} 
                required 
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn text-white float-end" 
                style={{background: "linear-gradient(135deg, #5773bd 0%, #6ab7d6 100%)"}}>
                <i className="bi bi-plus-circle me-2"></i>Share Knowledge
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
      {/* Filter/Sort Options */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm">
            <h2 className="h4 mb-0">Traveler Tips and blogs ({getFilteredTips().length})</h2>
            <div className="d-flex gap-2">
            <input
          type="text"
          className="form-control form-control-sm bg-light border-light"
          placeholder="Search tips..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{width: "200px"}}
        />
<select 
  className="form-select form-select-sm bg-light border-light" 
  style={{width: "150px"}}
  value={categoryFilter}
  onChange={(e) => setCategoryFilter(e.target.value)}
>
  <option>All Categories</option>
  <option>Preparation</option>
  <option>Finance</option>
  <option>Security</option>
  <option>Culture</option>
  <option>General</option>
</select>
<select 
  className="form-select form-select-sm bg-light border-light" 
  style={{width: "150px"}}
  value={sortOrder}
  onChange={(e) => setSortOrder(e.target.value)}
>
  <option>Newest First</option>
  <option>Most Liked</option>
  <option>Highest Importance</option>
</select>
            </div>
          </div>
        </div>
      </div>

      {/* Display All Tips */}
      <div className="row row-cols-1 row-cols-md-2 g-4 mb-5">
        {getPaginatedTips().map(tip => (
          <div className="col" key={tip.id}>
            <div className="card h-100 shadow-sm border-0 hover-shadow" style={{borderRadius: "15px", transition: "all 0.3s"}}>
              <div className="card-header py-3 d-flex justify-content-between align-items-center border-0" style={{
                borderRadius: "15px 15px 0 0", 
                background: "linear-gradient(135deg,rgb(150, 181, 228) 0%, #c3cfe2 100%)"
              }}>
                <div className="d-flex align-items-center">
                  {getCategoryIcon(tip.category)}
                  <span className="fw-bold">{tip.category}</span>
                </div>
                <div className="d-flex">
                  {getImportanceStars(tip.importance)}
                </div>
              </div>
              <div className="card-body">
              <h5 className="card-title">{tip.title}</h5>
                <p className="card-text p-5">
                {expandedTips[tip.id] ? tip.content : `${tip.content.substring(0, 100)}${tip.content.length > 100 ? '...' : ''}`}
                {tip.content.length > 100 && (
                <button 
                   className="btn btn-link btn-sm p-0 ms-1" 
                   onClick={() => toggleExpanded(tip.id)}
                   >
                {expandedTips[tip.id] ? 'Show less' : 'Read more'}
                </button>
                    )}
                </p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted">
                    <FaUser className="me-1" /> {tip.username || "Anonymous Traveler"}
                  </small>
                  <small className="text-muted">Just now</small>
                </div>
              </div>
              <div className="card-footer bg-white border-top-0" style={{borderRadius: "0 0 15px 15px"}}>
                <div className="d-flex justify-content-between">
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    style={{borderRadius: "20px"}}
                    onClick={() => handleLike(tip.id)}
                  >
                    <FaHeart className="me-1" /> {tip.likes || 0}
                  </button>
                  <button 
                    className="btn btn-sm" 
                    style={{
                      borderRadius: "20px", 
                      background: selectedTip === tip.id ? "linear-gradient(135deg, #5773bd 0%, #6ab7d6 100%)" : "white",
                      color: selectedTip === tip.id ? "white" : "#5773bd",
                      border: selectedTip === tip.id ? "none" : "1px solid #5773bd"
                    }}
                    onClick={() => setSelectedTip(selectedTip === tip.id ? null : tip.id)}
                  >
                    <FaComment className="me-1" /> {tip.comments?.length || 0}
                  </button>
                </div>

                {/* Comment Section */}
                {selectedTip === tip.id && (
                  <div className="mt-3">
                    <div className="input-group mb-3">
                      <input 
                        type="text" 
                        className="form-control form-control-sm bg-light border-light" 
                        placeholder="Add your comment..." 
                        value={comment} 
                        onChange={e => setComment(e.target.value)} 
                      />
                      <button 
                        className="btn btn-sm text-white" 
                        style={{background: "linear-gradient(135deg, #5773bd 0%, #6ab7d6 100%)"}}
                        onClick={() => handleComment(tip.id)}
                      >
                        Post
                      </button>
                    </div>

                    {/* Display Comments */}
                    {tip.comments?.length > 0 ? (
                      <div className="list-group small rounded-3 mt-3">
                        {tip.comments.map((c, index) => (
                          <div key={index} className="list-group-item list-group-item-action py-2 border-0 mb-1 bg-light" style={{borderRadius: "10px"}}>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="fw-bold text-primary d-flex align-items-center">
                                <FaUser className="me-1" size={12} />
                                {c.user || "Anonymous Traveler"}
                              </span>
                              <small className="text-muted">Just now</small>
                            </div>
                            <p className="mb-0 text-dark">{c.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted mt-3">
                        <small>Be the first to comment!</small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {tips.length === 0 && (
          <div className="col-12 text-center py-5">
            <div className="card border-0 shadow-sm p-5" style={{borderRadius: "15px", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"}}>
              <div className="display-6 text-primary mb-3">No tips yet</div>
              <p className="lead text-muted">Be the first to share your travel wisdom!</p>
              <div className="mt-4">
                <FaPlane size={48} className="text-info opacity-50" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
{getFilteredTips().length > 0 && (
  <div className="row mb-5">
    <div className="col d-flex justify-content-center">
      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link" 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {"<<"}
            </button>
          </li>
          
          {Array.from({ length: Math.ceil(getFilteredTips().length / itemsPerPage) }).map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
          
          <li className={`page-item ${currentPage === Math.ceil(getFilteredTips().length / itemsPerPage) ? 'disabled' : ''}`}>
            <button 
              className="page-link" 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(getFilteredTips().length / itemsPerPage)}
            >
            {">>"}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
)}

      {/* Footer */}
      <div className="row">
        <div className="col">
          <div className="text-center py-4 text-muted">
            <p className="small mb-0">© 2025 Travel Tips Exchange • Connect with fellow travelers</p>
            <p className="small">Share your experiences • Learn from others • Travel smarter</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tips;