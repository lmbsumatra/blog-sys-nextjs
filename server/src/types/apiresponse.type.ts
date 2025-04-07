
interface SuccessResponse<T> {
  status: 'success';
  data: T;
}

interface ErrorResponse {
  status: 'error';
  message: string;
  code: number;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;