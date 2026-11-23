const r = $input.first().json;
return [{ json: { id: r.id, folio: 'COT-' + String(r.id).padStart(5, '0') } }];
