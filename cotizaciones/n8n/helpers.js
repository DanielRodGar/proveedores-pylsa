const B = 'https://danielrodgar.github.io/proveedores-pylsa/cotizaciones/';
const PARA = 'danielrodgar54@gmail.com';
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nf = (n, d = 2) => { n = +n; if (!isFinite(n)) return '—'; const s = Math.abs(n).toFixed(d).split('.'); s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return (n < 0 ? '-' : '') + s.join('.'); };
const money = n => (+n < 0 ? '-$' : '$') + nf(Math.abs(+n));
const qty = n => Number.isInteger(+n) ? nf(n, 0) : nf(n, 2);
const UM = {PIEZA:'pza', KILOGRAMO:'kg', METRO:'m', 'METRO LINEAL':'ml', 'METRO CUADRADO':'m²'};
const um = u => UM[u] || String(u || '').toLowerCase();
const fDate = iso => iso ? String(iso).slice(8,10) + '/' + String(iso).slice(5,7) + '/' + String(iso).slice(0,4) : '';
const dias = d => (d == null || d === '') ? '—' : (+d === 1 ? '1 día hábil' : d + ' días hábiles');
const parse = s => { try { return typeof s === 'string' ? (s ? JSON.parse(s) : null) : s; } catch (e) { return null; } };
const fill = (t, vals) => { for (const k in vals) t = t.split('{{' + k + '}}').join(vals[k] == null ? '' : String(vals[k])); return t; };
const block = (t, name, fn) => { const m = t.match(new RegExp('<!-- INICIO ' + name + ' -->([\\s\\S]*?)<!-- FIN ' + name + ' -->')); return m ? t.replace(m[0], () => fn(m[1])) : t; };
const entregaSol = (S) => {
  const e = S.entrega || {};
  if (e.tipo === 'directa') { const d = e.direccion || {};
    return { entrega: 'Entrega directa · ' + esc(d.municipio) + ', ' + esc(d.estado),
      entrega_detalle: 'C.P. ' + esc(d.cp) + (d.google_maps ? ' · <a href="' + esc(d.google_maps) + '" style="color:#2d5687;">Ver ubicación</a>' : '') }; }
  return { entrega: 'En sucursal ' + esc(e.sucursal_entrega), entrega_detalle: e.tipo === 'otra_sucursal' ? 'Otra sucursal (no la solicitante)' : 'Sucursal solicitante' };
};
const comunSol = (S, folio) => Object.assign({
  folio: esc(folio), fecha: fDate(S.fecha_solicitud), hora: esc(S.hora_solicitud),
  sucursal: esc((S.usuario || {}).sucursal), solicitante: esc((S.usuario || {}).nombre), vendedor: esc(S.vendedor),
  cliente_clave: esc((S.cliente || {}).clave), cliente_nombre: esc((S.cliente || {}).nombre),
  total_partidas: (S.partidas || []).length, total_kilos: nf(S.total_kilos || 0)
}, entregaSol(S));
// Resumen de la compra (venta + costos de Compras) — utilidad SOBRE VENTA
const resumenCompra = (row) => {
  const S = parse(row.solicitud_json) || {}, C = parse(row.compras_json) || {partidas: []}, V = parse(row.venta_json) || {partidas: [], entrega: {}};
  const adj = parse(row.adjuntos_json) || [];
  const partidas = (V.partidas || []).map(v => {
    const c = (C.partidas || []).find(x => x.partida === v.partida) || {};
    const costo = +c.costo_unitario || 0, pv = +v.precio_vendido || 0, q = +v.cantidad_vendida || 0;
    return { partida: v.partida, clave: v.clave, articulo: v.articulo, unidad: v.unidad, cantidad: q,
      proveedor: c.proveedor_elegido || '', costo_unitario: costo, precio_venta: pv,
      utilidad_unit: pv - costo, utilidad_pct: pv ? (pv - costo) / pv * 100 : 0, utilidad_total: (pv - costo) * q, opciones: c.opciones || [] };
  });
  const tc = partidas.reduce((t, p) => t + p.costo_unitario * p.cantidad, 0), tv = partidas.reduce((t, p) => t + p.precio_venta * p.cantidad, 0);
  const e = V.entrega || {}, d = e.direccion || {}, r = e.recibe || {}, ds = e.descarga || {};
  const entrega = { tipo: e.tipo,
    lugar: e.tipo === 'directa' ? [d.calle, d.colonia ? 'Col. ' + d.colonia : '', d.cp ? 'C.P. ' + d.cp : '', d.municipio, d.estado].filter(Boolean).join(', ') : 'Sucursal ' + (e.sucursal || ''),
    referencias: d.referencias || '', google_maps: e.tipo === 'directa' ? (d.google_maps || '') : '',
    recibe: r.nombre || '', telefono: r.telefono || '', dias: (ds.dias || []).join(', '),
    horario: ds.desde && ds.hasta ? ds.desde + ' a ' + ds.hasta : '', indicaciones: ds.indicaciones || '' };
  return { folio: row.folio, sucursal: (S.usuario || {}).sucursal, solicitante: (S.usuario || {}).nombre, cliente: S.cliente || {}, vendedor: S.vendedor,
    fecha_pago: V.fecha_venta, hora_pago: V.hora_venta, observaciones: V.observaciones || '',
    costo_total: tc, venta_total: tv, utilidad_total: tv - tc, utilidad_pct: tv ? (tv - tc) / tv * 100 : 0,
    partidas, entrega, adjuntos: adj, S, C, V };
};
const valsEntrega = (R) => ({
  entrega_tipo: R.entrega.tipo === 'directa' ? 'Entrega directa' : 'Entrega en sucursal', entrega_lugar: esc(R.entrega.lugar),
  entrega_ref: esc(R.entrega.referencias || '—'), url_maps: esc(R.entrega.google_maps), recibe_nombre: esc(R.entrega.recibe),
  recibe_tel: esc(R.entrega.telefono), descarga_dias: esc(R.entrega.dias), descarga_horario: esc(R.entrega.horario),
  descarga_ind: esc(R.entrega.indicaciones || '—'),
  adjuntos: (R.adjuntos || []).map(a => '<a href="' + esc(a.url) + '" style="color:#2d5687;">📎 ' + esc(a.tipo) + ': ' + esc(a.nombre) + '</a>').join('<br>') || 'Sin adjuntos',
  fecha_pago: fDate(R.fecha_pago), hora_pago: esc(R.hora_pago)
});
const sinMaps = (t, R) => R.entrega.google_maps ? t : t.replace(/<a href="\{\{url_maps\}\}"[\s\S]*?<\/a>/g, '');
