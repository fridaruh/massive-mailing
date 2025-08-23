// email-sender.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const csv = require('csv-parser');
const config = require('./config');

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.gmail.user,
    pass: config.gmail.appPassword
  }
});

// Función para leer la plantilla HTML
function loadEmailTemplate() {
  try {
    return fs.readFileSync('email-template.html', 'utf8');
  } catch (error) {
    console.error('Error al leer la plantilla HTML:', error.message);
    return '<h1>Error: No se pudo cargar la plantilla del correo</h1>';
  }
}

// Configuración del correo
const mailOptions = {
  from: config.gmail.user,
  subject: '🚀 Recap: Sesión 3 "Build in Public on Base"',
  html: loadEmailTemplate(),
  // También puedes usar texto plano con la propiedad 'text' en lugar de 'html'
};

// Leer destinatarios desde un archivo CSV
const recipients = [];
fs.createReadStream('destinatarios.csv')
  .pipe(csv())
  .on('data', (row) => {
    recipients.push(row.email); // Asume que hay una columna llamada 'email'
  })
  .on('end', () => {
    console.log('Lista de destinatarios cargada:', recipients.length);
    sendEmails(recipients);
  });

// Función para enviar correos con delay
async function sendEmails(emailList) {
  console.log(`Comenzando envío de ${emailList.length} correos...`);
  
  // Configuración de envío
  const delayBetweenEmails = 10000; // 10 segundos entre cada correo
  const batchSize = 50; // Número de correos por lote
  const delayBetweenBatches = 60000; // 1 minuto entre lotes
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < emailList.length; i++) {
    // Delay entre lotes
    if (i > 0 && i % batchSize === 0) {
      console.log(`Pausa entre lotes (${i}/${emailList.length})...`);
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
    
    const recipient = emailList[i];
    
    // Configurar destinatario para este correo
    mailOptions.to = recipient;
    
    try {
      // Enviar correo
      await transporter.sendMail(mailOptions);
      successCount++;
      console.log(`(${i+1}/${emailList.length}) Correo enviado a: ${recipient}`);
    } catch (error) {
      errorCount++;
      console.error(`Error al enviar a ${recipient}:`, error.message);
    }
    
    // Delay entre correos individuales
    if (i < emailList.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenEmails));
    }
  }
  
  console.log(`Envío completado. Éxitos: ${successCount}, Errores: ${errorCount}`);
}
