export function normalizeResult(result: any) {
  return {
    success: true,
    count: result.rows?.length ?? 0,
    data: result.rows ?? [],
  };
}
