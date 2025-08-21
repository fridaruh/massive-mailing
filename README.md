# Masive Mailing - Envío Masivo de Correos

Este proyecto permite enviar correos electrónicos masivos usando Node.js y Nodemailer, con una plantilla HTML separada para facilitar la edición del contenido.

## 📁 Estructura del Proyecto

```
Masive mailing/
├── email-sender.js           # Script principal para envío de correos
├── email-template.html       # Plantilla HTML del correo (separada)
├── config.example.js         # Ejemplo de configuración
├── destinatarios.example.csv # Ejemplo de lista de destinatarios
├── package.json              # Dependencias del proyecto
├── .gitignore               # Archivos a ignorar en Git
└── README.md                # Este archivo
```

**📝 Nota**: Los archivos `config.js` y `destinatarios.csv` no están incluidos en el repositorio por seguridad.

## 🚀 Características

- **Plantilla HTML separada**: El contenido del correo está en `email-template.html` para facilitar la edición
- **Envío masivo**: Procesa listas de correos desde archivos CSV
- **Control de velocidad**: Incluye delays entre envíos para evitar bloqueos
- **Manejo de errores**: Registra éxitos y fallos en el envío
- **Lotes**: Procesa correos en lotes con pausas entre ellos

## ⚙️ Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar credenciales
1. Copia `config.example.js` como `config.js`:
```bash
cp config.example.js config.js
```

2. Edita `config.js` con tus credenciales de Gmail:
```javascript
module.exports = {
  gmail: {
    user: 'tu-email@gmail.com',
    appPassword: 'tu-clave-de-aplicacion'
  }
};
```

**⚠️ Importante**: Usa una clave de aplicación de Gmail, no tu contraseña normal.

### 3. Preparar lista de destinatarios
1. Copia `destinatarios.example.csv` como `destinatarios.csv`:
```bash
cp destinatarios.example.csv destinatarios.csv
```

2. Edita `destinatarios.csv` con tu lista real de correos. El archivo debe tener una columna llamada `email`:
```csv
email
usuario1@ejemplo.com
usuario2@ejemplo.com
```

### 4. Editar la plantilla del correo
Modifica `email-template.html` para cambiar el contenido, estilos y estructura del correo.

## 📧 Uso

### Enviar correos
```bash
node email-sender.js
```

### Configuración de envío
El script incluye configuraciones para controlar la velocidad del envío:
- **Delay entre correos**: 10 segundos
- **Tamaño de lote**: 50 correos
- **Pausa entre lotes**: 1 minuto

## 🎨 Personalización

### Editar la plantilla HTML
- Abre `email-template.html` en tu editor
- Modifica el contenido, estilos CSS y estructura
- Guarda el archivo
- El script automáticamente usará la nueva versión

### Cambiar el asunto
Edita la línea en `email-sender.js`:
```javascript
subject: '🚀 Tu nuevo asunto aquí',
```

## 🔧 Dependencias

- `nodemailer`: Para envío de correos
- `csv-parser`: Para leer archivos CSV
- `fs`: Para leer archivos del sistema

## 📝 Notas

- El script incluye manejo de errores para archivos HTML faltantes
- Si `email-template.html` no se puede leer, se enviará un mensaje de error simple
- Los delays están configurados para evitar bloqueos por spam
- Considera usar un servicio de email transaccional para envíos muy grandes

## 🚨 Limitaciones

- Gmail tiene límites diarios de envío (500-2000 correos)
- Los delays son necesarios para evitar bloqueos
- Para envíos masivos profesionales, considera servicios como SendGrid o Mailgun

## 🔒 Seguridad

- **Nunca subas `config.js` o `destinatarios.csv` a Git**
- El archivo `.gitignore` está configurado para proteger estos archivos
- Usa archivos de ejemplo para documentar la estructura
- Las credenciales reales deben mantenerse privadas

## 📞 Soporte

Si tienes problemas:
1. Verifica que `email-template.html` existe y es legible
2. Confirma que las credenciales en `config.js` son correctas
3. Asegúrate de que `destinatarios.csv` tiene el formato correcto
4. Revisa la consola para mensajes de error detallados


