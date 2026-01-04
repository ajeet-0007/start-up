export const generatePaginationResponse = (
  page: number,
  limit: number,
  total: number,
) => {
  return {
    page,
    limit,
    total,
  };
};
