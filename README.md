# AI-Powered Appointment Scheduler  

An AI-driven appointment scheduling system that processes  natural language or document-based appointment requests and converts them into structured scheduling data. 
The system handles both typed text and image inputs (OCR) and provides:  
- OCR / Text Extraction  
- Entity Extraction  
- Normalization (to ISO date/time in Asia/Kolkata)  
- Guardrails for ambiguity  
- Final structured Appointment JSON  

---

## 🚀 Live Demo

You can test the backend endpoints via this ngrok link:  

**Ngrok Demo:** [https://dalila-bombous-valentine.ngrok-free.dev](https://dalila-bombous-valentine.ngrok-free.dev)

Endpoints:

- `/api/v1/ocr` → OCR | Text Extraction  
- `/api/v1/entity` → Entity Extraction  
- `/api/v1/normalize` → Normalization  
- `/api/v1/appoitment` → Final Appointment JSON  

> ⚠️ Make sure the ngrok tunnel is active while testing.

---

## 🏗️ Architecture  

### Tech Stack  
- **Backend API** → Node.js + Express  
- **OCR & NLP Pipeline** → Python scripts (invoked by backend)   

### Pipeline Steps  
1. **OCR / Text Extraction**  
   - Input: typed text or image  
   - Output: raw text + confidence score  

2. **Entity Extraction**  
   - Extracts `date_phrase`, `time_phrase`, `department`  
   - Returns entities + confidence  

3. **Normalization (Asia/Kolkata timezone)**  
   - Converts natural language dates/times to ISO format  
   - Returns normalized values + confidence  

4. **Guardrails / Exit Conditions**  
   - If ambiguous, returns clarification request JSON  

5. **Final Appointment JSON**  
   - Combines entities + normalized values into structured appointment data  



---
## 📸 Screenshots / Demo  

### Screenshots  
- **Text Extraction Example**  
  ![Text Extraction](https://drive.google.com/uc?export=view&id=1uJzpdHizKAsHK0Ki2idaLVCHMyhgw_zU)  

- **Entity Extraction Example**  
  ![Entity Extraction](https://drive.google.com/uc?export=view&id=1D_c5MrZtvF5NlNu9HRUJKbs3uflusATb)  

- **Normalization Example**  
  ![Normalization](https://drive.google.com/uc?export=view&id=1zE-wmAIxcJsUzL40ZSJvFzyCUzEoeGXs)  

- **Appointment Scheduled Confirmation**  
  ![Appointment Confirm](https://drive.google.com/uc?export=view&id=1Pb5AcVK43uywmNv1gqTNHrWV5Jr-wwlm)  

### Screen Recording  
👉 [Demo Video](https://drive.google.com/file/d/11uhJBQzGjjziS6_xIEsPD8lb6VOFC01c/view?usp=drive_link)  

---

## ⚠️ Known Issues  
- Limited support for **multi-lingual inputs**.  
- Ambiguity in phrases like *“next to next Monday”* or *“in two weeks”*.  
- OCR and NLP are **sensitive to spelling errors**:
  - e.g., “next” typed as “nxt” or “dentist” typed as “dentsit” may not be recognized correctly.  
- OCR accuracy may vary depending on handwriting clarity.  


---


## 🚀 Potential Improvements  
- **Spelling/Fuzzy Correction:** Fix typos in text or OCR output before extraction.  
- **Better NLP Context:** Resolve ambiguous phrases like *“next to next Monday”*.  
- **Multi-Lingual Support:** Extend entity extraction to other languages.  
- **OCR Preprocessing:** Improve image quality for better recognition.  
- **Clarification Prompts:** Ask user when input is unclear or low-confidence.  

---

## ⚡ Getting Started  

### 1. Clone Repository  
```bash
git clone git@github.com:abhi-19s/ai-appointment-scheduler.git
cd ai-appointment-scheduler
