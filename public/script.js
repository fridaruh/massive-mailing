class EmailSender {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.initializeState();
    }

    initializeElements() {
        // File upload elements
        this.templateUpload = document.getElementById('templateUpload');
        this.templateFile = document.getElementById('templateFile');
        this.templatePreview = document.getElementById('templatePreview');
        this.templateName = document.getElementById('templateName');
        this.removeTemplate = document.getElementById('removeTemplate');
        
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
        this.sentCountElement = document.getElementById('sentCount');
        this.errorCountElement = document.getElementById('errorCount');
        this.remainingCountElement = document.getElementById('remainingCount');
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
        
        // Configuration elements - using fixed values
        this.batchSize = { value: 50 }; // Fixed batch size
        this.delayEmails = { value: 10 }; // Fixed delay between emails (seconds)
        this.delayBatches = { value: 1 }; // Fixed delay between batches (minutes)
    }
    
    bindEvents() {
        // File upload events
        if (this.templateUpload && this.templateFile) {
            this.templateUpload.addEventListener('click', () => this.templateFile.click());
            this.templateFile.addEventListener('change', (e) => this.handleTemplateUpload(e));
        }
        
        if (this.removeTemplate) {
            this.removeTemplate.addEventListener('click', () => this.removeTemplateFile());
        }
        
        if (this.csvUpload && this.csvFile) {
            this.csvUpload.addEventListener('click', () => this.csvFile.click());
            this.csvFile.addEventListener('change', (e) => this.handleCsvUpload(e));
        }
        
        if (this.removeCsv) {
            this.removeCsv.addEventListener('click', () => this.removeCsvFile());
        }
        
        // Drag and drop events
        if (this.templateUpload && this.templateFile) {
            this.setupDragAndDrop(this.templateUpload, this.templateFile);
        }
        if (this.csvUpload && this.csvFile) {
            this.setupDragAndDrop(this.csvUpload, this.csvFile);
        }
        

        
        // Control events
        if (this.startSending) {
            this.startSending.addEventListener('click', () => this.startSendingProcess());
        }
        if (this.stopSending) {
            this.stopSending.addEventListener('click', () => this.stopSendingProcess());
        }
        if (this.clearLog) {
            this.clearLog.addEventListener('click', () => this.clearLogContent());
        }
        
        // Modal events
        if (this.closeHelp && this.helpModal) {
            this.closeHelp.addEventListener('click', () => this.hideHelpModal());
            this.helpModal.addEventListener('click', (e) => {
                if (e.target === this.helpModal) this.hideHelpModal();
            });
        }
        
        // Settings events
        if (this.settingsButton) {
            this.settingsButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSettingsDropdown();
            });
        }
        
        if (this.gmailCredentialsOption) {
            this.gmailCredentialsOption.addEventListener('click', () => {
                this.showGmailCredentialsModal();
            });
        }
        
        if (this.sendConfigOption) {
            this.sendConfigOption.addEventListener('click', () => {
                this.showSendConfigModal();
            });
        }
        
        if (this.closeSettings && this.settingsModal) {
            this.closeSettings.addEventListener('click', () => this.hideSettingsModal());
            this.settingsModal.addEventListener('click', (e) => {
                if (e.target === this.settingsModal) this.hideSettingsModal();
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.settingsDropdown && !this.settingsButton?.contains(e.target)) {
                this.settingsDropdown.classList.remove('show');
            }
        });
    }

    setupDragAndDrop(uploadArea, fileInput) {
        if (!uploadArea || !fileInput) return;
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.add('dragover');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.remove('dragover');
            }, false);
        });
        
        uploadArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                fileInput.files = files;
                fileInput.dispatchEvent(new Event('change'));
            }
        }, false);
    }

    initializeState() {
        this.htmlTemplate = '';
        this.recipients = [];
        this.isSending = false;
        this.sentCount = 0;
        this.errorCount = 0;
        this.gmailCredentials = null;
        this.loadGmailCredentials();
        this.updateUI();
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
            if (this.templateName) this.templateName.textContent = file.name;
            if (this.templateUpload) this.templateUpload.style.display = 'none';
            if (this.templatePreview) this.templatePreview.style.display = 'block';
            this.updateUI();
        };
        reader.readAsText(file);
    }
    
    removeTemplateFile() {
        this.htmlTemplate = '';
        if (this.templateFile) this.templateFile.value = '';
        if (this.templateUpload) this.templateUpload.style.display = 'block';
        if (this.templatePreview) this.templatePreview.style.display = 'none';
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
            if (this.csvName) this.csvName.textContent = file.name;
            if (this.csvUpload) this.csvUpload.style.display = 'none';
            if (this.csvPreview) this.csvPreview.style.display = 'block';
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
        
        if (this.emailCount) this.emailCount.textContent = `${this.recipients.length} emails`;
        this.updateEstimates();
    }
    
    removeCsvFile() {
        this.recipients = [];
        if (this.csvFile) this.csvFile.value = '';
        if (this.csvUpload) this.csvUpload.style.display = 'block';
        if (this.csvPreview) this.csvPreview.style.display = 'none';
        this.updateUI();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    updateEstimates() {
        // Using fixed configuration values
        const batchSize = 50; // Fixed batch size
        const delayEmails = 10; // Fixed delay between emails (seconds)
        const delayBatches = 1; // Fixed delay between batches (minutes)
        
        if (this.recipients.length === 0) {
            if (this.totalRecipients) this.totalRecipients.textContent = '0';
            if (this.estimatedBatches) this.estimatedBatches.textContent = '0';
            if (this.estimatedTime) this.estimatedTime.textContent = '0 min';
            return;
        }
        
        const totalRecipients = this.recipients.length;
        const estimatedBatches = Math.ceil(totalRecipients / batchSize);
        const estimatedTime = Math.ceil((totalRecipients * delayEmails + (estimatedBatches - 1) * delayBatches * 60) / 60);
        
        if (this.totalRecipients) this.totalRecipients.textContent = totalRecipients;
        if (this.estimatedBatches) this.estimatedBatches.textContent = estimatedBatches;
        if (this.estimatedTime) this.estimatedTime.textContent = `${estimatedTime} min`;
        
        this.updateUI();
    }

    updateUI() {
        const hasTemplate = this.htmlTemplate.length > 0;
        const hasRecipients = this.recipients.length > 0;
        const hasCredentials = this.gmailCredentials !== null;
        const canSend = hasTemplate && hasRecipients && hasCredentials && !this.isSending;
        
        if (this.startSending) {
            this.startSending.disabled = !canSend;
        }
        
        if (this.stopSending) {
            this.stopSending.style.display = this.isSending ? 'flex' : 'none';
        }
        
        if (this.progressSection) {
            this.progressSection.style.display = this.isSending ? 'block' : 'none';
        }
        
        // Actualizar estado de credenciales
        if (this.statusText) {
            if (this.isSending) {
                this.statusText.textContent = 'Enviando...';
            } else if (canSend) {
                this.statusText.textContent = 'Listo para enviar';
            } else if (!hasCredentials) {
                this.statusText.textContent = 'Configurar Gmail';
            } else if (!hasTemplate) {
                this.statusText.textContent = 'Cargar plantilla';
            } else if (!hasRecipients) {
                this.statusText.textContent = 'Cargar destinatarios';
            } else {
                this.statusText.textContent = 'Listo';
            }
        }
    }

    showError(message) {
        console.error(message);
        // Aquí podrías implementar una notificación visual
        alert(message);
    }

    startSendingProcess() {
        if (!this.htmlTemplate || this.recipients.length === 0) {
            this.showError('Por favor carga una plantilla HTML y un archivo CSV antes de continuar');
            return;
        }
        
        // Verificar credenciales de Gmail
        const credentials = this.getGmailCredentials();
        if (!credentials) {
            return;
        }
        
        this.isSending = true;
        this.sentCount = 0;
        this.errorCount = 0;
        this.updateUI();
        
        // Log de inicio con credenciales
        this.logMessage('Iniciando proceso de envío real...');
        this.logMessage(`Usando cuenta: ${credentials.user}`);
        this.logMessage(`Total de destinatarios: ${this.recipients.length}`);
        
        // Envío real usando la API del servidor
        this.sendRealEmails(credentials);
    }

    stopSendingProcess() {
        this.isSending = false;
        this.logMessage('Proceso de envío detenido por el usuario');
        this.updateUI();
    }

    sendRealEmails(credentials) {
        let currentIndex = 0;
        const batchSize = 50; // Fixed batch size
        const delayEmails = 10; // Fixed delay between emails (seconds)
        const delayBatches = 1; // Fixed delay between batches (minutes)
        
        const sendBatch = async () => {
            if (!this.isSending || currentIndex >= this.recipients.length) {
                this.isSending = false;
                this.logMessage('Proceso de envío completado');
                this.updateUI();
                return;
            }
            
            const endIndex = Math.min(currentIndex + batchSize, this.recipients.length);
            const batch = this.recipients.slice(currentIndex, endIndex);
            
            this.logMessage(`Enviando lote ${Math.floor(currentIndex / batchSize) + 1}: ${batch.length} correos`);
            
            // Enviar cada correo del lote
            for (let i = 0; i < batch.length && this.isSending; i++) {
                const email = batch[i];
                
                try {
                    await this.sendSingleEmail(email, credentials);
                    this.sentCount++;
                    this.logMessage(`✓ Enviado a: ${email}`);
                    this.updateProgress();
                } catch (error) {
                    this.errorCount++;
                    this.logMessage(`✗ Error enviando a ${email}: ${error.message}`);
                    this.updateProgress();
                }
                
                // Delay entre correos (excepto el último del lote)
                if (i < batch.length - 1 && this.isSending) {
                    await this.delay(delayEmails * 1000);
                }
            }
            
            currentIndex = endIndex;
            
            // Programar siguiente lote
            if (this.isSending && currentIndex < this.recipients.length) {
                this.logMessage(`Pausa entre lotes (${delayBatches} minuto(s))...`);
                setTimeout(sendBatch, delayBatches * 60 * 1000);
            }
        };
        
        sendBatch();
    }

    async sendSingleEmail(email, credentials) {
        try {
            const response = await fetch('/api/send-single', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: email,
                    htmlContent: this.htmlTemplate,
                    subject: document.getElementById('emailSubject')?.value || 'Correo enviado desde Masive Mailing',
                    gmailUser: credentials.user,
                    gmailPassword: credentials.password
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error en el servidor');
            }
            
            const result = await response.json();
            return result;
            
        } catch (error) {
            throw new Error(`Error de red: ${error.message}`);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateProgress() {
        const total = this.recipients.length;
        const sent = this.sentCount;
        const percent = Math.round((sent / total) * 100);
        
        if (this.progressFill) this.progressFill.style.width = `${percent}%`;
        if (this.progressPercent) this.progressPercent.textContent = `${percent}%`;
        if (this.sentCountElement) this.sentCountElement.textContent = sent;
        if (this.remainingCountElement) this.remainingCountElement.textContent = total - sent;
        
        if (this.progressStatus) {
            if (percent === 100) {
                this.progressStatus.textContent = 'Completado';
            } else if (percent > 0) {
                this.progressStatus.textContent = 'Enviando...';
            }
        }
    }

    logMessage(message) {
        if (this.logContent) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.innerHTML = `<span class="log-time">[${timestamp}]</span> ${message}`;
            this.logContent.appendChild(logEntry);
            this.logContent.scrollTop = this.logContent.scrollHeight;
        }
        console.log(message);
    }

    clearLogContent() {
        if (this.logContent) {
            this.logContent.innerHTML = '';
        }
    }

    toggleSettingsDropdown() {
        if (this.settingsDropdown) {
            this.settingsDropdown.classList.toggle('show');
        }
    }

    showGmailCredentialsModal() {
        if (this.settingsModal && this.settingsModalTitle && this.settingsModalContent) {
            this.settingsModalTitle.textContent = 'Credenciales de Gmail';
            this.settingsModalContent.innerHTML = `
                <div class="form-group">
                    <label for="gmailUser">Correo de Gmail</label>
                    <input type="email" id="gmailUser" placeholder="tu-email@gmail.com" value="${this.gmailCredentials?.user || ''}">
                </div>
                <div class="form-group">
                    <label for="gmailPassword">Clave de aplicación</label>
                    <input type="password" id="gmailPassword" placeholder="Tu clave de aplicación" value="${this.gmailCredentials?.password || ''}">
                    <small>No uses tu contraseña normal de Gmail</small>
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').style.display='none'">Cancelar</button>
                    <button class="btn-primary" onclick="window.emailSender.saveGmailCredentials()">Guardar</button>
                </div>
            `;
            this.settingsModal.style.display = 'flex';
        }
    }

    showSendConfigModal() {
        if (this.settingsModal && this.settingsModalTitle && this.settingsModalContent) {
            this.settingsModalTitle.textContent = 'Configuración de Envío';
            this.settingsModalContent.innerHTML = `
                <div class="form-group">
                    <label for="modalBatchSize">Tamaño del lote</label>
                    <input type="number" id="modalBatchSize" value="${this.batchSize?.value || 50}" min="1" max="100">
                </div>
                <div class="form-group">
                    <label for="modalDelayEmails">Delay entre correos (segundos)</label>
                    <input type="number" id="modalDelayEmails" value="${this.delayEmails?.value || 10}" min="1" max="60">
                </div>
                <div class="form-group">
                    <label for="modalDelayBatches">Delay entre lotes (minutos)</label>
                    <input type="number" id="modalDelayBatches" value="${this.delayBatches?.value || 1}" min="1" max="10">
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').style.display='none'">Cancelar</button>
                    <button class="btn-primary" onclick="this.saveSendConfig()">Guardar</button>
                </div>
            `;
            this.settingsModal.style.display = 'flex';
        }
    }

    hideSettingsModal() {
        if (this.settingsModal) {
            this.settingsModal.style.display = 'none';
        }
    }

    hideHelpModal() {
        if (this.helpModal) {
            this.helpModal.style.display = 'none';
        }
    }

    loadGmailCredentials() {
        try {
            const saved = localStorage.getItem('gmailCredentials');
            if (saved) {
                this.gmailCredentials = JSON.parse(saved);
                this.logMessage('Credenciales de Gmail cargadas desde almacenamiento local');
            }
        } catch (error) {
            console.error('Error al cargar credenciales:', error);
        }
    }

    saveGmailCredentials() {
        const user = document.getElementById('gmailUser')?.value;
        const password = document.getElementById('gmailPassword')?.value;
        
        if (!user || !password) {
            this.showError('Por favor completa todos los campos');
            return;
        }
        
        if (!this.isValidEmail(user)) {
            this.showError('Por favor ingresa un correo válido');
            return;
        }
        
        // Guardar credenciales
        this.gmailCredentials = { user, password };
        
        try {
            localStorage.setItem('gmailCredentials', JSON.stringify(this.gmailCredentials));
            this.logMessage('✓ Credenciales de Gmail guardadas exitosamente');
            
            // Mostrar mensaje de confirmación
            this.showSuccessMessage('Los cambios han sido guardados exitosamente');
            
            // Cerrar modal
            this.hideSettingsModal();
            
            // Actualizar UI
            this.updateUI();
            
        } catch (error) {
            console.error('Error al guardar credenciales:', error);
            this.showError('Error al guardar las credenciales');
        }
    }

    showSuccessMessage(message) {
        // Crear notificación de éxito
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        // Agregar al body
        document.body.appendChild(notification);
        
        // Mostrar con animación
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getGmailCredentials() {
        if (!this.gmailCredentials) {
            this.showError('Por favor configura las credenciales de Gmail primero');
            return null;
        }
        return this.gmailCredentials;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.emailSender = new EmailSender();
});