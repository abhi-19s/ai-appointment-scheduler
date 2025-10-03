import { spawn } from "child_process";
import { extractText } from "./ocrController.js";
import { extractEntitiesFromPython } from "./extractController.js";
import { normalizeWithPython } from "./normalizeController.js";

const pythonPath = "D:/WebDev/Appointment_Scheduler_Assistant/python-scripts/appointment.py";


function createFinalAppointment(entities, normalized) {
    return new Promise((resolve, reject) => {
        const py = spawn("python", [
            pythonPath,
            JSON.stringify(entities),
            JSON.stringify(normalized)
        ]);

        let data = "";
        let errorData = "";

        py.stdout.on("data", chunk => (data += chunk.toString()));
        py.stderr.on("data", chunk => (errorData += chunk.toString()));

        py.on("close", (code) => {
            if (code !== 0) return reject(`Python exited with code ${code}. Error: ${errorData}`);
            try {
                resolve(JSON.parse(data));
            } catch (e) {
                reject(`Failed to parse Python output: ${e}. Raw: ${data}`);
            }
        });

        setTimeout(() => {
            py.kill();
            reject("Python script timed out");
        }, 10000);
    });
}

export const runFinalPipeline = async (req, res) => {
    try {
        const { input, type = "text" } = req.body;
        if (!input) return res.status(400).json({ error: "Input is required" });

        // 1️. execute OCR to get raw_text
        const ocrResult = await extractText(input, type);
        const textToProcess = ocrResult.raw_text;

        // 2. execute entity extraction to get entities
        const entitiesResult = await extractEntitiesFromPython(textToProcess);

        // 3. perform normalization on entities
        const normalizedResult = await normalizeWithPython(entitiesResult.entities);

        // 4️. Generate Final Appointment based on entities and normalized data
        const finalResult = await createFinalAppointment(
            entitiesResult.entities,
            normalizedResult
        );

        res.json(finalResult);

    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
};
