import express from 'express';
import { runNormalization } from '../controller/normalizeController.js';
const normalizeRouter = express.Router();

// normalizeRouter.post('/normalize', (req, res) => {
//     // Placeholder for normalization logic
//     res.json({ message: 'Normalization processing not implemented yet' });
// });


normalizeRouter.post('/normalize', runNormalization);

export default normalizeRouter;