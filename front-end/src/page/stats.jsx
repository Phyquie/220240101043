import React, { useState } from 'react'
import {Link} from 'react-router-dom'


const Stats = () => {
  const [shortcode, setShortcode] = useState('')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!shortcode.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`http://localhost:3001/shorturls/${shortcode}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats')
      }
      
      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
                <Link to={"/"}>Click here for Home Page</Link>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={shortcode}
              onChange={(e) => setShortcode(e.target.value)}
              placeholder="Enter shortcode"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Stats'}
            </button>
          </form>
        </div>
        
        {error && (
          <div className="bg-red-100 p-4 rounded-md mb-6 text-red-700">
            {error}
          </div>
        )}
        
        {stats && (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            {/* URL Info */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold mb-4">URL Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Original URL:</p>
                  <p className="break-all">{stats.urlInfo.originalUrl}</p>
                </div>
                <div>
                  <p className="text-gray-500">Shortcode:</p>
                  <p>{stats.urlInfo.shortcode}</p>
                </div>
                <div>
                  <p className="text-gray-500">Created:</p>
                  <p>{new Date(stats.urlInfo.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Expires:</p>
                  <p className={stats.urlInfo.isExpired ? 'text-red-600' : ''}>
                    {new Date(stats.urlInfo.expiresAt).toLocaleString()}
                    {stats.urlInfo.isExpired ? ' (Expired)' : ''}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Click Stats */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold mb-4">Click Statistics (Total: {stats.clickStats.total})</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Top Referrers</h3>
                  <div className="space-y-1">
                    {stats.clickStats.referrers.map((ref, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span>{ref._id || 'Unknown'}</span>
                        <span className="bg-blue-100 px-2 py-1 rounded text-sm">
                          {ref.count}
                        </span>
                      </div>
                    ))}
                    {stats.clickStats.referrers.length === 0 && <p className="text-gray-500">No data</p>}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Top Devices</h3>
                  <div className="space-y-1">
                    {stats.clickStats.devices.map((device, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="truncate">{device._id || 'Unknown'}</span>
                        <span className="bg-blue-100 px-2 py-1 rounded text-sm">
                          {device.count}
                        </span>
                      </div>
                    ))}
                    {stats.clickStats.devices.length === 0 && <p className="text-gray-500">No data</p>}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Click Details */}
            <div>
              <h2 className="text-xl font-bold mb-4">Click Details</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">Time</th>
                      <th className="p-2 text-left">Referrer</th>
                      <th className="p-2 text-left">User Agent</th>
                      <th className="p-2 text-left">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.clickDetails.map((click, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{new Date(click.timestamp).toLocaleString()}</td>
                        <td className="p-2">{click.referrer || 'Direct'}</td>
                        <td className="p-2 truncate max-w-[200px]">{click.userAgent || 'Unknown'}</td>
                        <td className="p-2">{click.ip || 'Unknown'}</td>
                      </tr>
                    ))}
                    {stats.clickDetails.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-2 text-center text-gray-500">No click data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Stats