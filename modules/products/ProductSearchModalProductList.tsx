import ProductCard from '@components/templates/ProductCard';
import IMAGES from '@configs/assests/images';
import Product from '@configs/models/product.model';
import WithPagination from '@configs/types/utils/with-pagination';
import { ProductClient } from '@libs/client/Product';
import { useDebounce } from '@libs/utils/hooks';
import { useAppMessage } from '@providers/AppMessageProvider';
import { Button, Empty, Input, Spin } from 'antd';
import { useState, useRef, useCallback, useEffect } from 'react';

function ProductSearchModalProductList({
  selectedProducts,
  setSelectedProducts,
}: {
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
}) {
  const [searchValue, setSearchValue] = useState('');
  const debouncedCurrentFocusGroup = useDebounce(searchValue, 300);
  const [searching, setSearching] = useState(false);

  const ignoreFirstCall = useRef(false);
  const { toastError } = useAppMessage();

  const [searchedProducts, setSearchedProducts] =
    useState<WithPagination<Product[]>>();

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

      if (searchProducts.data) {
        searchProducts.data.data = searchProducts.data?.data?.slice(0, 6);
      }

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

  return (
    <>
      <Input
        size="large"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
      />
      <Spin spinning={searching}>
        {!searchedProducts?.data.length && (
          <Empty
            description={
              debouncedCurrentFocusGroup
                ? 'Không tìm thấy sản phẩm'
                : 'Nhập từ khóa để tìm kiếm sản phẩm'
            }
            image={IMAGES.empty}
            imageStyle={{ height: 60 }}
          ></Empty>
        )}

        <div className="hidden grid-cols-12 md:grid md:gap-2">
          {searchedProducts?.data.map((product, index) => {
            const isSelected = selectedProducts.find(
              (item) => item.key === product.key
            );
            const actionComponent = (
              <Button
                block
                size="small"
                shape="round"
                type={isSelected ? 'default' : 'primary'}
                className="h-[32px]"
                onClick={() => {
                  if (isSelected) {
                    setSelectedProducts(
                      selectedProducts.filter(
                        (item) => item.key !== product.key
                      )
                    );
                  } else {
                    setSelectedProducts([...selectedProducts, product]);
                  }
                }}
              >
                {isSelected ? 'Bỏ chọn' : 'Thêm'}
              </Button>
            );

            return product ? (
              <div className="col-span-4 w-full" key={index}>
                <ProductCard
                  hrefDisabled
                  hidePrice
                  size="small"
                  product={product}
                  actionComponent={actionComponent}
                />
              </div>
            ) : null;
          })}
        </div>

        <div className="-mx-2 flex w-full overflow-auto pl-2 md:hidden">
          {searchedProducts?.data.map((product, index) => {
            const isSelected = selectedProducts.find(
              (item) => item.key === product.key
            );
            const actionComponent = (
              <Button
                block
                size="small"
                shape="round"
                type={isSelected ? 'default' : 'primary'}
                className="h-[32px]"
                onClick={() => {
                  if (isSelected) {
                    setSelectedProducts(
                      selectedProducts.filter(
                        (item) => item.key !== product.key
                      )
                    );
                  } else {
                    setSelectedProducts([...selectedProducts, product]);
                  }
                }}
              >
                {isSelected ? 'Bỏ chọn' : 'Thêm'}
              </Button>
            );

            return product ? (
              <ProductCard
                size="small"
                hidePrice
                hrefDisabled
                key={index}
                product={product}
                className="m-2 min-w-[240px] max-w-[240px]"
                actionComponent={actionComponent}
              />
            ) : null;
          })}
        </div>
      </Spin>
    </>
  );
}

export default ProductSearchModalProductList;
