const S = $('Normalizar evento').first().json;
const folio = $('Asignar folio').first().json.folio;
let t = $('Descargar plantilla').first().json.data;
t = block(t, 'FILA', row => (S.partidas || []).map(p => fill(row, {
  n: p.partida, codigo: esc(p.clave || 'S/C'), descripcion: esc(p.articulo), cantidad: qty(p.cantidad), unidad: um(p.unidad),
  kilos: p.kilos != null ? nf(p.kilos) : '—', nota: p.nota ? 'Nota: ' + esc(p.nota) : '' })).join(''));
t = fill(t, Object.assign(comunSol(S, folio), { observaciones: esc(S.observaciones || '—'),
  url_cotizar: B + 'compras_cotizacion.html?folio=' + encodeURIComponent(folio) }));
return [{ json: { para: PARA, asunto: '[PRUEBA · Compras] Solicitud de cotización ' + folio + ' · Suc. ' + (S.usuario || {}).sucursal + ' · ' + (S.cliente || {}).nombre, html: t } }];
