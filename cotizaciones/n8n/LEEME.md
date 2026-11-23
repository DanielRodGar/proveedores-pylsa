# Código de los nodos Code del flujo n8n «PYLSA · Cotizaciones»

En n8n cada nodo Code lleva `helpers.js` + su archivo `c_*.js` (minificado).
Aquí está la versión legible para mantenimiento.

| Archivo | Nodo en n8n |
|---|---|
| c_normalizar.js | Normalizar evento |
| c_datos.js | Armar datos de la vista |
| c_folio.js | Asignar folio |
| c_correo_compras.js | Correo a Compras |
| c_correo_regional.js | Correo al Regional |
| c_correo_sucursal.js | Correo a la Sucursal |
| c_separar.js / c_reunir.js | Separar adjuntos / Reunir adjuntos |
| c_correo_direccion.js | Correo a Dirección |
| c_listar.js | Listar adjuntos |
| c_correo_autorizada.js | Correo compra autorizada |
| c_correo_ajuste.js | Correo ajuste o rechazo |

Webhooks: GET `/webhook/cot-datos?vista=compras|regional|venta|motivo|autorizacion&folio=` y POST `/webhook/cot-evento`.
Tabla de datos: `cot_cotizaciones`. Utilidad = (precio − costo) ÷ precio (sobre venta).
MODO PRUEBAS: todos los correos van a danielrodgar54@gmail.com (constante PARA en helpers.js).
