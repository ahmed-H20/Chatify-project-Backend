// chatbot.js
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// إعداد المسارات
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleChatbotRequest = (message) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, 'chatbot.py');
        const pythonProcess = spawn('python', [scriptPath, message]);

        let responseData = '';
        let errorData = '';

        pythonProcess.stdout.on('data', (data) => {
            responseData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
            console.error(`Python stderr: ${errorData}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0 || errorData) {
                return reject(new Error(errorData || 'فشل تشغيل سكربت بايثون.'));
            }
            resolve(responseData.trim());
        });
    });
};
