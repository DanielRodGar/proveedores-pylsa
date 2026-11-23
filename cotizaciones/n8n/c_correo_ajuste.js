const row = $('Guardar autorización').first().json;
const A = $('Normalizar evento').first().json;
const R = resumenCompra(row);
const aj = A.decision === 'ajuste';
const color = aj ? '#b9770e' : '#c0392b', titulo = aj ? 'Dirección pide un ajuste' : 'Dirección rechazó la compra';
const html = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #d5dbe3;border-radius:8px;overflow:hidden">'
 + '<div style="background:' + color + ';color:#fff;padding:14px 18px;font-size:18px;font-weight:bold">' + titulo + ' · ' + esc(row.folio) + '</div>'
 + '<div style="padding:16px 18px;font-size:14px;color:#1d2733;line-height:1.5">'
 + '<p><b>Cliente:</b> ' + esc(R.cliente.nombre) + ' (clave ' + esc(R.cliente.clave) + ')<br><b>Sucursal:</b> ' + esc(R.sucursal) + ' · ' + esc(R.solicitante) + '<br>'
 + '<b>Venta:</b> ' + money(R.venta_total) + ' · <b>Utilidad:</b> ' + R.utilidad_pct.toFixed(1) + ' %</p>'
 + '<p style="background:#f3f5f8;border-left:4px solid ' + color + ';padding:10px 12px"><b>' + (aj ? 'Qué hay que ajustar' : 'Motivo') + ':</b><br>' + esc(A.comentario) + '</p>'
 + '<p style="font-size:12px;color:#5d6b7a">' + esc((A.usuario || {}).nombre) + ' · ' + fDate(A.fecha) + ' ' + esc(A.hora) + '</p>'
 + (aj ? '<p><a href="' + B + 'venta_cotizacion.html?folio=' + encodeURIComponent(row.folio) + '" style="background:#1f3a5f;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold">Corregir y volver a enviar</a></p>' : '')
 + '</div></div>';
return [{ json: { para: PARA, asunto: '[PRUEBA · Sucursal y Regional] ' + (aj ? 'Ajuste solicitado' : 'Compra rechazada') + ' ' + row.folio + ' · ' + (R.cliente.nombre || ''), html } }];
