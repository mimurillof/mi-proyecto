# 🚀 GUÍA RÁPIDA: Regenerar PDF sin Llamar al Agente

## 📋 Resumen de 30 Segundos

✅ **Problema resuelto:** Error `LayoutError` con imágenes grandes  
✅ **Nueva funcionalidad:** Endpoint para regenerar PDF sin llamar al agente de IA  
✅ **Script de test:** Herramienta para probar el PDF Generator

---

## 🎯 Uso Inmediato

### Opción 1: Regenerar PDF desde el Backend (Recomendado)

```bash
# Endpoint nuevo en horizon-backend
POST /api/ribbon/regenerate-pdf
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta esperada:**
```json
{
  "status": "success",
  "message": "PDF regenerado exitosamente desde el JSON existente",
  "user_id": "048adfcc-fe6e-4608-9b74-fc5608eed985",
  "json_path": "048adfcc-fe6e-4608-9b74-fc5608eed985/estructura_informe.json"
}
```

### Opción 2: Probar con cURL

```bash
# Reemplaza <JWT_TOKEN> con tu token
curl -X POST https://horizon-backend.herokuapp.com/api/ribbon/regenerate-pdf \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json"
```

### Opción 3: Script de Test

```bash
cd "Generacion de Informe"

# Health check
python test_pdf_generation.py health

# Prueba HTTP completa (requiere SUPABASE_URL y SUPABASE_KEY en .env)
python test_pdf_generation.py http

# Todas las pruebas
python test_pdf_generation.py
```

---

## 🔧 Despliegue

### 1. PDF Generator

```bash
cd "c:\Users\mikia\mi-proyecto\Generacion de Informe"
git add pdf_generator.py test_pdf_generation.py
git commit -m "Fix: Escalar imágenes grandes automáticamente"
git push heroku main
```

### 2. Backend

```bash
cd "c:\Users\mikia\mi-proyecto\mi-proyecto-backend"
git add api/ribbon_router.py
git commit -m "Feat: Endpoint /regenerate-pdf - generar PDF sin llamar al agente"
git push heroku main
```

---

## ✅ Checklist de Validación

- [x] Health check del PDF Generator: ✅ ONLINE
- [ ] Desplegar PDF Generator con fix de imágenes
- [ ] Desplegar Backend con nuevo endpoint
- [ ] Probar endpoint `/regenerate-pdf` con Postman
- [ ] Verificar que el PDF se genera sin `LayoutError`
- [ ] Actualizar frontend con botón "Regenerar PDF" (opcional)

---

## 🎨 Frontend (Opcional)

Agregar este botón en `AIControlPanel.tsx`:

```typescript
<button
  onClick={async () => {
    try {
      const res = await fetch(getApiUrl('/api/ribbon/regenerate-pdf'), {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      
      if (!res.ok) throw new Error(`Error ${res.status}`);
      
      const result = await res.json();
      console.log('PDF regenerado:', result);
      alert('PDF regenerado exitosamente');
    } catch (err) {
      console.error('Error:', err);
      alert(`Error: ${err.message}`);
    }
  }}
  className="btn btn-secondary"
>
  🔄 Regenerar PDF
</button>
```

---

## 📊 Comparación de Tiempos

| Método | Tiempo | Costo IA | Usa Agente |
|--------|--------|----------|------------|
| `/custom-report/start` | 60-120s | ✅ Sí | ✅ Sí |
| `/regenerate-pdf` | 5-10s | ❌ No | ❌ No |

**Usa `/regenerate-pdf` cuando:**
- Ya tienes un `estructura_informe.json` en Supabase
- Solo necesitas actualizar el PDF
- Quieres evitar esperar al agente
- Quieres ahorrar costos de API

---

## 🐛 Solución de Problemas

### Error: 503 "Supabase no está configurado"
```bash
# Verificar variables de entorno en Heroku
heroku config --app horizon-backend

# Deben estar presentes:
# SUPABASE_URL
# SUPABASE_KEY
# ENABLE_SUPABASE_UPLOAD=true
```

### Error: 500 en PDF Generator
```bash
# Ver logs del PDF Generator
heroku logs --tail --app horizon-pdf-generator

# Buscar línea con el error específico
# Generalmente será un problema de imagen o JSON malformado
```

### El JSON no existe en Supabase
```bash
# Primero genera un informe con el agente
POST /api/ribbon/custom-report/start

# Espera a que termine (status=completed)
GET /api/ribbon/custom-report/status/{report_id}

# Luego regenera el PDF
POST /api/ribbon/regenerate-pdf
```

---

## 📞 Contacto

**Documentación completa:** Ver `PDF_REGENERATION_SOLUTION.md`  
**Script de test:** `Generacion de Informe/test_pdf_generation.py`
