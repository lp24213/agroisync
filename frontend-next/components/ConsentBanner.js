import { useState, useEffect } from 'react';

export default function ConsentBanner({ onChange }) {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    // Check if user has already given consent
    try {
      const stored = localStorage.getItem('agroisync-consent');
      if (stored) {
        const parsed = JSON.parse(stored);
        setConsent(parsed);
        onChange?.(parsed);
      } else {
        setShowBanner(true);
      }
    } catch {
      setShowBanner(true);
    }
  }, [onChange]);

  const handleAccept = (type) => {
    const newConsent = {
      necessary: true,
      analytics: type === 'all',
      marketing: type === 'all',
      timestamp: new Date().toISOString()
    };
    
    try {
      localStorage.setItem('agroisync-consent', JSON.stringify(newConsent));
    } catch {
      // Storage not available
    }
    
    setConsent(newConsent);
    setShowBanner(false);
    onChange?.(newConsent);
  };

  if (!showBanner) return null;

  return (
    <div className="consent-banner" role="dialog" aria-labelledby="consent-title" aria-describedby="consent-description">
      <div className="consent-content">
        <h3 id="consent-title">Cookies e Privacidade</h3>
        <p id="consent-description">
          Usamos cookies para melhorar sua experiência. Você pode escolher aceitar apenas cookies essenciais ou todos os cookies.
        </p>
        <div className="consent-buttons">
          <button 
            onClick={() => handleAccept('necessary')}
            className="btn btn-secondary"
            aria-label="Aceitar apenas cookies essenciais"
          >
            Apenas Necessários
          </button>
          <button 
            onClick={() => handleAccept('all')}
            className="btn btn-primary"
            aria-label="Aceitar todos os cookies"
          >
            Aceitar Todos
          </button>
        </div>
      </div>
      <style jsx>{`
        .consent-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 2px solid #4caf50;
          padding: 20px;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
          z-index: 9999;
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .consent-content {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .consent-content h3 {
          margin: 0 0 10px 0;
          font-size: 18px;
          color: #333;
        }
        
        .consent-content p {
          margin: 0 0 15px 0;
          color: #666;
          line-height: 1.5;
        }
        
        .consent-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background: #4caf50;
          color: white;
        }
        
        .btn-primary:hover {
          background: #45a049;
          transform: translateY(-2px);
        }
        
        .btn-secondary {
          background: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
        }
        
        .btn-secondary:hover {
          background: #e0e0e0;
        }
        
        @media (max-width: 768px) {
          .consent-banner {
            padding: 15px;
          }
          
          .consent-buttons {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

