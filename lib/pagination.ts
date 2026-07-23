export interface PaginationInput {
  readonly page?: number;
  readonly limit?: number;
}

export interface NormalizedPagination {
 readonly page: number;
 readonly limit: number;
 readonly offset: number;

}

export function normalizePagination(
  input: PaginationInput,
  defaults = {
    page: 1,
    limit: 24,
    maximumLimit: 100,
  }
): NormalizedPagination {
  const page =
    Number.isInteger(input.page) && (input.page ?? 0) > 0
      ? input.page!
      : defaults.page;

    const requestedLimit =
     Number.isInteger(input.limit) && (input.limit ?? 0) > 0
      ? input.limit!
      : defaults.limit;

    const limit = Math.min(requestedLimit, defaults.maximumLimit);

    return {
      page,
      limit,
      offset: (page - 1) * limit,
    };
}

export function calculatePaginationMeta(
  page: number,
  limit: number,
  totalItems: number
): {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}{
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    return {

      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
}
