import { spawn } from "child_process";

const pythonPath = "D:/WebDev/Appointment_Scheduler_Assistant/python-scripts/text_extractor.py"; 

export function extractText(input, type) {
  return new Promise((resolve, reject) => {
    const py = spawn("python", [pythonPath, input, type]);

    let data = "";

    py.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    py.stderr.on("data", (err) => {
      reject(err.toString());
    });

    py.on("close", (code) => {
      if (code !== 0) return reject(`Python exited with code ${code}`);
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(`Failed to parse Python output: ${e}`);
      }
    });

    setTimeout(() => {
      py.kill();
      reject("Python script timed out");
    }, 10000);
  });
}

export const runOCR = async (req, res) => {
    try {
        const {input, type="text"} = req.body;
        if(!input){
            return res.status(400).json({error: "Input is required"});
        }
        const result = await extractText(input, type);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
};


