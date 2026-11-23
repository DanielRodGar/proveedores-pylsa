const row = $input.first().json;
const adj = parse(row.adjuntos_json) || [];
return adj.filter(a => a.id).map(a => ({ json: { fileId: a.id, nombre: a.nombre, tipo: a.tipo } }));
