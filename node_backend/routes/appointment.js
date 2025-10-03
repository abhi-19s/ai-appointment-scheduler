import express from 'express';

const appointmentRouter = express.Router();
import { runFinalPipeline } from '../controller/appointmentController.js';


// appointmentRouter.post('/appointment', (req, res) => {
//     // Placeholder for appointment scheduling logic
//     res.json({ message: 'Appointment scheduling not implemented yet' });
// });

appointmentRouter.post('/appointment', runFinalPipeline);

export default appointmentRouter;
