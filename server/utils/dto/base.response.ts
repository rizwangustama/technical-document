export function successResponse<T>(message: string, data: T) {
  return {
    status: true,
    message,
    data,
    error: null
  };
}

export function errorResponse(message: string, error: any = null) {
  return {
    status: false,
    message,
    data: null,
    error
  };
}
