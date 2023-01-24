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
import { useAppMessage } from '@providers/AppMessageProvider\b';
import ProductCard from '@components/templates/ProductCard';

function ProductSearchInputMobile({ onBack = () => undefined }) {
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

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 z-10 h-full w-full overflow-auto overscroll-contain bg-white px-4">
      <div className="my-4 flex items-center gap-2">
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
            <Typography className="my-4 text-lg">
              Tìm thấy <b>{searchedProducts.length}</b> sản phẩm
            </Typography>
          ) : (
            <Typography className="my-4 text-lg">
              Các sản phẩm phổ biến
            </Typography>
          )}
          <List className="-mt-2">
            {searchedProducts.map((searchedProduct) => (
              <List.Item className="px-0" key={searchedProduct.key}>
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
