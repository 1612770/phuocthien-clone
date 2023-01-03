type WithPagination<T> = {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  data: T;
};

export default WithPagination;
