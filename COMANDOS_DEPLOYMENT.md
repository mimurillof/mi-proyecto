# 🚀 COMANDOS DE DEPLOYMENT - COPIAR Y PEGAR

## ✅ TODO LISTO - Solo ejecuta estos comandos

---

## 📦 PASO 1: Desplegar PDF Generator

```powershell
cd "c:\Users\mikia\mi-proyecto\Generacion de Informe"
git add pdf_generator.py test_pdf_generation.py
git commit -m "Fix: Escalar imágenes grandes + script de test"
git push heroku main
```

**Espera a ver:** `Build succeeded` y `Verifying deploy... done.`

---

## 📦 PASO 2: Desplegar Backend

```powershell
cd "c:\Users\mikia\mi-proyecto\mi-proyecto-backend"
git add api/ribbon_router.py
git commit -m "Feat: Endpoint /regenerate-pdf sin llamar al agente"
git push heroku main
```

**Espera a ver:** `Build succeeded` y `Verifying deploy... done.`

---

## ✅ PASO 3: Verificar que Todo Funciona

```powershell
# Test 1: Health check
cd "c:\Users\mikia\mi-proyecto\Generacion de Informe"
python test_pdf_generation.py health

# Test 2: Ver logs del PDF Generator
heroku logs --tail --app horizon-pdf-generator

# Test 3: Ver logs del Backend
heroku logs --tail --app horizon-backend
```

---

## 🧪 PASO 4: Probar el Nuevo Endpoint

### Opción A: Con cURL (necesitas tu JWT token)

```powershell
# Reemplaza <TU_JWT_TOKEN> con tu token real
curl -X POST https://horizon-backend.herokuapp.com/api/ribbon/regenerate-pdf `
  -H "Authorization: Bearer <TU_JWT_TOKEN>" `
  -H "Content-Type: application/json"
```

### Opción B: Desde el Frontend

1. Inicia sesión en tu app: https://tu-frontend.vercel.app
2. Ve a la sección de Reports
3. Abre la consola del navegador (F12)
4. Ejecuta este código:

```javascript
fetch('https://horizon-backend.herokuapp.com/api/ribbon/regenerate-pdf', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(d => console.log('✅ Resultado:', d))
.catch(e => console.error('❌ Error:', e));
```

---

## ✅ Si Todo Sale Bien, Verás:

```json
{
  "status": "success",
  "message": "PDF regenerado exitosamente desde el JSON existente",
  "user_id": "048adfcc-fe6e-4608-9b74-fc5608eed985",
  "json_path": "048adfcc-fe6e-4608-9b74-fc5608eed985/estructura_informe.json"
}
```

**Tiempo esperado:** 5-10 segundos ⚡

---

## 🆘 Si Algo Falla

### Error: "No such app as horizon-pdf-generator"

```powershell
# Verifica el nombre correcto de tu app
heroku apps

# Usa el nombre correcto en el comando
git push heroku main
```

### Error: "No se puede encontrar git remote heroku"

```powershell
# En el directorio del PDF Generator
cd "c:\Users\mikia\mi-proyecto\Generacion de Informe"
heroku git:remote -a horizon-pdf-generator

# En el directorio del Backend
cd "c:\Users\mikia\mi-proyecto\mi-proyecto-backend"
heroku git:remote -a horizon-backend
```

### Error 503: "Supabase no está configurado"

```powershell
# Verificar variables de entorno
heroku config --app horizon-backend

# Si faltan, agregarlas:
heroku config:set ENABLE_SUPABASE_UPLOAD=true --app horizon-backend
```

---

## 📚 Documentación Completa

- **Guía completa:** `PDF_REGENERATION_SOLUTION.md`
- **Guía rápida:** `REGENERATE_PDF_QUICKSTART.md`
- **Este archivo:** `COMANDOS_DEPLOYMENT.md`

---

## 🎉 ¡Listo!

Una vez que ejecutes estos comandos y veas `Build succeeded`, ya puedes:

1. ✅ Generar PDFs sin error de `LayoutError`
2. ✅ Usar el endpoint `/regenerate-pdf` para generar rápido (5-10s)
3. ✅ Probar el PDF Generator con el script `test_pdf_generation.py`

**Siguiente paso:** Ejecutar los comandos de arriba ☝️
