import express from 'express';
import {runOCR} from "../controller/ocrController.js";


const ocrRouter = express.Router();

// ocrRouter.post('/ocr', (req, res) => {
//     // Placeholder for OCR processing logic
//     res.json({ message: 'OCR processing not implemented yet' });
// });

ocrRouter.post('/ocr', runOCR);

export default ocrRouter;  