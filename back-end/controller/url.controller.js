import Url from "../model/url.model.js"
import crypto from "crypto"
import Click from '../model/click.model.js';


const BASE_URL = 'http://localhost:3001'; 


export const UrlShortner = async (req, res) => {
 
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing' });
        }
        
        const { url, validity, shortcode } = req.body;
        
        if (!url || !validity) {
            return res.status(400).json({ error: 'url and validity are required' });
        }

        let code = shortcode;
        if (code) {
            
            const exists = await Url.findOne({ shortcode: code });
            if (exists) {
                return res.status(409).json({ error: 'Shortcode already exists' });
            }
        } else {
            let unique = false;
            while (!unique) {
                code = crypto.randomBytes(4).toString('hex');
                const exists = await Url.findOne({ shortcode: code });
                if (!exists) unique = true;
            }
        }

        const expiresAt = new Date(Date.now() + Number(validity) * 60000); 
        const newUrl = await Url.create({
            originalUrl: url,
            shortcode: code,
            expiresAt,
        });

        return res.json({
            shortLink: `${BASE_URL}/${code}`,
            expiresAt,
        });
    } catch (err) {
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
}


export const UrlRedirection = async (req, res) => {
    
    try {
        const { id } = req.params;
        
        const urlData = await Url.findOne({ shortcode: id });
        
        if (!urlData) {
            return res.status(404).json({ error: 'URL not found. Invalid shortcode.' });
        }
        
        if (urlData.expiresAt < new Date()) {
            return res.status(410).json({ error: 'URL has expired' });
        }
        
        const clickData = {
            urlId: urlData._id,
            timestamp: new Date(),
            source: req.get('user-agent') || 'unknown',
            userAgent: req.get('user-agent'),
            ip: req.ip || req.connection.remoteAddress,
            referrer: req.get('referer') || 'direct',
            location: {
               
                country: 'unknown',
                region: 'unknown',
                city: 'unknown',
                coordinates: {
                    latitude: null,
                    longitude: null
                }
            }
        };
        
        Click.create(clickData).catch(err => console.error('Error tracking click:', err));
        
        return res.redirect(urlData.originalUrl);
        
    } catch (err) {
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
}

export const UrlStats = async (req, res) => {
    
    try {
        const { id } = req.params;
        
        const urlData = await Url.findOne({ shortcode: id });
        
        if (!urlData) {
            return res.status(404).json({ error: 'URL not found. Invalid shortcode.' });
        }
        
        const totalClicks = await Click.countDocuments({ urlId: urlData._id });
        
        const clickDetails = await Click.find({ urlId: urlData._id })
            .sort({ timestamp: -1 });
            
      
        const referrerStats = await Click.aggregate([
            { $match: { urlId: urlData._id } },
            { $group: { _id: '$referrer', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        
        const deviceStats = await Click.aggregate([
            { $match: { urlId: urlData._id } },
            { $group: { _id: '$source', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        
        const response = {
            urlInfo: {
                originalUrl: urlData.originalUrl,
                shortcode: urlData.shortcode,
                createdAt: urlData.createdAt,
                expiresAt: urlData.expiresAt,
                isExpired: urlData.expiresAt < new Date()
            },
            clickStats: {
                total: totalClicks,
                referrers: referrerStats,
                devices: deviceStats
            },
            clickDetails: clickDetails
        };
        
        return res.json(response);
        
    } catch (err) {
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
}
