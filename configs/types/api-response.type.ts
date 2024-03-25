// eslint-disable-next-line @typescript-eslint/no-explicit-any
type APIResponse<T = any> = {
  data?: T;
  error: Partial<{
    code: string;
    msg: string;
  }> | null;
  success: boolean;
  statusCode?: number;
  message?: string;
  status?: string;
  total?: number;
};

export default APIResponse;
