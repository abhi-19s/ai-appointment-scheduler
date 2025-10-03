import express from 'express';
import { runExtraction } from '../controller/extractController.js';

const extractRouter = express.Router();

// extractRouter.post('/extract', (req, res) => {
//     // Placeholder for extraction logic
//     res.json({ message: 'Extraction processing not implemented yet' });
// });
extractRouter.post('/entity', runExtraction);

export default extractRouter;