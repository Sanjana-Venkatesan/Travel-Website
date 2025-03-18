import React, { useState } from 'react';

const TravelRecommendation = () => {
  const [location, setLocation] = useState('');
  const [text, setText] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px'
    },
    heading: {
      color: '#2a2f4f',
      fontSize: '28px',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#666',
      fontSize: '16px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontWeight: '500',
      color: '#333',
      fontSize: '16px'
    },
    input: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '16px',
      transition: 'border-color 0.3s ease',
      outline: 'none'
    },
    textarea: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '16px',
      minHeight: '120px',
      fontFamily: 'inherit',
      resize: 'vertical',
      transition: 'border-color 0.3s ease',
      outline: 'none'
    },
    button: {
      backgroundColor: '#4a6fa5',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '14px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      marginTop: '10px'
    },
    buttonHover: {
      backgroundColor: '#3a5a8a'
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '20px',
      gap: '16px'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid rgba(0, 0, 0, 0.1)',
      borderLeftColor: '#4a6fa5',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    error: {
      backgroundColor: '#ffebee',
      color: '#c62828',
      padding: '12px 16px',
      borderRadius: '8px',
      marginTop: '20px',
      fontSize: '14px'
    },
    recommendations: {
      marginTop: '30px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }
  };

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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Mood-Based Travel Recommendations</h2>
        <p style={styles.subtitle}>Tell us how you're feeling and get personalized travel suggestions</p>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="location" style={styles.label}>Where are you visiting?</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., New York, Paris, Tokyo"
            required
            style={styles.input}
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label htmlFor="mood-text" style={styles.label}>How are you feeling? What are you looking for?</label>
          <textarea
            id="mood-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., I'm feeling adventurous and want to try something exciting, or I need to relax and unwind..."
            rows={4}
            required
            style={styles.textarea}
          />
        </div>
        
        <button 
          type="submit" 
          style={{
            ...styles.button,
            ...(loading ? { opacity: 0.7, cursor: 'not-allowed' } : {})
          }}
          disabled={loading}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
        >
          {loading ? 'Finding places...' : 'Get Recommendations'}
        </button>
      </form>
      
      {error && <div style={styles.error}>{error}</div>}
      
      {loading && (
        <div style={styles.loading}>
          <div style={{
            ...styles.spinner,
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Analyzing your mood and finding perfect places...</p>
        </div>
      )}
      
      {recommendations && (
        <div style={styles.recommendations}>
          <h3 style={{ color: '#2a2f4f', marginBottom: '16px' }}>Your Recommendations</h3>
          <div dangerouslySetInnerHTML={{ __html: recommendations.answer }}></div>
        </div>
      )}
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default TravelRecommendation;