const row = $input.first().json || {};
const vista = String($('Webhook datos').first().json.query.vista || '');
if (!row.folio) return [{ json: { codigo: 404, respuesta: { error: 'Folio no encontrado' } } }];
const S = parse(row.solicitud_json) || {}; S.folio = row.folio;
let respuesta;
if (vista === 'compras') respuesta = S;
else if (vista === 'regional') {
  const C = parse(row.compras_json);
  if (!C) return [{ json: { codigo: 409, respuesta: { error: 'Compras aún no ha cotizado este folio' } } }];
  const mapa = {}; let n = 0; const k = s => String(s || '').trim().toUpperCase().replace(/\s+/g, ' ');
  for (const p of C.partidas || []) { for (const o of p.opciones || []) { const kk = k(o.proveedor) || ('#' + p.partida + '-' + o.opcion); if (!mapa[kk]) mapa[kk] = ++n; o.proveedor_num = mapa[kk]; o.proveedor = 'Proveedor ' + mapa[kk]; }
    delete p.proveedor_elegido; delete p.comentario_proveedor; }
  delete C.resumen_proveedores;
  respuesta = { solicitud: S, compras: C };
} else if (vista === 'venta') {
  const P = parse(row.precios_json);
  if (!P) return [{ json: { codigo: 409, respuesta: { error: 'La cotización aún no tiene precio de venta' } } }];
  P.folio = row.folio; respuesta = { solicitud: S, precios: P };
} else if (vista === 'motivo') respuesta = { folio: row.folio, cliente: S.cliente || {} };
else if (vista === 'autorizacion') {
  const R = resumenCompra(row);
  respuesta = { folio: row.folio, sucursal: R.sucursal, solicitante: R.solicitante, cliente: R.cliente, vendedor: R.vendedor,
    costo_total: R.costo_total, venta_total: R.venta_total, utilidad_total: R.utilidad_total, utilidad_pct: R.utilidad_pct,
    partidas: R.partidas.map(p => ({ clave: p.clave, articulo: p.articulo, cantidad: p.cantidad, unidad: p.unidad, proveedor: p.proveedor, costo_unitario: p.costo_unitario, precio_venta: p.precio_venta })),
    entrega: R.entrega, adjuntos: R.adjuntos.map(a => ({ tipo: a.tipo, nombre: a.nombre, url: a.url })), estado: row.estado };
} else return [{ json: { codigo: 400, respuesta: { error: 'Vista no válida' } } }];
return [{ json: { codigo: 200, respuesta } }];
