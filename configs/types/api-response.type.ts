type APIResponse<T = any> = {
  data: T;
  error: unknown;
  success: boolean;
};

export default APIResponse;
