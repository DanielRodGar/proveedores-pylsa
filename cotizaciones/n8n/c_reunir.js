const subidos = $input.all();
const sep = $('Separar adjuntos').all();
const adjuntos = subidos.map((s, i) => ({ tipo: sep[i].json.tipo, nombre: sep[i].json.nombre, id: s.json.id,
  url: s.json.webViewLink || ('https://drive.google.com/file/d/' + s.json.id + '/view') }));
const V = $('Normalizar evento').first().json;
const row = $('Leer cotización (venta)').first().json;
if (!row.folio) throw new Error('Folio no encontrado: ' + V.folio);
const R = resumenCompra(Object.assign({}, row, { venta_json: JSON.stringify(V), adjuntos_json: JSON.stringify(adjuntos) }));
return [{ json: { folio: row.folio, venta_json: JSON.stringify(V), adjuntos_json: JSON.stringify(adjuntos),
  venta_total: +R.venta_total.toFixed(2), costo_total: +R.costo_total.toFixed(2), utilidad_total: +R.utilidad_total.toFixed(2) } }];
