# Script de Compilación de APK para CascoLegal
# Este script te guiará paso a paso para generar tu archivo .APK de Android usando el compilador en la nube gratuito de Expo (EAS).

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   COMPILADOR DE APK - CASCOLEGAL PANAMÁ   " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Moverse al directorio del proyecto móvil
cd "c:\Users\HP\Desktop\leyes panama actualizadas\apps\mobile"

# 2. Verificar o instalar EAS CLI
Write-Host "[1/3] Verificando instalador de Expo Application Services (EAS)..." -ForegroundColor Yellow
npm install -g eas-cli

# 3. Iniciar sesión en Expo (es gratuito)
Write-Host ""
Write-Host "[2/3] Iniciar sesión en tu cuenta de Expo." -ForegroundColor Yellow
Write-Host "Si no tienes una cuenta, el comando te permitirá crear una en 30 segundos de forma gratuita." -ForegroundColor Gray
npx eas-cli login

# 4. Configurar el proyecto para la compilación (EAS Build)
Write-Host ""
Write-Host "[3/3] Iniciando compilación de APK en la nube..." -ForegroundColor Yellow
Write-Host "Este comando enviará el código al servidor de compilación de Expo y te devolverá un enlace de descarga directa del archivo .APK." -ForegroundColor Gray
npx eas-cli build --platform android --profile preview

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "¡Proceso finalizado! Escanea el código QR final para descargar el APK." -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
