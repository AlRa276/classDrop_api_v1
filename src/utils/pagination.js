const SORT_FIELDS_ALLOWED = ['nombre', 'creado_en', 'titulo'];
// 👆 ajusta estos campos según el recurso (puedes pasar una lista personalizada por endpoint)

function parsePagination(query, sortFieldsAllowed = SORT_FIELDS_ALLOWED) {
  const errors = [];

  const rawPage = Number(query.page ?? 1);
  const rawLimit = Number(query.limit ?? 10);
  const sort = query.sort ?? undefined;
  const rawOrder = query.order ?? 'asc';
  const search = query.search ?? undefined;

  const page = isNaN(rawPage) ? 1 : rawPage;
  const limit = isNaN(rawLimit) ? 10 : rawLimit;

  if (page < 1) {
    errors.push({ field: 'page', issue: 'El valor mínimo permitido es 1.' });
  }

  if (limit > 50) {
    errors.push({ field: 'limit', issue: 'El valor máximo permitido es 50.' });
  }

  if (sort && !sortFieldsAllowed.includes(sort)) {
    errors.push({
      field: 'sort',
      issue: `Valor no permitido. Use: ${sortFieldsAllowed.join(', ')}.`,
    });
  }

  const order = rawOrder === 'desc' ? 'desc' : 'asc';

  return { page, limit, sort, order, search, errors };
}

function buildPaginationMeta(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

module.exports = { parsePagination, buildPaginationMeta };