import React, { useState, useEffect } from 'react';

const FaqAnswer = ({ answer, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (!isLoading && answer) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, answer]);

  const copyToClipboard = () => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = answer;
    const plainText = tempElement.textContent || tempElement.innerText;
    
    navigator.clipboard.writeText(plainText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`answer-container ${showAnimation ? 'fade-in' : ''}`}
      style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '30px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        position: 'relative',
        border: '1px solid #e9ecef',
        transition: 'all 0.3s ease',
        transform: showAnimation ? 'translateY(0)' : 'translateY(10px)',
        opacity: showAnimation ? 0 : 1
      }}>
      {isLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '40px 20px'
        }}>
          <div className="globe-spinner">
            <div className="globe-inner"></div>
          </div>
        </div>
      ) : (
        <>
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={copyToClipboard}
              style={{
                backgroundColor: copied ? '#28a745' : 'white',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                color: copied ? 'white' : '#495057',
                fontWeight: '500'
              }}
            >
              <span style={{ marginRight: '6px' }}>
                {copied ? '✓' : '📋'}
              </span>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          
          <h3 style={{
            color: '#1e88e5',
            marginTop: '0',
            marginBottom: '20px',
            fontSize: '22px',
            fontWeight: '600',
            borderBottom: '2px solid #e3f2fd',
            paddingBottom: '10px'
          }}>
            Travel Insight
          </h3>
          
          <div 
            style={{
              color: '#37474f',
              lineHeight: '1.8',
              fontSize: '17px'
            }}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
          
          <div style={{
            marginTop: '24px',
            padding: '12px',
            borderTop: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#78909c',
              fontSize: '14px'
            }}>
              <span style={{ fontSize: '18px' }}>✈️</span>
              <span>Powered by kitty528/travelbot</span>
            </div>
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button style={{
                background: 'none',
                border: 'none',
                color: '#78909c',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                👍 Helpful
              </button>
              <button style={{
                background: 'none',
                border: 'none',
                color: '#78909c',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                👎 Not Helpful
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const FaqContainer = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions] = useState([
    "What vaccinations do I need for Southeast Asia?",
    "Best time to visit Patagonia?",
    "How to avoid jet lag on long flights?",
    "Budget tips for traveling in Europe"
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
    
      const response = await fetch('http://localhost:3000/api/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get answer');
      }
      
      setAnswer(data.answer);
      
    } catch (err) {
      setError(err.message || 'Something went wrong');
      console.error('Error fetching FAQ answer:', err);
      setIsLoading(false);
    }
  };

  const useSuggestion = (suggestion) => {
    setQuestion(suggestion);
  };

  return (
    <div style={{
      maxWidth: '850px',
      margin: '0 auto',
      padding: '30px 20px',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: '#e3f2fd',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          ✈️
        </div>
        <h2 style={{
          color: '#1e88e5',
          margin: '0',
          fontSize: '28px',
          fontWeight: '700'
        }}>
          Wanderlust Assistant
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} style={{
        marginBottom: '20px'
      }}>
        <div style={{
          marginBottom: '20px',
          position: 'relative'
        }}>
          <label
            htmlFor="question"
            style={{
              display: 'block',
              marginBottom: '12px',
              fontWeight: '600',
              color: '#37474f',
              fontSize: '17px'
            }}
          >
            Where would you like to explore?
          </label>
          
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about destinations, packing tips, local customs, or travel safety..."
            style={{
              width: '100%',
              padding: '16px',
              paddingLeft: '50px',
              borderRadius: '8px',
              border: '2px solid #e3f2fd',
              minHeight: '120px',
              fontSize: '16px',
              resize: 'vertical',
              transition: 'border 0.3s ease',
              boxSizing: 'border-box',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => e.target.style.border = '2px solid #1e88e5'}
            onBlur={(e) => e.target.style.border = '2px solid #e3f2fd'}
          />
          <div style={{
            position: 'absolute',
            left: '16px',
            top: '52px',
            fontSize: '24px'
          }}>
            🔍
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '15px', color: '#455a64', marginRight: '6px', marginTop: '4px' }}>
            Popular:
          </span>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => useSuggestion(suggestion)}
              style={{
                backgroundColor: '#e3f2fd',
                color: '#1e88e5',
                border: 'none',
                borderRadius: '16px',
                padding: '6px 12px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
        
        {error && (
          <div style={{
            color: '#d32f2f',
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#ffebee',
            borderRadius: '6px',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: '#1e88e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '14px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(30,136,229,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isLoading ? (
            <>
              <span className="spinner-small"></span>
              Finding travel insights...
            </>
          ) : (
            <>
              <span style={{ fontSize: '18px' }}>✨</span>
              Get Travel Insights
            </>
          )}
        </button>
      </form>
      
      {(isLoading || answer) && (
        <FaqAnswer 
          answer={answer} 
          isLoading={isLoading} 
        />
      )}
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0% { transform: scale(0.95); opacity: 0.7; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0.7; }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .globe-spinner {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: conic-gradient(
              #1e88e5 0%,
              #90caf9 30%,
              #e3f2fd 60%,
              #bbdefb 75%,
              #1e88e5 100%
            );
            position: relative;
            animation: spin 1.5s linear infinite, pulse 2s ease infinite;
          }
          
          .globe-inner {
            position: absolute;
            width: 80%;
            height: 80%;
            background-color: #f8f9fa;
            border-radius: 50%;
            top: 10%;
            left: 10%;
          }
          
          .spinner-small {
            width: 18px;
            height: 18px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.8s linear infinite;
            display: inline-block;
          }
          
          .fade-in {
            animation: fadeIn 0.5s forwards;
          }
          
          textarea:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(30,136,229,0.2);
          }
          
          button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(30,136,229,0.4);
          }
        `}
      </style>
    </div>
  );
};

export default FaqContainer;