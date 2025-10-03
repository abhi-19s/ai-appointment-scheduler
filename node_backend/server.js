import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import ocrRouter from './routes/ocr.js';
import extractRouter from './routes/entity.js';
import normalizeRouter from './routes/normalize.js';
import appointmentRouter from './routes/appointment.js';


const app = express();


app.use(express.json());


const PORT = 5000;

// test route
app.get('/', (req, res) => {
    res.send('Hello from the Appointment Scheduler Assistant backend!');
});

// endpoints of server
app.use("/api/v1",ocrRouter);
app.use("/api/v1",extractRouter);
app.use("/api/v1",normalizeRouter);
app.use("/api/v1",appointmentRouter);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

