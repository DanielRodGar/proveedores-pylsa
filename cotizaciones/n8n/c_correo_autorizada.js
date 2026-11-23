const row = $('Guardar autorización').first().json;
const A = $('Normalizar evento').first().json;
const R = resumenCompra(row);
let t = $('Descargar plantilla').first().json.data;
t = block(t, 'MATERIAL', mat => R.partidas.map(p => {
  const u = um(p.unidad);
  let b = block(mat, 'PROVEEDOR', prov => (p.opciones || []).filter(o => o.precio_unitario > 0 || o.proveedor).map(o => fill(prov, {
    proveedor: esc(o.proveedor), p_costo: o.precio_unitario > 0 ? money(o.precio_unitario) + ' /' + u + (o.precio_capturado_por === 'kg' ? '<br><span style="font-size:10px;color:#5d6b7a">(' + money(o.precio_capturado) + '/kg)</span>' : '') : '—',
    p_dias: o.tiempo_entrega_dias == null ? '—' : o.tiempo_entrega_dias, p_disp: o.parcial ? qty(o.cantidad_disponible) + ' de ' + qty(p.cantidad) : 'Todo',
    p_lab: esc(o.lab), p_obs: esc(o.comentario), p_marca: o.elegida ? '★ Sugerido' : '', p_fondo: o.elegida ? '#e9f7ef' : '#ffffff' })).join(''));
  return fill(b, { n: p.partida, codigo: esc(p.clave || 'S/C'), descripcion: esc(p.articulo), cantidad: qty(p.cantidad), unidad: u,
    costo: money(p.costo_unitario) + ' /' + u, precio_venta: money(p.precio_venta) + ' /' + u, utilidad: money(p.utilidad_unit) + ' /' + u,
    utilidad_pct: p.utilidad_pct.toFixed(1) + ' %', utilidad_total: money(p.utilidad_total) });
}).join(''));
t = sinMaps(t, R);
t = fill(t, Object.assign(valsEntrega(R), { folio: esc(row.folio), sucursal: esc(R.sucursal), solicitante: esc(R.solicitante), vendedor: esc(R.vendedor),
  cliente_clave: esc(R.cliente.clave), cliente_nombre: esc(R.cliente.nombre), total_partidas: R.partidas.length,
  obs_sucursal: esc(R.observaciones || '—'), autorizo: esc((A.usuario || {}).nombre), fecha_aut: fDate(A.fecha), hora_aut: esc(A.hora),
  comentario_aut: esc(A.comentario || '—'), costo_total_general: money(R.costo_total), venta_total_general: money(R.venta_total),
  utilidad_total_general: money(R.utilidad_total), utilidad_pct_general: R.utilidad_pct.toFixed(1) + ' %' }));
const binary = {}; $input.all().forEach((it, i) => { if (it.binary && it.binary.data) binary['adj_' + i] = it.binary.data; });
return [{ json: { para: PARA, asunto: '[PRUEBA · Compras] Compra AUTORIZADA ' + row.folio + ' · Suc. ' + R.sucursal + ' · ' + (R.cliente.nombre || ''),
  html: t, adjuntos_keys: Object.keys(binary).join(',') }, binary }];
