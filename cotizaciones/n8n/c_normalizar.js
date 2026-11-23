const it = $input.first();
let b = it.json.body || {};
if (typeof b.datos === 'string') { try { b = JSON.parse(b.datos); } catch (e) { b = {}; } }
const plantillas = { solicitud_cotizacion: 'correo_compras.html', respuesta_compras: 'correo_regional.html', precio_regional: 'correo_sucursal.html',
  venta_registrada: 'correo_autorizacion_direccion.html', autorizacion_compra: 'correo_solicitud_compra.html' };
b.folio = String(b.folio || '').trim().toUpperCase();
b._plantilla = 'https://raw.githubusercontent.com/DanielRodGar/proveedores-pylsa/main/cotizaciones/' + (plantillas[b.tipo_evento] || 'correo_compras.html');
return [{ json: b, binary: it.binary }];
