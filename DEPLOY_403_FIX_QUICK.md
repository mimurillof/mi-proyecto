# 🚀 DESPLIEGUE URGENTE - Fix Error 403

## ⚡ Pasos Rápidos (5 minutos)

### 1️⃣ **Backend (Heroku)**

```bash
cd mi-proyecto-backend
git add api/supabase_auth_router.py main.py
git commit -m "fix: add token exchange endpoint to resolve 403 errors"
git push heroku main
```

**Verificar:**
```bash
heroku logs --tail
# Debe mostrar: "Application startup complete"
```

---

### 2️⃣ **Next.js Login (Vercel)**

```bash
cd horizon-next-app

# Agregar variable de entorno en Vercel Dashboard:
# NEXT_PUBLIC_BACKEND_URL = https://horizon-backend-316b23e32b8b.herokuapp.com

git add src/app/page.tsx .env.local
git commit -m "fix: integrate JWT token exchange from backend"
git push origin main

# O desplegar directamente
vercel --prod
```

---

### 3️⃣ **React App (Vercel)**

```bash
cd mi-proyecto

# Verificar variable de entorno en Vercel:
# VITE_API_URL = https://horizon-backend-316b23e32b8b.herokuapp.com

git add src/App.tsx src/config/api.ts src/services/homeService.ts
git commit -m "fix: add auth guard and 403 error handling"
git push origin main

# O desplegar directamente
vercel --prod
```

---

## ✅ Test Rápido

1. **Abrir:** https://horizon-login.vercel.app/ (o tu URL de Next.js)
2. **Login** con tus credenciales
3. **Verificar consola del navegador (F12):**
   - ✅ "JWT del backend obtenido exitosamente"
   - ✅ "Token guardado en localStorage"
4. **Verificar redirección** a la app React
5. **Verificar que NO hay error 403**

---

## 🆘 Si algo falla

### **Error al desplegar backend:**

```bash
# Ver logs completos
heroku logs --tail --app horizon-backend

# Reiniciar dynos
heroku restart --app horizon-backend
```

### **Frontend no encuentra token:**

```javascript
// En consola del navegador (F12)
localStorage.getItem('token')
// Si retorna null, probar logout y login nuevamente
```

### **Still 403:**

1. Limpiar caché del navegador
2. Probar en modo incógnito
3. Verificar que el backend esté actualizado:
   ```bash
   curl https://horizon-backend-316b23e32b8b.herokuapp.com/api/supabase-auth/login-direct
   # Debe responder con 405 Method Not Allowed (es correcto, significa que existe)
   ```

---

## 📋 URLs de Producción

| Servicio | URL |
|----------|-----|
| Backend | https://horizon-backend-316b23e32b8b.herokuapp.com |
| Next.js Login | https://horizon-login.vercel.app |
| React App | https://mi-proyecto-topaz-omega.vercel.app |

---

## 🎯 Resultado Esperado

```
Usuario Login → Backend Token → React App Dashboard
           ✅             ✅              ✅
```

**Sin errores 403. Sin redirecciones infinitas. Todo funcionando.**

---

**Tiempo estimado total:** 5-10 minutos
**Prioridad:** 🔥 URGENTE
