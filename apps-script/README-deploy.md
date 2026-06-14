# Conectar el formulario a Google Sheets

Esto hace que cada solicitud enviada desde el formulario aparezca como una fila
en una planilla de Google. Es el mismo método que tu Encuesta Fertilización.

## Paso 1 — Crear la planilla

1. Andá a [sheets.new](https://sheets.new) y creá una hoja nueva.
2. Ponele un nombre, por ejemplo **Crucianelli · Demos de Plantio**.
3. (No hace falta crear columnas: el script las crea solo la primera vez.)

## Paso 2 — Pegar el script

1. En la planilla: menú **Extensiones → Apps Script**.
2. Borrá lo que haya y pegá **todo** el contenido de `Codigo.gs`.
3. Guardá (💾 o `Ctrl+S`).

## Paso 3 — Desplegar como Web App

1. Botón **Implementar → Nueva implementación**.
2. En "Tipo", elegí **Aplicación web**.
3. Configurá:
   - **Descripción**: `Crucianelli demo`
   - **Ejecutar como**: *Yo* (tu cuenta)
   - **Quién tiene acceso**: **Cualquier usuario** (importante, para que el form anónimo pueda escribir).
4. **Implementar** → autorizá los permisos cuando lo pida (elegí tu cuenta → "Configuración avanzada" → "Ir a … (no seguro)" → Permitir).
5. Copiá la **URL de la aplicación web** (termina en `/exec`).

## Paso 4 — Pegar la URL en el proyecto

Abrí `src/components/DemoForm.jsx` y pegá la URL acá:

```js
const SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/XXXXX/exec'
```

Guardá. Listo: las respuestas ya caen en la planilla. 🎉

## Notas

- El script es **genérico**: si más adelante agregamos campos al formulario,
  crea la columna nueva automáticamente al final.
- Si cambiás el script, tenés que **volver a implementar** (Implementar → Gestionar
  implementaciones → editar → Nueva versión). La URL se mantiene.
- Para probar rápido: abrí la URL `/exec` en el navegador; debería responder
  `{"ok":true,"msg":"..."}`.
