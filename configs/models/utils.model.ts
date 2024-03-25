interface OffsetLimit {
  offset?: number;
  limit?: number;
}

type SortValues = 1 | -1;

interface WithSort<T extends object> {
  s?: {
    [key in keyof T]?: SortValues;
  };
}

interface WithQuery<T extends object> {
  q?: {
    [key in keyof T]?: T[key];
  };
}

interface WithQueryAndSort<SF extends object, QF extends object>
  extends WithSort<SF>,
    WithQuery<QF> {}

export type CombinedGetParams<
  SF extends object,
  QF extends object,
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends object = {}
> = T &
  OffsetLimit &
  WithQueryAndSort<SF, QF> & {
    getTotal?: boolean;
  };
