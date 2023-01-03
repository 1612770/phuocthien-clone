type APIResponse<T = any> = {
  data: T;
  error: Partial<{
    code: string;
    msg: string;
  }> | null;
  success: boolean;
};

export default APIResponse;
