interface ReviewClient {
  createdTime?: string;
  displayName?: string;
  id?: string;
  imgUrl?: string | null;
  sex?: string;
}

interface ReviewReply {
  client?: ReviewClient;
  clientKey?: string;
  createdDate?: string;
  description?: string;
  isReplied?: boolean;
  isShow?: boolean;
  key?: string;
  productKey?: string;
}

export interface Review {
  client?: ReviewClient;
  clientKey?: string;
  createdDate?: string;
  description?: string;
  isReplied?: boolean;
  isShow?: boolean;
  key?: string;
  listReplied?: ReviewReply[];
  productKey?: string;
}
