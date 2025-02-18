import {
  Button,
  Empty,
  Input,
  InputRef,
  List,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import { Search } from 'react-feather';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from '@libs/utils/hooks';
import { ProductClient } from '@libs/client/Product';
import Product from '@configs/models/product.model';
import { useAppMessage } from '@providers/AppMessageProvider';
import ProductCard from '@components/templates/ProductCard';
import WithPagination from '@configs/types/utils/with-pagination';
import { useRouter } from 'next/router';
import { useAppData } from '@providers/AppDataProvider';

function ProductSearchInput() {
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchedProducts, setSearchedProducts] =
    useState<WithPagination<Product[]>>();

  const debouncedCurrentFocusGroup = useDebounce(searchValue, 300);
  const ignoreFirstCall = useRef(false);
  const searchInput = useRef<InputRef | null>(null);
  const { toastError } = useAppMessage();
  const { productSearchKeywords, getProductSearchKeywords } = useAppData();
  const router = useRouter();

  const searchProducts = useCallback(async () => {
    if (!ignoreFirstCall.current) {
      ignoreFirstCall.current = true;
      return;
    }

    const product = new ProductClient(null, {});
    try {
      setSearching(true);

      const searchProducts = await product.getProducts({
        page: 1,
        pageSize: 10,
        filterByName: debouncedCurrentFocusGroup,
      });

      setSearchedProducts(searchProducts.data);
    } catch (error) {
      toastError({ data: error });
    } finally {
      setSearching(false);
    }
  }, [debouncedCurrentFocusGroup, toastError]);

  /**
   * Effect to search products when search value changes
   */
  useEffect(() => {
    searchProducts();
  }, [searchProducts]);

  /**
   * Effect to clear searched products when search focus is false
   */
  useEffect(() => {
    if (!searchFocus) {
      setSearchedProducts(undefined);
      return;
    }

    if (searchValue) {
      searchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFocus]);

  /**
   * Effect to get keyword when focus search
   */
  useEffect(() => {
    if (searchFocus) {
      getProductSearchKeywords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFocus]);

  useEffect(() => {
    if (router.query['tu-khoa']) {
      setSearchValue(router.query['tu-khoa'] as string);
    }
  }, [router]);

  const backdrop = (
    <div
      className="fixed inset-0 z-[120] bg-black opacity-50"
      onClick={() => {
        setSearchFocus(false);
      }}
    />
  );

  return (
    <>
      {searchFocus && backdrop}

      <div className="relative z-[120]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearchFocus(false);

            router.push({
              pathname: '/tim-kiem',
              query: { 'tu-khoa': searchValue },
            });
          }}
        >
          <Input
            ref={(ref) => (searchInput.current = ref)}
            placeholder="Tìm kiếm sản phẩm..."
            size="large"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={`h-10 rounded-tl-md rounded-tr-md px-4 ${
              searchFocus
                ? 'rounded-bl-none rounded-br-none'
                : 'rounded-bl-md rounded-br-md'
            }`}
            // readOnly={searching}
            suffix={
              <Spin spinning={searching}>
                <Search size={20} className="text-primary" />
              </Spin>
            }
            onClick={() => {
              setSearchFocus(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSearchFocus(false);
              }
            }}
          />
        </form>

        {searchFocus && (
          <div className="absolute left-0 right-0 top-10 z-[100] max-h-[800px] overflow-auto rounded-br-md rounded-bl-md bg-white">
            <div className="mx-2 mt-4">
              <Space size={[8, 8]} wrap>
                {productSearchKeywords.map((keyword, index) => (
                  <Tag
                    key={`${index}_${keyword.sortOrder}`}
                    className="mx-0 cursor-pointer rounded-full border-none bg-primary-background p-2 text-sm"
                    onClick={() => {
                      setSearchValue(keyword.keyword || '');
                      searchInput.current?.focus();
                    }}
                  >
                    {keyword.keyword}
                  </Tag>
                ))}
              </Space>
            </div>
            {(searchedProducts?.total || 0) > 0 && (
              <>
                {searchValue ? (
                  <Typography className="mx-4 my-4 text-lg">
                    Tìm thấy <b>{searchedProducts?.total || 0}</b> sản phẩm
                  </Typography>
                ) : (
                  <Typography className="mx-4 my-4 text-lg">
                    Các sản phẩm phổ biến
                  </Typography>
                )}
                <Spin spinning={searching}>
                  <List className="z-[120]">
                    {searchedProducts?.data.map((searchedProduct) => (
                      <List.Item
                        key={searchedProduct.key}
                        className="px-4"
                        onClick={() => {
                          setSearchFocus(false);
                        }}
                      >
                        <ProductCard variant="list" product={searchedProduct} />
                      </List.Item>
                    ))}
                  </List>
                  {(searchedProducts?.data.length || 0) <
                    (searchedProducts?.total || 0) && (
                    <div
                      onClick={() =>
                        router.push(`/tim-kiem?tu-khoa=${searchValue}`)
                      }
                    >
                      <Button
                        block
                        className="mt-4 mb-4"
                        type="link"
                        onClick={() => {
                          setSearchFocus(false);
                        }}
                      >
                        Xem tất cả
                      </Button>
                    </div>
                  )}
                </Spin>
              </>
            )}

            {!(searchedProducts?.total || 0) && (
              <div className="my-4">
                <Empty
                  description={
                    searchValue ? (
                      <Typography>
                        Không có tìm kiếm nào phù hợp với từ khóa{' '}
                        <b>{searchValue}</b>
                      </Typography>
                    ) : (
                      <Typography>Nhập từ khóa để tìm kiếm sản phẩm</Typography>
                    )
                  }
                ></Empty>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ProductSearchInput;
