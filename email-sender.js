// email-sender.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const csv = require('csv-parser');

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail', // O cualquier otro servicio que uses
  auth: {
    user: 'tu_mail@gmail.com',
    pass: 'tu_password' // Usa una clave de aplicación para Gmail
  }
});

// Configuración del correo
const mailOptions = {
  from: 'tu_mail@gmail.com',
  subject: 'Sé que estás sintiendo el FOMO 🙊',
  html: `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡No te pierdas el AI Skills Challenge!</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            max-width: 150px;
            height: auto;
        }
        .banner {
            background: linear-gradient(135deg, #FFC107, #FF9800);
            color: #fff;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .content {
            padding: 20px 0;
        }
        .button {
            display: block;
            background: linear-gradient(135deg, #FFC107, #FF9800);
            color: white;
            text-decoration: none;
            padding: 15px 25px;
            text-align: center;
            border-radius: 50px;
            font-weight: bold;
            font-size: 18px;
            margin: 30px auto;
            max-width: 300px;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
        .emoji {
            font-size: 24px;
        }
        .highlight {
            font-weight: bold;
            color: #FF9800;
        }
        .countdown {
            font-size: 20px;
            font-weight: bold;
            color: #444;
            text-align: center;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>AI Skills Challenge</h1>
    </div>

    <div class="banner">
        ¡ÚLTIMAS HORAS! 50% DE DESCUENTO EN EL AI SKILLS CHALLENGE
    </div>

    <div class="content">
        <p>Hola,</p>
        
        <p>Sabemos que estás sintiendo <span class="highlight">FOMO</span> (Fear Of Missing Out) por todavía no ser parte del <strong>AI Skills Challenge</strong>.</p>
        
        <p>Tu instinto tiene razón: <span class="highlight">no querrás perderte esto</span>. Las personas que ya están dentro están:</p>
        
        <ul>
            <li>Desarrollando habilidades de IA que están <strong>revolucionando el mercado laboral</strong></li>
            <li>Aprendiendo a crear soluciones innovadoras que <strong>multiplican su productividad</strong></li>
            <li>Conectando con una comunidad de profesionales apasionados por la IA</li>
            <li>Posicionándose como <strong>expertos en el campo más demandado</strong> del momento</li>
        </ul>

        <div class="countdown">
            OFERTA VÁLIDA SOLO POR HOY
        </div>
        
        <p>Para que no te quedes fuera, te ofrecemos un <span class="highlight">código exclusivo con 50% DE DESCUENTO</span>: <span style="background-color: #FFF3E0; padding: 3px 8px; border-radius: 4px; font-weight: bold; letter-spacing: 1px;">FOMO</span>, válido ÚNICAMENTE por el día de hoy.</p>
        
        <p>Este es tu momento para unirte al movimiento que está definiendo el futuro profesional.</p>
    </div>

    <a href="https://nas.io/checkout-global?communityId=655e35d39dab7cd66c7fc515&communityCode=AI_THE_NEW_SEXY&requestor=whatsappSignup&linkClicked=https%3A%2F%2Fnas.io%2Fportal%2Fchallenges%2F67eaa5a1b12f4a4bf23e4edd&sourceInfoType=challenge&sourceInfoOrigin=67eaa5a1b12f4a4bf23e4edd" class="button">
        ¡APROVECHAR EL DESCUENTO!
    </a>

    <div class="content">
        <p style="text-align: center;">
            <a href="https://nas.io/ai-the-new-sexy-com/challenges/ai-skills-challenge-vol-6" style="color: #0066CC; text-decoration: underline;">
                https://nas.io/ai-the-new-sexy-com/challenges/ai-skills-challenge-vol-6
            </a>
        </p>
        
        <p style="font-style: italic; text-align: center;">
            "La inteligencia artificial no es el futuro, es el presente. Y quienes la dominan están un paso adelante."
        </p>
    </div>

    <div class="footer">
        <p>Si no deseas recibir más correos como este, haz clic <a href="#" style="color: #777;">aquí</a> para darte de baja.</p>
        <p>© 2025 AI The New Sexy. Todos los derechos reservados.</p>
    </div>
</body>
</html>
  `, 
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