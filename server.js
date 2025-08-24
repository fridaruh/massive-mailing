const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Store for current sending process
let sendingProcess = {
    isRunning: false,
    currentIndex: 0,
    successCount: 0,
    errorCount: 0,
    recipients: [],
    config: null
};

// API Routes

// Start sending process
app.post('/api/send', upload.fields([
    { name: 'csvFile', maxCount: 1 },
    { name: 'templateFile', maxCount: 1 }
]), async (req, res) => {
    try {
        if (sendingProcess.isRunning) {
            return res.status(400).json({ error: 'Ya hay un proceso de envío en curso' });
        }

        const { emailUser, appPassword, emailSubject, batchSize, delayEmails, delayBatches } = req.body;
        
        // Validate required fields
        if (!emailUser || !appPassword || !emailSubject) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        // Process CSV file
        const csvFile = req.files.csvFile[0];
        const recipients = await processCsvFile(csvFile.path);
        
        // Read HTML template
        const templateFile = req.files.templateFile[0];
        const htmlTemplate = fs.readFileSync(templateFile.path, 'utf8');

        // Configure nodemailer
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: appPassword
            }
        });

        // Initialize sending process
        sendingProcess = {
            isRunning: true,
            currentIndex: 0,
            successCount: 0,
            errorCount: 0,
            recipients,
            config: {
                transporter,
                emailUser,
                emailSubject,
                htmlTemplate,
                batchSize: parseInt(batchSize) || 50,
                delayEmails: parseInt(delayEmails) * 1000 || 10000,
                delayBatches: parseInt(delayBatches) * 60000 || 60000
            }
        };

        // Start sending process in background
        startSendingProcess();

        // Clean up uploaded files
        fs.unlinkSync(csvFile.path);
        fs.unlinkSync(templateFile.path);

        res.json({ 
            message: 'Proceso de envío iniciado',
            totalRecipients: recipients.length 
        });

    } catch (error) {
        console.error('Error starting send process:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Get sending status
app.get('/api/status', (req, res) => {
    res.json({
        isRunning: sendingProcess.isRunning,
        currentIndex: sendingProcess.currentIndex,
        successCount: sendingProcess.successCount,
        errorCount: sendingProcess.errorCount,
        totalRecipients: sendingProcess.recipients.length,
        progress: sendingProcess.recipients.length > 0 
            ? Math.round(((sendingProcess.currentIndex + 1) / sendingProcess.recipients.length) * 100)
            : 0
    });
});

// Stop sending process
app.post('/api/stop', (req, res) => {
    sendingProcess.isRunning = false;
    res.json({ message: 'Proceso detenido' });
});

// Helper function to process CSV file
function processCsvFile(filePath) {
    return new Promise((resolve, reject) => {
        const recipients = [];
        
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Look for email column (case insensitive)
                const emailKey = Object.keys(row).find(key => 
                    key.toLowerCase().includes('email')
                );
                
                if (emailKey && row[emailKey]) {
                    const email = row[emailKey].trim();
                    if (isValidEmail(email)) {
                        recipients.push(email);
                    }
                }
            })
            .on('end', () => {
                resolve(recipients);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to delay execution
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main sending process
async function startSendingProcess() {
    const { config } = sendingProcess;
    
    console.log(`Starting to send ${sendingProcess.recipients.length} emails...`);
    
    for (let i = 0; i < sendingProcess.recipients.length && sendingProcess.isRunning; i++) {
        // Batch delay
        if (i > 0 && i % config.batchSize === 0) {
            console.log(`Batch pause (${i}/${sendingProcess.recipients.length})...`);
            await delay(config.delayBatches);
        }
        
        if (!sendingProcess.isRunning) break;
        
        const recipient = sendingProcess.recipients[i];
        sendingProcess.currentIndex = i;
        
        try {
            // Send email
            await config.transporter.sendMail({
                from: config.emailUser,
                to: recipient,
                subject: config.emailSubject,
                html: config.htmlTemplate
            });
            
            sendingProcess.successCount++;
            console.log(`Email sent successfully to: ${recipient}`);
            
        } catch (error) {
            sendingProcess.errorCount++;
            console.error(`Error sending to ${recipient}:`, error.message);
        }
        
        // Delay between emails
        if (i < sendingProcess.recipients.length - 1) {
            await delay(config.delayEmails);
        }
    }
    
    sendingProcess.isRunning = false;
    console.log(`Sending completed. Success: ${sendingProcess.successCount}, Errors: ${sendingProcess.errorCount}`);
}

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;