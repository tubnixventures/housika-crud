export function normalizeResult(result) {
    return {
        success: true,
        count: result.rows?.length ?? 0,
        data: result.rows ?? [],
    };
}
