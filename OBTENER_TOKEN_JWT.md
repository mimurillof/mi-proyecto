# 🚀 SOLUCIÓN RÁPIDA: Obtener Token JWT (5 minutos)

## 📝 **PASO 1: Registrar Usuario**

Ejecuta en PowerShell:

```powershell
$body = @{
    email = "test@horizonportfolio.com"
    password = "test1234"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://horizon-backend-316b23e32b8b.herokuapp.com/api/auth/register" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

**Salida esperada:**
```
message    : Usuario creado exitosamente
user_id    : 1
```

---

## 📝 **PASO 2: Hacer Login y Obtener Token**

```powershell
$body = @{
    email = "test@horizonportfolio.com"
    password = "test1234"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://horizon-backend-316b23e32b8b.herokuapp.com/api/auth/login" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body

Write-Host "✅ TOKEN JWT:" -ForegroundColor Green
Write-Host $response.access_token
```

**Salida esperada:**
```
✅ TOKEN JWT:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGhvcml6b25wb3J0Zm9saW8uY29tIiwiZXhwIjoxNzI5MzE2NDAwfQ...
```

---

## 📝 **PASO 3: Guardar Token en el Navegador**

1. Abre tu app en el navegador: `http://localhost:5173`
2. Presiona **F12** para abrir DevTools
3. Ve a la pestaña **Console**
4. Copia y pega (reemplaza `<TOKEN>` con tu token real):

```javascript
localStorage.setItem('token', '<TOKEN_AQUI>');
console.log('✅ Token guardado:', localStorage.getItem('token').substring(0, 50) + '...');
```

5. **Recarga la página** (F5)

---

## ✅ **VERIFICACIÓN**

Ahora deberías ver en DevTools → Network:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Y los endpoints deberían retornar **200 OK** en lugar de 403.

---

## 🎯 **SCRIPT COMPLETO (Copiar y Pegar)**

```powershell
# PASO 1: Registrar
Write-Host "📝 Registrando usuario..." -ForegroundColor Cyan
$registerBody = @{
    email = "test@horizonportfolio.com"
    password = "test1234"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "https://horizon-backend-316b23e32b8b.herokuapp.com/api/auth/register" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $registerBody
    Write-Host "✅ Usuario registrado: $($registerResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Usuario ya existe, continuando con login..." -ForegroundColor Yellow
}

# PASO 2: Login
Write-Host "`n🔐 Haciendo login..." -ForegroundColor Cyan
$loginBody = @{
    email = "test@horizonportfolio.com"
    password = "test1234"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "https://horizon-backend-316b23e32b8b.herokuapp.com/api/auth/login" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $loginBody

Write-Host "✅ Login exitoso!" -ForegroundColor Green
Write-Host "`n🎫 TOKEN JWT:" -ForegroundColor Cyan
Write-Host $loginResponse.access_token -ForegroundColor White

# PASO 3: Instrucciones para el navegador
Write-Host "`n📋 COPIA ESTE COMANDO EN LA CONSOLA DEL NAVEGADOR:" -ForegroundColor Yellow
Write-Host "localStorage.setItem('token', '$($loginResponse.access_token)');" -ForegroundColor White
Write-Host "`nLuego recarga la página (F5)" -ForegroundColor Cyan
```

---

## 🚀 **EJECUTAR**

1. Abre PowerShell
2. Copia y pega el script completo
3. Presiona Enter
4. Copia el comando `localStorage.setItem(...)` que aparece
5. Pégalo en la consola del navegador
6. Recarga la página

**¡LISTO!** Ahora tu app debería funcionar sin errores 403.
