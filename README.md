# Enviador Masivo de Correos Electrónicos

## Descripción
Esta herramienta permite enviar correos electrónicos masivos de manera controlada y profesional, especialmente diseñada para campañas de marketing. Incluye características como envío por lotes, delays entre envíos y manejo de errores.

## Características
- ✉️ Envío masivo de correos electrónicos
- 📊 Procesamiento de destinatarios desde archivo CSV
- 🎨 Plantilla HTML responsive y profesional
- ⏱️ Control de velocidad de envío para evitar bloqueos
- 📈 Sistema de lotes para mejor gestión
- 🔍 Seguimiento y registro de envíos exitosos/fallidos

## Requisitos Previos
- Node.js instalado
- Cuenta de Gmail (o servicio de correo alternativo)
- Clave de aplicación para Gmail (recomendado por seguridad)

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/fridaruh/massive_mailing.git
```

2. Instala las dependencias:
```bash
npm install nodemailer csv-parser
```

3. Configura las variables de entorno o modifica directamente el archivo `email-sender.js`:
   - Correo electrónico
   - Contraseña/Clave de aplicación

## Estructura del CSV
El archivo `destinatarios.csv` debe tener la siguiente estructura:
``` csv
email,nombre
usuario1@ejemplo.com,Nombre 1
usuario2@ejemplo.com,Nombre 2
...
```

## Configuración
Los principales parámetros configurables son:
- `delayBetweenEmails`: 10 segundos entre cada correo
- `batchSize`: 50 correos por lote
- `delayBetweenBatches`: 1 minuto entre lotes

## Uso
1. Prepara tu archivo CSV con los destinatarios
2. Ejecuta el script:

```bash
node email-sender.js
```

4. El script enviará los correos en lotes, con un delay entre cada lote.
## Monitoreo
El script proporciona información en tiempo real sobre:
- Progreso del envío
- Cantidad de correos enviados
- Errores encontrados
- Estadísticas finales

## Consideraciones de Seguridad
- Utiliza claves de aplicación en lugar de contraseñas de cuenta
- Respeta las políticas de spam y límites de envío del proveedor de correo
- Incluye opción de desuscripción en los correos

## Limitaciones
- Gmail tiene un límite de 500 correos por día para cuentas regulares
- Se recomienda dividir el CSV en lotes más pequeños para evitar bloqueos

## Contribuciones
Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios propuestos.


