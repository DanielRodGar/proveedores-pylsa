const row = $input.first().json;
const R = resumenCompra(row);
let t = $('Descargar plantilla').first().json.data;
t = block(t, 'UTILIDAD', fila => R.partidas.map(p => fill(fila, {
  u_codigo: esc(p.clave || 'S/C'), u_descripcion: esc(p.articulo), u_proveedor: esc(p.proveedor), u_cantidad: qty(p.cantidad) + ' ' + um(p.unidad),
  u_costo: money(p.costo_unitario), u_precio: money(p.precio_venta), u_utilidad: money(p.utilidad_unit), u_pct: p.utilidad_pct.toFixed(1) + ' %',
  u_total: money(p.utilidad_total) })).join(''));
t = sinMaps(t, R);
const f = encodeURIComponent(row.folio), base = B + 'autorizacion_compra.html?folio=' + f + '&accion=';
t = fill(t, Object.assign(valsEntrega(R), { folio: esc(row.folio), sucursal: esc(R.sucursal), solicitante: esc(R.solicitante), vendedor: esc(R.vendedor),
  cliente_clave: esc(R.cliente.clave), cliente_nombre: esc(R.cliente.nombre),
  url_autorizar: base + 'autorizar', url_ajuste: base + 'ajuste', url_rechazar: base + 'rechazar' }));
const bin = $('Normalizar evento').first().binary || {};
const binary = {}; Object.keys(bin).forEach((k, i) => { binary['adj_' + i] = bin[k]; });
return [{ json: { para: PARA, asunto: '[PRUEBA · Dirección] Autorizar compra ' + row.folio + ' · Suc. ' + R.sucursal + ' · ' + (R.cliente.nombre || ''),
  html: t, adjuntos_keys: Object.keys(binary).join(',') }, binary }];
