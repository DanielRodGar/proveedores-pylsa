const row = $input.first().json;
const S = parse(row.solicitud_json) || {}, C = $('Normalizar evento').first().json;
const mapa = {}; let n = 0;
const k = s => String(s || '').trim().toUpperCase().replace(/\s+/g, ' ');
for (const p of C.partidas || []) for (const o of p.opciones || []) { const kk = k(o.proveedor) || ('#' + p.partida + '-' + o.opcion); if (!mapa[kk]) mapa[kk] = ++n; o._num = mapa[kk]; }
let t = $('Descargar plantilla').first().json.data;
t = block(t, 'FILA', fila => (C.partidas || []).map(p => {
  const sug = (p.opciones || []).find(o => o.elegida);
  const base = { n: p.partida, codigo: esc(p.clave || 'S/C'), descripcion: esc(p.articulo), cantidad: qty(p.cantidad), unidad: um(p.unidad) };
  if (p.no_disponible || !sug) return fill(fila, Object.assign(base, { costo: '—', detalle: 'No disponible', entrega_dias: '—' }));
  const nOps = (p.opciones || []).filter(o => o.precio_unitario > 0).length;
  const det = 'Proveedor ' + sug._num + ' · LAB ' + esc(sug.lab) + (sug.parcial ? ' · Disponible ' + qty(sug.cantidad_disponible) + ' de ' + qty(p.cantidad) : '') + (nOps > 1 ? ' · ' + nOps + ' opciones' : '');
  return fill(fila, Object.assign(base, { costo: money(sug.precio_unitario) + ' /' + um(p.unidad), detalle: det, entrega_dias: dias(sug.tiempo_entrega_dias) }));
}).join(''));
t = fill(t, Object.assign(comunSol(S, row.folio), { observaciones: esc(S.observaciones || '—'),
  fecha_compras: fDate(C.fecha_respuesta), hora_compras: esc(C.hora_respuesta), obs_compras: esc(C.observaciones || '—'),
  url_cotizar: B + 'regional_cotizacion.html?folio=' + encodeURIComponent(row.folio) }));
return [{ json: { para: PARA, asunto: '[PRUEBA · Regional] Poner precio de venta ' + row.folio + ' · Suc. ' + (S.usuario || {}).sucursal + ' · ' + (S.cliente || {}).nombre, html: t } }];
