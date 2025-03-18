import React, { useState } from 'react';


const FaqAnswer = ({ answer, isLoading }) => {
  const [copied, setCopied] = useState(false);

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
    <div style={{
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      position: 'relative',
      border: '1px solid #e9ecef'
    }}>
      {isLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e9ecef',
            borderTopColor: '#007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      ) : (
        <>
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={copyToClipboard}
              style={{
                backgroundColor: copied ? '#28a745' : '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          
          <h3 style={{
            color: '#343a40',
            marginTop: '0',
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Answer
          </h3>
          
          <div 
            style={{
              color: '#495057',
              lineHeight: '1.6',
              fontSize: '16px'
            }}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
          
          <div style={{
            marginTop: '16px',
            fontSize: '12px',
            color: '#6c757d',
            textAlign: 'right',
            fontStyle: 'italic'
          }}>
            Powered by kitty528/travelbot
          </div>
        </>
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


const FaqContainer = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      setQuestion(''); 
    } catch (err) {
      setError(err.message || 'Something went wrong');
      console.error('Error fetching FAQ answer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        color: '#343a40',
        marginBottom: '24px',
        fontSize: '24px',
        fontWeight: '700'
      }}>
        Travel FAQ Assistant
      </h2>
      
      <form onSubmit={handleSubmit} style={{
        marginBottom: '20px'
      }}>
        <div style={{
          marginBottom: '16px'
        }}>
          <label
            htmlFor="question"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#343a40'
            }}
          >
            Ask a travel question:
          </label>
          
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: What should I pack for a trip to Iceland in winter?"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              minHeight: '100px',
              fontSize: '16px',
              resize: 'vertical'
            }}
          />
        </div>
        
        {error && (
          <div style={{
            color: '#dc3545',
            marginBottom: '16px',
            padding: '8px',
            backgroundColor: '#f8d7da',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 16px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          {isLoading ? 'Getting Answer...' : 'Get Answer'}
        </button>
      </form>
      
      {(isLoading || answer) && (
        <FaqAnswer 
          answer={answer} 
          isLoading={isLoading} 
        />
      )}
    </div>
  );
};

export default FaqContainer;