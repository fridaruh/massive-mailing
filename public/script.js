class EmailSender {
    constructor() {
        this.recipients = [];
        this.htmlTemplate = '';
        this.isRunning = false;
        this.currentIndex = 0;
        this.successCount = 0;
        this.errorCount = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.updateUI();
    }
    
    initializeElements() {
        // Form elements
        this.emailUser = document.getElementById('emailUser');
        this.appPassword = document.getElementById('appPassword');
        this.batchSize = document.getElementById('batchSize');
        this.delayEmails = document.getElementById('delayEmails');
        this.delayBatches = document.getElementById('delayBatches');
        this.emailSubject = document.getElementById('emailSubject');
        
        // File upload elements
        this.templateUpload = document.getElementById('templateUpload');
        this.templateFile = document.getElementById('templateFile');
            if (uploadArea && fileInput) {
                uploadArea.addEventListener('click', () => fileInput.click());
                uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
                uploadArea.addEventListener('drop', (e) => this.handleDrop(e, fileInput, handler));
                fileInput.addEventListener('change', handler);
            }
        this.csvUpload = document.getElementById('csvUpload');
        this.csvFile = document.getElementById('csvFile');
        this.csvPreview = document.getElementById('csvPreview');
        this.csvName = document.getElementById('csvName');
        this.emailCount = document.getElementById('emailCount');
        this.removeCsv = document.getElementById('removeCsv');
        
        // Summary elements
        this.totalRecipients = document.getElementById('totalRecipients');
        this.estimatedBatches = document.getElementById('estimatedBatches');
        this.estimatedTime = document.getElementById('estimatedTime');
        
        // Control elements
        this.startSending = document.getElementById('startSending');
        this.stopSending = document.getElementById('stopSending');
        
        // Progress elements
        this.progressSection = document.getElementById('progressSection');
        this.sentCount = document.getElementById('sentCount');
        this.errorCount = document.getElementById('errorCount');
        this.remainingCount = document.getElementById('remainingCount');
        this.progressFill = document.getElementById('progressFill');
        this.progressPercent = document.getElementById('progressPercent');
        this.progressStatus = document.getElementById('progressStatus');
        this.logContent = document.getElementById('logContent');
        this.clearLog = document.getElementById('clearLog');
        
        // Status elements
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
        
        // Modal elements
        this.helpModal = document.getElementById('helpModal');
        this.helpLink = document.getElementById('helpLink');
        this.closeHelp = document.getElementById('closeHelp');
        
        // Settings elements
        this.settingsButton = document.getElementById('settingsButton');
        this.settingsDropdown = document.getElementById('settingsDropdown');
        this.gmailCredentialsOption = document.getElementById('gmailCredentialsOption');
        this.sendConfigOption = document.getElementById('sendConfigOption');
        this.settingsModal = document.getElementById('settingsModal');
        this.settingsModalTitle = document.getElementById('settingsModalTitle');
        this.settingsModalContent = document.getElementById('settingsModalContent');
        this.closeSettings = document.getElementById('closeSettings');
    }
    
    bindEvents() {
        // File upload events
        this.templateUpload.addEventListener('click', () => this.templateFile.click());
        this.templateFile.addEventListener('change', (e) => this.handleTemplateUpload(e));
        this.removeTemplate.addEventListener('click', () => this.removeTemplateFile());
        
        this.csvUpload.addEventListener('click', () => this.csvFile.click());
        this.csvFile.addEventListener('change', (e) => this.handleCsvUpload(e));
        this.removeCsv.addEventListener('click', () => this.removeCsvFile());
        
        // Drag and drop events
        this.setupDragAndDrop(this.templateUpload, this.templateFile);
        this.setupDragAndDrop(this.csvUpload, this.csvFile);
        
        // Form change events
        [this.batchSize, this.delayEmails, this.delayBatches].forEach(input => {
            input.addEventListener('input', () => this.updateEstimates());
        });
        
        // Control events
        this.startSending.addEventListener('click', () => this.startSendingProcess());
        this.stopSending.addEventListener('click', () => this.stopSendingProcess());
        this.clearLog.addEventListener('click', () => this.clearLogContent());
        
        // Modal events
        this.helpLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showHelpModal();
        });
        this.closeHelp.addEventListener('click', () => this.hideHelpModal());
        this.helpModal.addEventListener('click', (e) => {
            if (e.target === this.helpModal) this.hideHelpModal();
        });
        
        // Settings events
        this.settingsButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSettingsDropdown();
        });
        
        this.gmailCredentialsOption.addEventListener('click', () => {
            this.showGmailCredentialsModal();
        });
        
        this.sendConfigOption.addEventListener('click', () => {
            this.showSendConfigModal();
        });
        
        this.closeSettings.addEventListener('click', () => this.hideSettingsModal());
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.hideSettingsModal();
        });
        
        // Close dropdown when clicking outside
        const buttons = [
            { id: 'startSending', handler: this.startSending.bind(this) },
            { id: 'stopSending', handler: this.stopSending.bind(this) },
            { id: 'clearLog', handler: this.clearLog.bind(this) },
            { id: 'removeTemplate', handler: this.removeTemplate.bind(this) },
            { id: 'removeCsv', handler: this.removeCsv.bind(this) }
        ];

        buttons.forEach(({ id, handler }) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', handler);
            }
        });
    }
    setupDragAndDrop(uploadArea, fileInput) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        }
        )
        const settingsElements = [
            { id: 'settingsButton', handler: this.toggleSettingsDropdown.bind(this) },
            { id: 'gmailCredentialsOption', handler: () => this.openSettingsModal('gmail') },
            { id: 'sendConfigOption', handler: () => this.openSettingsModal('sendConfig') },
            { id: 'closeSettings', handler: this.closeSettingsModal.bind(this) }
        ];

        settingsElements.forEach(({ id, handler }) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', handler);
            }
        }
        )
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
        });
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target.id === 'settingsModal') {
                    this.closeSettingsModal();
                }
            });
        }

        
        uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
            }
            if (settingsMenu && dropdown && !settingsMenu.contains(e.target)) {
                fileInput.dispatchEvent(new Event('change'));
            }
        });
    }
    
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    handleTemplateUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.name.toLowerCase().endsWith('.html')) {
            this.showError('Por favor selecciona un archivo HTML válido');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.htmlTemplate = e.target.result;
            this.templateName.textContent = file.name;
            this.templateUpload.style.display = 'none';
            this.templatePreview.style.display = 'block';
            this.updateUI();
        };
        reader.readAsText(file);
    }
    
    removeTemplateFile() {
        this.htmlTemplate = '';
        this.templateFile.value = '';
        this.templateUpload.style.display = 'block';
        this.templatePreview.style.display = 'none';
        this.updateUI();
    }
    
    handleCsvUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.name.toLowerCase().endsWith('.csv')) {
            this.showError('Por favor selecciona un archivo CSV válido');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.parseCsvData(e.target.result);
            this.csvName.textContent = file.name;
            this.csvUpload.style.display = 'none';
            this.csvPreview.style.display = 'block';
            this.updateUI();
        };
        reader.readAsText(file);
    }
    
    parseCsvData(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const emailIndex = headers.findIndex(h => h.includes('email'));
        if (emailIndex === -1) {
            this.showError('El archivo CSV debe contener una columna "email"');
            return;
        }
        
        this.recipients = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const email = values[emailIndex]?.trim();
            if (email && this.isValidEmail(email)) {
                this.recipients.push(email);
            }
        }
        
        this.emailCount.textContent = `${this.recipients.length} emails`;
        this.updateEstimates();
    }
    
    removeCsvFile() {
        this.recipients = [];
        this.csvFile.value = '';
        this.csvUpload.style.display = 'block';
        this.csvPreview.style.display = 'none';
        this.updateUI();
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    updateEstimates() {
        const recipientCount = this.recipients.length;
        const batchSize = parseInt(this.batchSize.value) || 50;
        const delayEmails = parseInt(this.delayEmails.value) || 10;
        const delayBatches = parseInt(this.delayBatches.value) || 1;
        
        this.totalRecipients.textContent = recipientCount;
        
        if (recipientCount > 0) {
            const batches = Math.ceil(recipientCount / batchSize);
            this.estimatedBatches.textContent = batches;
            
            // Calculate estimated time
            const emailTime = recipientCount * delayEmails; // seconds
            const batchTime = (batches - 1) * delayBatches * 60; // seconds
            const totalSeconds = emailTime + batchTime;
            const minutes = Math.ceil(totalSeconds / 60);
            
            this.estimatedTime.textContent = `${minutes} min`;
        } else {
            this.estimatedBatches.textContent = '0';
            this.estimatedTime.textContent = '0 min';
        }
    }
    
    updateUI() {
        const hasCredentials = this.emailUser.value && this.appPassword.value;
        const hasTemplate = this.htmlTemplate.length > 0;
        const hasRecipients = this.recipients.length > 0;
        const hasSubject = this.emailSubject.value.trim().length > 0;
        
        const canStart = hasCredentials && hasTemplate && hasRecipients && hasSubject && !this.isRunning;
        this.startSending.disabled = !canStart;
        
        // Update status
        if (this.isRunning) {
            this.statusIndicator.className = 'status-indicator sending';
            this.statusText.textContent = 'Enviando...';
        } else if (canStart) {
            this.statusIndicator.className = 'status-indicator';
            this.statusText.textContent = 'Listo';
        } else {
            this.statusIndicator.className = 'status-indicator';
            this.statusText.textContent = 'Configurando...';
        }
    }
    
    async startSendingProcess() {
        if (!this.validateConfiguration()) return;
        
        this.isRunning = true;
        this.currentIndex = 0;
        this.successCount = 0;
        this.errorCount = 0;
        
        this.startSending.style.display = 'none';
        this.stopSending.style.display = 'inline-flex';
        this.progressSection.style.display = 'block';
        
        this.updateProgress();
        this.updateUI();
        
        this.addLogEntry('info', 'Iniciando proceso de envío masivo...');
        
        // Simulate sending process
        await this.simulateSendingProcess();
    }
    
    stopSendingProcess() {
        this.isRunning = false;
        this.startSending.style.display = 'inline-flex';
        this.stopSending.style.display = 'none';
        
        this.addLogEntry('info', 'Proceso detenido por el usuario');
        this.updateUI();
    }
    
    async simulateSendingProcess() {
        const batchSize = parseInt(this.batchSize.value) || 50;
        const delayEmails = parseInt(this.delayEmails.value) * 1000 || 10000;
        const delayBatches = parseInt(this.delayBatches.value) * 60000 || 60000;
        
        for (let i = 0; i < this.recipients.length && this.isRunning; i++) {
            // Batch delay
            if (i > 0 && i % batchSize === 0) {
                this.addLogEntry('info', `Pausa entre lotes (${i}/${this.recipients.length})...`);
                this.progressStatus.textContent = 'Pausa entre lotes...';
                await this.delay(delayBatches);
            }
            
            if (!this.isRunning) break;
            
            const email = this.recipients[i];
            this.currentIndex = i;
            
            // Simulate sending
            this.progressStatus.textContent = `Enviando a ${email}...`;
            
            // Simulate success/failure (90% success rate)
            const success = Math.random() > 0.1;
            
            if (success) {
                this.successCount++;
                this.addLogEntry('success', `Correo enviado exitosamente a: ${email}`);
            } else {
                this.errorCount++;
                this.addLogEntry('error', `Error al enviar a ${email}: Simulación de error`);
            }
            
            this.updateProgress();
            
            // Delay between emails
            if (i < this.recipients.length - 1) {
                await this.delay(delayEmails);
            }
        }
        
        if (this.isRunning) {
            this.completeProcess();
        }
    }
    
    completeProcess() {
        this.isRunning = false;
        this.startSending.style.display = 'inline-flex';
        this.stopSending.style.display = 'none';
        
        this.progressStatus.textContent = 'Proceso completado';
        this.addLogEntry('info', `Envío completado. Éxitos: ${this.successCount}, Errores: ${this.errorCount}`);
        
        this.updateUI();
    }
    
    updateProgress() {
        const total = this.recipients.length;
        const processed = this.currentIndex + 1;
        const remaining = total - processed;
        const percentage = Math.round((processed / total) * 100);
        
        this.sentCount.textContent = this.successCount;
        this.errorCount.textContent = this.errorCount;
        this.remainingCount.textContent = remaining;
        
        this.progressFill.style.width = `${percentage}%`;
        this.progressPercent.textContent = `${percentage}%`;
    }
    
    addLogEntry(type, message) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerHTML = `
            <div class="log-timestamp">${timestamp}</div>
            <div>${message}</div>
        `;
        
        this.logContent.appendChild(entry);
        this.logContent.scrollTop = this.logContent.scrollHeight;
    }
    
    clearLogContent() {
        this.logContent.innerHTML = '';
    }
    
    validateConfiguration() {
        if (!this.emailUser.value) {
            this.showError('Por favor ingresa tu correo electrónico');
            return false;
        }
        
        if (!this.appPassword.value) {
            this.showError('Por favor ingresa tu clave de aplicación');
            return false;
        }
        
        if (!this.htmlTemplate) {
            this.showError('Por favor carga una plantilla HTML');
            return false;
        }
        
        if (this.recipients.length === 0) {
            this.showError('Por favor carga una lista de destinatarios');
            return false;
        }
        
        if (!this.emailSubject.value.trim()) {
            this.showError('Por favor ingresa un asunto para el correo');
            return false;
        }
        
        return true;
    }
    
    showError(message) {
        // Simple error display - in a real app you'd want a proper notification system
        alert(message);
    }
    
    showHelpModal() {
        this.helpModal.style.display = 'flex';
    }
    
    hideHelpModal() {
        this.helpModal.style.display = 'none';
    }
    
    toggleSettingsDropdown() {
        this.settingsDropdown.classList.toggle('show');
    }
    
    hideSettingsDropdown() {
        this.settingsDropdown.classList.remove('show');
    }
    
    showGmailCredentialsModal() {
        this.hideSettingsDropdown();
        this.settingsModalTitle.textContent = 'Credenciales de Gmail';
        this.settingsModalContent.innerHTML = `
            <div class="form-group">
                <label for="modalEmailUser">Correo electrónico</label>
                <input type="email" id="modalEmailUser" placeholder="tu-email@gmail.com" value="${this.emailUser.value}">
            </div>
            <div class="form-group">
                <label for="modalAppPassword">Clave de aplicación</label>
                <input type="password" id="modalAppPassword" placeholder="Clave de aplicación de Gmail" value="${this.appPassword.value}">
            </div>
            <div class="help-text">
                <a href="#" id="modalHelpLink">¿Cómo obtener una clave de aplicación?</a>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" id="cancelGmailSettings">Cancelar</button>
                <button class="btn-primary" id="saveGmailSettings">Guardar</button>
            </div>
        `;
        
        // Bind events for modal form
        document.getElementById('modalHelpLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideSettingsModal();
            this.showHelpModal();
        });
        
        document.getElementById('cancelGmailSettings').addEventListener('click', () => {
            this.hideSettingsModal();
        });
        
        document.getElementById('saveGmailSettings').addEventListener('click', () => {
            this.emailUser.value = document.getElementById('modalEmailUser').value;
            this.appPassword.value = document.getElementById('modalAppPassword').value;
            this.hideSettingsModal();
            this.updateUI();
        });
        
        this.settingsModal.style.display = 'flex';
    }
    
    showSendConfigModal() {
        this.hideSettingsDropdown();
        this.settingsModalTitle.textContent = 'Configuración de Envío';
        this.settingsModalContent.innerHTML = `
            <div class="form-group">
                <label for="modalBatchSize">Correos por lote</label>
                <input type="number" id="modalBatchSize" value="${this.batchSize.value}" min="1" max="100">
            </div>
            <div class="form-group">
                <label for="modalDelayEmails">Delay entre correos (segundos)</label>
                <input type="number" id="modalDelayEmails" value="${this.delayEmails.value}" min="1" max="60">
            </div>
            <div class="form-group">
                <label for="modalDelayBatches">Delay entre lotes (minutos)</label>
                <input type="number" id="modalDelayBatches" value="${this.delayBatches.value}" min="1" max="10">
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" id="cancelSendSettings">Cancelar</button>
                <button class="btn-primary" id="saveSendSettings">Guardar</button>
            </div>
        `;
        
        // Bind events for modal form
        document.getElementById('cancelSendSettings').addEventListener('click', () => {
            this.hideSettingsModal();
        });
        
        document.getElementById('saveSendSettings').addEventListener('click', () => {
            this.batchSize.value = document.getElementById('modalBatchSize').value;
            this.delayEmails.value = document.getElementById('modalDelayEmails').value;
            this.delayBatches.value = document.getElementById('modalDelayBatches').value;
            this.hideSettingsModal();
            this.updateEstimates();
        });
        
        this.settingsModal.style.display = 'flex';
    }
    
    hideSettingsModal() {
        this.settingsModal.style.display = 'none';
    }
    
    delay(ms) {
        ['emailSubject'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', this.updateSendSummary.bind(this));
            }
        }
        )
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new EmailSender();
});