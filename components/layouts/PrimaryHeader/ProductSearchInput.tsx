import {
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

function ProductSearchInput() {
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);

  const debouncedCurrentFocusGroup = useDebounce(searchValue, 500);
  const ignoreFirstCall = useRef(false);
  const searchInput = useRef<InputRef | null>(null);
  const { toastError } = useAppMessage();

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
        isPrescripted: false,
        filterByName: debouncedCurrentFocusGroup,
      });

      setSearchedProducts(searchProducts.data?.data || []);
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
      setSearchedProducts([]);
    }

    if (searchValue) {
      searchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFocus]);

  const backdrop = (
    <div
      className="fixed inset-0 z-[100] bg-black opacity-50"
      onClick={() => {
        setSearchFocus(false);
      }}
    />
  );

  return (
    <>
      {searchFocus && backdrop}

      <div className="relative z-[100]">
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
          readOnly={searching}
          suffix={
            <Spin spinning={searching}>
              <Search size={20} />
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

        {searchFocus && (
          <div className="absolute left-0 right-0 top-10 max-h-[800px] overflow-auto rounded-br-md rounded-bl-md bg-white">
            <div className="mx-6 mt-4">
              <Space size={[8, 8]} wrap>
                {[
                  'Thuốc đau đầu',
                  'Thuốc đau bụng',
                  'Thuốc đau mắt',
                  'Thuốc xương khớp',
                ].map((tag) => (
                  <Tag
                    key={tag}
                    className="mx-0 cursor-pointer rounded-full border-none bg-primary-background p-2 text-sm"
                    onClick={() => {
                      setSearchValue(tag);
                      searchInput.current?.focus();
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
            {searchedProducts.length > 0 && (
              <>
                {searchValue ? (
                  <Typography className="mx-6 my-4 text-lg">
                    Tìm thấy <b>{searchedProducts.length}</b> sản phẩm
                  </Typography>
                ) : (
                  <Typography className="mx-6 my-4 text-lg">
                    Các sản phẩm phổ biến
                  </Typography>
                )}
                <List className="-mt-2">
                  {searchedProducts.map((searchedProduct) => (
                    <List.Item
                      key={searchedProduct.key}
                      onClick={() => {
                        setSearchFocus(false);
                      }}
                    >
                      <ProductCard variant="list" product={searchedProduct} />
                    </List.Item>
                  ))}
                </List>
              </>
            )}

            {!searchedProducts.length && (
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
