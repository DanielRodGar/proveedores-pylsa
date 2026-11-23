const row = $input.first().json;
const S = parse(row.solicitud_json) || {}, P = $('Normalizar evento').first().json;
let t = $('Descargar plantilla').first().json.data;
t = block(t, 'FILA', fila => (P.partidas || []).map(p => fill(fila, {
  n: p.partida, codigo: esc(p.clave || 'S/C'), descripcion: esc(p.articulo), cantidad: qty(p.cantidad), unidad: um(p.unidad),
  precio: p.no_disponible ? 'No disponible' : money(p.precio_venta_unitario) + ' /' + um(p.unidad),
  entrega_dias: p.no_disponible ? '—' : dias(p.tiempo_entrega_dias),
  nota: !p.no_disponible && p.parcial ? 'Disponible ' + qty(p.cantidad_disponible) + ' de ' + qty(p.cantidad) + ' ' + um(p.unidad) : '' })).join(''));
const f = encodeURIComponent(row.folio);
t = fill(t, Object.assign(comunSol(S, row.folio), { regional: esc((P.usuario || {}).nombre), fecha_precio: fDate(P.fecha_precio), hora_precio: esc(P.hora_precio),
  con_precio: (P.partidas || []).filter(p => !p.no_disponible).length, obs_regional: esc(P.observaciones || '—'),
  url_pago: B + 'venta_cotizacion.html?folio=' + f, url_no_compro: B + 'motivo_no_compra.html?folio=' + f }));
return [{ json: { para: PARA, asunto: '[PRUEBA · Sucursal] Cotización ' + row.folio + ' con precio · ' + (S.cliente || {}).nombre, html: t } }];
