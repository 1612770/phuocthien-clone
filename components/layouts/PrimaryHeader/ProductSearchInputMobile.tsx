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
import { ChevronLeft, Search } from 'react-feather';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from '@libs/utils/hooks';
import { ProductClient } from '@libs/client/Product';
import Product from '@configs/models/product.model';
import { useAppMessage } from '@providers/AppMessageProvider';
import ProductCard from '@components/templates/ProductCard';
import WithPagination from '@configs/types/utils/with-pagination';
import Link from 'next/link';
import { useAppData } from '@providers/AppDataProvider';
import { useRouter } from 'next/router';

function ProductSearchInputMobile({ onBack = () => undefined }) {
  const [searchValue, setSearchValue] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchedProducts, setSearchedProducts] =
    useState<WithPagination<Product[]>>();

  const debouncedCurrentFocusGroup = useDebounce(searchValue, 500);
  const searchInput = useRef<InputRef | null>(null);
  const { toastError } = useAppMessage();
  const router = useRouter();
  const { productSearchKeywords, getProductSearchKeywords } = useAppData();

  const searchProducts = useCallback(async () => {
    const product = new ProductClient(null, {});
    try {
      setSearching(true);

      const searchProducts = await product.getProducts({
        page: 1,
        pageSize: 10,
        isPrescripted: false,
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
   * Get keywords for search when component mounted
   */
  useEffect(() => {
    getProductSearchKeywords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (router.query['tu-khoa']) {
      setSearchValue(router.query['tu-khoa'] as string);
    }
  }, [router]);

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 z-10 h-full w-full overflow-auto overscroll-contain bg-white px-4">
      <div className="my-4 -mx-2 flex items-center gap-2">
        <Button
          shape="circle"
          type="default"
          onClick={onBack}
          className="mt-1 border-none shadow-none"
          icon={<ChevronLeft className="text-black" size={20} />}
        />

        <Typography className="text-lg font-medium">
          Tìm kiếm sản phẩm của bạn
        </Typography>
      </div>

      <Input
        autoFocus
        ref={(ref) => (searchInput.current = ref)}
        placeholder="Tìm kiếm sản phẩm..."
        size="large"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className={`h-10 rounded-md px-4`}
        readOnly={searching}
        suffix={
          <Spin spinning={searching}>
            <Search size={20} />
          </Spin>
        }
      />

      <div className="mt-4">
        <Space size={[8, 8]} wrap>
          {productSearchKeywords.map((keyword) => (
            <Tag
              key={keyword.id}
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
            <Typography className="my-4 text-lg">
              Tìm thấy <b>{searchedProducts?.total || 0}</b> sản phẩm
            </Typography>
          ) : (
            <Typography className="my-4 text-lg">
              Các sản phẩm phổ biến
            </Typography>
          )}

          <List className="-mt-2">
            {searchedProducts?.data.map((searchedProduct) => (
              <List.Item
                className="px-0"
                key={searchedProduct.key}
                onClick={() => {
                  onBack();
                }}
              >
                <ProductCard variant="list" product={searchedProduct} />
              </List.Item>
            ))}
          </List>

          {(searchedProducts?.data.length || 0) <
            (searchedProducts?.total || 0) && (
            <div
              onClick={() => router.push(`/tim-kiem?tu-khoa=${searchValue}`)}
            >
              <Button
                block
                className="mt-4 mb-4"
                type="link"
                onClick={() => {
                  onBack();
                }}
              >
                Xem tất cả
              </Button>
            </div>
          )}
        </>
      )}

      {!searchedProducts?.total && (
        <div className="my-4">
          <Empty
            description={
              searchValue ? (
                <Typography>
                  Không có tìm kiếm nào phù hợp với từ khóa <b>{searchValue}</b>
                </Typography>
              ) : (
                <Typography>Nhập từ khóa để tìm kiếm sản phẩm</Typography>
              )
            }
          ></Empty>
        </div>
      )}
    </div>
  );
}

export default ProductSearchInputMobile;
