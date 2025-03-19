import React, { useState, useEffect } from 'react';

const TravelRecommendation = () => {
  const [location, setLocation] = useState('');
  const [text, setText] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('form');
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    if (recommendations) {
      setActiveTab('results');
    }
  }, [recommendations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!location.trim() || !text.trim()) {
      setError('Please provide both location and your mood/preferences');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location, text }),
      });
      
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to get recommendations');
      }
      
      setRecommendations(data);
      setLoading(false); // ✅ FIX: Reset loading state here
      setText('');
       setLocation('');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setActiveTab('form');
    setRecommendations(null);
    setText('');
    setLocation('');
  };

  const popularDestinations = [
    'Paris', 'Tokyo', 'New York', 'Bali', 'Barcelona', 'Sydney'
  ];

  const moodSuggestions = [
    'Feeling adventurous, looking for thrills', 
    'Need to relax and unwind', 
    'Want to explore local culture', 
    'Foodie seeking culinary experiences',
    'Romantic getaway ideas'
  ];

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '30px',
      borderRadius: '20px',
      background: 'linear-gradient(145deg, #f8f9fb, #ffffff)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74, 111, 165, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '40px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74, 111, 165, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
        zIndex: 0
      }}></div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: '#4a6fa5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '16px',
          fontSize: '22px'
        }}>
          🧭
        </div>
        <div>
          <h2 style={{
            color: '#2c3e50',
            fontSize: '28px',
            margin: '0 0 5px 0',
            fontWeight: '700'
          }}>
            Travel Mood Compass
          </h2>
          <p style={{
            color: '#5d6c7b',
            fontSize: '16px',
            margin: 0,
            fontWeight: '400'
          }}>
            Discover places that match your vibe and current mood
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e4e8ec',
        marginBottom: '25px',
        position: 'relative',
        zIndex: 1
      }}>
        <button 
          onClick={() => recommendations ? handleNewSearch() : null}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: activeTab === 'form' ? '600' : '400',
            color: activeTab === 'form' ? '#4a6fa5' : '#8795a7',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'form' ? '3px solid #4a6fa5' : '3px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Find Recommendations
        </button>
        {recommendations && (
          <button 
            onClick={() => setActiveTab('results')}
            style={{
              padding: '12px 20px',
              fontSize: '16px',
              fontWeight: activeTab === 'results' ? '600' : '400',
              color: activeTab === 'results' ? '#4a6fa5' : '#8795a7',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'results' ? '3px solid #4a6fa5' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Your Results
          </button>
        )}
      </div>

      <div className={animation ? 'content-animation' : ''} style={{
        opacity: animation ? 0 : 1,
        transform: animation ? 'translateY(20px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        position: 'relative',
        zIndex: 1
      }}>
        {activeTab === 'form' ? (
          <form onSubmit={handleSubmit}>
            <div style={{
              marginBottom: '30px'
            }}>
              <label 
                htmlFor="location" 
                style={{
                  display: 'block',
                  fontWeight: '600',
                  color: '#2c3e50',
                  fontSize: '16px',
                  marginBottom: '10px'
                }}
              >
                Where are you visiting? 🗺️
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter a city or destination"
                  required
                  style={{
                    width: '100%',
                    padding: '16px',
                    paddingLeft: '48px',
                    borderRadius: '12px',
                    border: '2px solid #e4e8ec',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4a6fa5'}
                  onBlur={(e) => e.target.style.borderColor = '#e4e8ec'}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '16px',
                  transform: 'translateY(-50%)',
                  fontSize: '20px'
                }}>
                  📍
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '12px'
              }}>
                {popularDestinations.map((dest, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setLocation(dest)}
                    style={{
                      background: 'none',
                      border: '1px solid #e4e8ec',
                      borderRadius: '20px',
                      padding: '6px 12px',
                      fontSize: '14px',
                      color: '#5d6c7b',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{
              marginBottom: '30px'
            }}>
              <label 
                htmlFor="mood-text" 
                style={{
                  display: 'block',
                  fontWeight: '600',
                  color: '#2c3e50',
                  fontSize: '16px',
                  marginBottom: '10px'
                }}
              >
                How are you feeling today? ✨
              </label>
              <textarea
                id="mood-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tell us your mood, preferences, or what kind of experience you're looking for..."
                rows={4}
                required
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '2px solid #e4e8ec',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  minHeight: '120px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4a6fa5'}
                onBlur={(e) => e.target.style.borderColor = '#e4e8ec'}
              />

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '12px'
              }}>
                <p style={{
                  margin: '0 0 4px 0',
                  fontSize: '14px',
                  color: '#5d6c7b'
                }}>
                  Try these:
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {moodSuggestions.map((mood, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setText(mood)}
                      style={{
                        background: 'none',
                        border: '1px solid #e4e8ec',
                        borderRadius: '20px',
                        padding: '6px 12px',
                        fontSize: '14px',
                        color: '#5d6c7b',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {error && (
              <div style={{
                backgroundColor: '#fff3f3',
                color: '#e53935',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '15px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid #ffcdd2'
              }}>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#4a6fa5',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(74, 111, 165, 0.2)',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {loading ? (
                <>
                  <span className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                  Finding Your Perfect Spots
                </>
              ) : (
                <>
                  <span style={{ fontSize: '20px' }}>🔍</span>
                  Discover My Perfect Places
                </>
              )}
            </button>
          </form>
        ) : (
          <div style={{
            padding: '10px 0'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                color: '#2c3e50',
                fontSize: '22px',
                margin: 0
              }}>
                Your Personalized Recommendations
              </h3>
              <button
                onClick={handleNewSearch}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: '1px solid #e4e8ec',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#5d6c7b',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>✨</span> New Search
              </button>
            </div>
            
            <div style={{
              backgroundColor: '#f8fafd',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid #e4e8ec'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px'
              }}>
                <span role="img" aria-label="location" style={{ fontSize: '18px' }}>📍</span>
                <h4 style={{ margin: 0, fontSize: '18px', color: '#2c3e50' }}>
                  {location}
                </h4>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span role="img" aria-label="mood" style={{ fontSize: '18px' }}>🌟</span>
                <p style={{ margin: 0, fontSize: '15px', color: '#5d6c7b' }}>
                  {text.length > 100 ? `${text.substring(0, 100)}...` : text}
                </p>
              </div>
            </div>
            
            <div 
              className="recommendation-content"
              style={{
                borderRadius: '12px',
                overflow: 'hidden'
              }}
              dangerouslySetInnerHTML={{ __html: recommendations?.answer }}
            />
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .content-animation {
            animation: fadeIn 0.5s forwards;
          }
          
          button:hover:not(:disabled) {
            background-color: #f0f7ff !important;
            color: #4a6fa5 !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }
          
          button[type="submit"]:hover:not(:disabled) {
            background-color: #3a5a8a !important;
            color: white !important;
          }
          
          .loading-dots {
            display: flex;
            align-items: center;
            gap: 4px;
          }
          
          .loading-dots span {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: white;
            animation: dotPulse 1.4s infinite ease-in-out;
          }
          
          .loading-dots span:nth-child(1) {
            animation-delay: 0s;
          }
          
          .loading-dots span:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .loading-dots span:nth-child(3) {
            animation-delay: 0.4s;
          }
          
          @keyframes dotPulse {
            0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default TravelRecommendation;