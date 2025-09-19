import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'

function Home() {
  const [formData, setFormData] = useState({
    url: '',
    validity: 7, // Default validity in days
    shortcode: '' // Optional
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [urlError, setUrlError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    if (name === 'url') {
      validateUrl(value);
    }
  };
  
  const validateUrl = (url) => {
    if (!url) {
      setUrlError('');
      return;
    }
    
    if (!url.startsWith('https://')) {
      setUrlError('URL must start with https://');
    } else {
      setUrlError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (urlError) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/shorturls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.url) {
      validateUrl(formData.url);
    }
  }, []);

  const copyToClipboard = () => {
    if (response?.shortLink) {
      navigator.clipboard.writeText(response.shortLink);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
        <Link to={"/stats"}>Click here for Stats Page</Link>
        <h1 className="text-2xl font-bold text-blue-600 mb-1">URL Shortener</h1>
        <p className="text-gray-500 mb-6">Create shortened URLs that are easy to share</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL to Shorten*
            </label>
            <input 
              type="url" 
              id="url" 
              name="url" 
              value={formData.url} 
              onChange={handleChange}
              placeholder="https://example.com/very-long-url"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
            {urlError && (
              <p className="mt-1 text-xs text-red-500">{urlError}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="validity" className="block text-sm font-medium text-gray-700 mb-1">
              Validity (Minutes)
            </label>
            <input 
              type="number" 
              id="validity" 
              name="validity" 
              value={formData.validity} 
              onChange={handleChange}
              min="1"
              max="365"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          
          <div>
            <label htmlFor="shortcode" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Shortcode (optional)
            </label>
            <input 
              type="text" 
              id="shortcode" 
              name="shortcode" 
              value={formData.shortcode} 
              onChange={handleChange}
              placeholder="your-custom-code"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <p className="mt-1 text-xs text-gray-500">Leave empty for random code</p>
          </div>
          
          <button 
            type="submit" 
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              loading || urlError || !formData.url ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
            disabled={loading || urlError || !formData.url}
          >
            {loading ? 'Creating...' : 'Create Short URL'}
          </button>
        </form>
        
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {response && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Your Shortened URL</h2>
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-lg border border-gray-200 mb-3">
              <p className="text-gray-800 font-medium flex-1 break-all">{response.shortLink}</p>
              <button 
                onClick={copyToClipboard} 
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Expires at: {new Date(response.expiresAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home