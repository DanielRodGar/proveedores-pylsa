const it = $input.first();
let b = it.json.body || {};
if (typeof b.datos === 'string') { try { b = JSON.parse(b.datos); } catch (e) { b = {}; } }
const plantillas = { solicitud_cotizacion: 'correo_compras.html', respuesta_compras: 'correo_regional.html', precio_regional: 'correo_sucursal.html',
  venta_registrada: 'correo_autorizacion_direccion.html', autorizacion_compra: 'correo_solicitud_compra.html' };
b.folio = String(b.folio || '').trim().toUpperCase();
b._plantilla = 'https://raw.githubusercontent.com/DanielRodGar/proveedores-pylsa/main/cotizaciones/' + (plantillas[b.tipo_evento] || 'correo_compras.html');
const binary = Object.assign({}, it.binary || {});
// ⚠ MODO PRUEBAS: adjuntos en base64 dentro del JSON (campo _adjuntos_prueba). Quitar en producción.
if (Array.isArray(b._adjuntos_prueba)) {
  for (const a of b._adjuntos_prueba) binary[a.campo] = await this.helpers.prepareBinaryData(Buffer.from(a.base64, 'base64'), a.nombre, a.mime || 'application/pdf');
  delete b._adjuntos_prueba;
}
return [{ json: b, binary }];
