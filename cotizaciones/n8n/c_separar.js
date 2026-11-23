const it = $('Normalizar evento').first();
const bin = it.binary || {};
const folio = it.json.folio;
const out = Object.keys(bin).map(k => ({
  json: { campo: k, tipo: k.startsWith('comprobante') ? 'Comprobante de pago' : 'Cotización pagada', nombre: bin[k].fileName || k,
    nombre_drive: folio + ' - ' + (k.startsWith('comprobante') ? 'Comprobante de pago' : 'Cotizacion pagada') + ' - ' + (bin[k].fileName || k) },
  binary: { data: bin[k] } }));
if (!out.length) throw new Error('La venta llegó sin archivos adjuntos');
return out;
