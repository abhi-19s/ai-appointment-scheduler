import { spawn } from "child_process";
import { extractText } from "./ocrController.js"; 
import { extractEntitiesFromPython } from "./extractController.js";

const pythonPath = "D:/WebDev/Appointment_Scheduler_Assistant/python-scripts/normalizer.py";


export function normalizeWithPython(entities) {
    return new Promise((resolve, reject) => {
        const py = spawn("python", [pythonPath, JSON.stringify(entities)]);

        let data = "";
        let errorData = "";

        py.stdout.on("data", chunk => data += chunk.toString());
        py.stderr.on("data", chunk => errorData += chunk.toString());

        const timeout = setTimeout(() => {
            py.kill();
            reject("Python script timed out");
        }, 10000);

        py.on("close", code => {
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

export const runNormalization = async (req, res) => {
    try {
        const { input, type = "text" } = req.body;
        if (!input) return res.status(400).json({ error: "Input is required" });

        // 1️. execute OCR to get raw_text
        const ocrResult = await extractText(input, type);
        const textToExtract = ocrResult.raw_text || ocrResult.input;

        // 2. execute entity extraction to get entities
        const entitiesResult = await extractEntitiesFromPython(textToExtract);

        // 3. perform normalization on entities
        const normalizationResult = await normalizeWithPython(entitiesResult.entities);

        //  4. return the final result
        res.json(normalizationResult);

    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
};
