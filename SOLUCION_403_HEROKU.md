# 🚨 SOLUCIÓN URGENTE: 403 Forbidden en Heroku

**Fecha:** 19 de octubre de 2025  
**Problema:** Frontend no envía token JWT → Todos los endpoints retornan 403

---

## 🔍 **DIAGNÓSTICO**

### **Evidencia en Logs de Heroku:**
```
2025-10-19T02:52:41.502 - "GET /api/portfolio-manager/summary HTTP/1.1" 403
2025-10-19T02:52:42.488 - "GET /api/portfolio/live-metrics HTTP/1.1" 403
```

### **Problema Raíz:**
El frontend **NO tiene sistema de login**, por lo que:
1. No hay token JWT en `localStorage`
2. Todas las peticiones van sin header `Authorization: Bearer <token>`
3. Backend rechaza con 403 Forbidden

---

## ✅ **SOLUCIÓN INMEDIATA**

Tienes **DOS opciones**:

### **Opción A: Testing Rápido (10 minutos)**
Crear un usuario manualmente y obtener el token para testing.

### **Opción B: Login Completo (30 minutos)**
Integrar sistema de login en tu app React.

---

## 🎯 **OPCIÓN A: TESTING RÁPIDO**

### **Paso 1: Crear usuario en la base de datos**

Conéctate a tu base de datos PostgreSQL (Heroku) y ejecuta:

```sql
-- Crear un usuario de prueba (password: "test1234")
INSERT INTO users (email, password_hash, created_at)
VALUES (
  'test@horizonportfolio.com',
  -- Hash de "test1234" (debes generarlo con tu backend)
  '$2b$12$...',  -- Usa el endpoint /api/auth/register
  NOW()
);
```

### **Paso 2: Obtener token JWT**

Usa **Postman** o **curl** para hacer login:

```bash
curl -X POST https://horizon-backend-316b23e32b8b.herokuapp.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@horizonportfolio.com",
    "password": "test1234"
  }'
```

**Respuesta:**
```json
{
  "message": "Usuario creado exitosamente",
  "user_id": 1
}
```

Luego hacer login:

```bash
curl -X POST https://horizon-backend-316b23e32b8b.herokuapp.com/api/auth/login \
  -H "Content-Type": "application/json" \
  -d '{
    "email": "test@horizonportfolio.com",
    "password": "test1234"
  }'
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### **Paso 3: Guardar token en localStorage manualmente**

1. Abre tu app en el navegador: `http://localhost:5173`
2. Abre DevTools (F12) → Console
3. Ejecuta:

```javascript
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
```

4. Recarga la página (F5)
5. ✅ **Ahora todos los endpoints deberían funcionar**

---

## 🔐 **OPCIÓN B: LOGIN COMPLETO**

### **Arquitectura:**

Ya creé los componentes `Login.tsx` y `Register.tsx`. Necesitas integrarlos en tu `App.tsx`.

### **Paso 1: Instalar dependencias (si faltan)**

```bash
npm install react-router-dom
```

### **Paso 2: Modificar `src/main.tsx`**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### **Paso 3: Modificar `src/App.tsx`**

Agregar al inicio del archivo:

```tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

// Componente de protección de rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

Luego, en el return de `App()`:

```tsx
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            {/* Tu contenido actual de App.tsx */}
            <div className="app">
              {/* ... todo tu código existente ... */}
            </div>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

### **Paso 4: Agregar botón de Logout**

En tu sidebar, agregar:

```tsx
const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

// En el JSX del sidebar:
<button onClick={handleLogout} className="logout-button">
  Cerrar Sesión
</button>
```

---

## 🧪 **TESTING**

### **1. Registro de Usuario:**
```
1. Ir a: http://localhost:5173/register
2. Ingresar email y password
3. Click en "Registrarse"
4. Verificar en DevTools → Network → Payload
```

### **2. Login:**
```
1. Ir a: http://localhost:5173/login
2. Ingresar credenciales
3. Click en "Iniciar Sesión"
4. Verificar que se guarda el token en localStorage
5. Verificar redirección al dashboard
```

### **3. Verificar Autenticación:**
```
1. DevTools → Application → Local Storage
2. Verificar que existe key "token" con valor JWT
3. DevTools → Network → Ver requests
4. Verificar que incluyen header: Authorization: Bearer ...
```

---

## 📊 **VERIFICACIÓN EN HEROKU**

Una vez que implementes el login:

```bash
# Deploy a Heroku
git add .
git commit -m "feat: agregar sistema de login"
git push heroku main

# Ver logs
heroku logs --tail --app horizon-backend
```

**Logs esperados (después del login):**
```
INFO: Cargando reporte para user_id=1
INFO: "GET /api/portfolio-manager/report HTTP/1.1" 200 OK ✅
```

---

## 🚀 **RECOMENDACIÓN FINAL**

### **Para Testing Inmediato:**
Usa **Opción A** (10 minutos)

### **Para Producción:**
Usa **Opción B** (30 minutos)

---

## 📝 **CHECKLIST**

- [ ] Crear usuario con `/api/auth/register`
- [ ] Hacer login con `/api/auth/login`
- [ ] Guardar token en `localStorage`
- [ ] Verificar que endpoints retornan 200 OK
- [ ] Implementar componentes Login/Register (Opción B)
- [ ] Agregar protección de rutas (Opción B)
- [ ] Deployar a Heroku
- [ ] Verificar en producción

---

**Siguiente paso:** ¿Prefieres Opción A (testing rápido) u Opción B (login completo)?
