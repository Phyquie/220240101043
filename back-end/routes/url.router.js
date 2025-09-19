import express from 'express';
import { UrlShortner,UrlStats , UrlRedirection } from '../controller/url.controller.js';

const router = express.Router();


router.get('/:id',UrlRedirection)
router.post('/shorturls',UrlShortner)
router.get('/shorturls/:id',UrlStats)


export default router