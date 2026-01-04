export function paginationTransform(pagination: any) {
  let skip = 0,
    take = 50;
  if (pagination) {
    const { page = 1, limit = 50 } = pagination;
    take = limit;
    skip = (page - 1) * limit;
  }
  return { skip, take };
}
