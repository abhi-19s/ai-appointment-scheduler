import { spawn } from 'child_process';
import { extractText } from './ocrController.js';

const pythonPath = "D:/WebDev/Appointment_Scheduler_Assistant/python-scripts/entity_extractor.py"; 


export function extractEntitiesFromPython(text) {
    return new Promise((resolve, reject) => {
        const py = spawn('python', [pythonPath, text]);

        let data = '';
        let errorData = '';

        py.stdout.on('data', chunk => data += chunk.toString());
        py.stderr.on('data', chunk => errorData += chunk.toString());

        const timeout = setTimeout(() => {
            py.kill();
            reject('Python script timed out');
        }, 10000);

        py.on('close', code => {
            clearTimeout(timeout);
            if (code !== 0) return reject(`Python exited with code ${code}. Stderr: ${errorData}`);
            try {
                resolve(JSON.parse(data));
            } catch (e) {
                reject(`Failed to parse Python output: ${e}. Raw: ${data}`);
            }
        });
    });
}


export const runExtraction = async (req, res) => {
    try {
        const { input, type} = req.body;
        if (!input) return res.status(400).json({ error: "Input is required" });
        
        // 1. execute OCR to get raw_text
        const ocrResult = await extractText(input, type);
        const textToExtract = ocrResult.raw_text; 

        // 2. execute entity extraction on obtained raw_text
        const entitiesResult = await extractEntitiesFromPython(textToExtract);

        // 3. send response to client
        res.json({
            entities: entitiesResult.entities,
            entities_confidence: entitiesResult.entities_confidence
        });

    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
};
