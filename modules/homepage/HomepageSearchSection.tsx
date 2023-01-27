import ProductCard from '@components/templates/ProductCard';
import Product from '@configs/models/product.model';
import { ProductClient } from '@libs/client/Product';
import { useDebounce } from '@libs/utils/hooks';
import { useAppMessage } from '@providers/AppMessageProvider\b';
import { Button, Input, InputRef, Space, Spin, Tag, Typography } from 'antd';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Search } from 'react-feather';

function HomepageSearchSection() {
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
  }, [searchFocus]);

  const backdrop = (
    <div
      className="fixed inset-0 z-10 bg-black opacity-50"
      onClick={() => {
        setSearchFocus(false);
      }}
    />
  );

  const scrollSectionIntoView = () => {
    const searchSection = document.getElementById('search-section');
    const offsetTop = 20;

    const top = searchSection?.getBoundingClientRect().top || 0;
    const bodyTop = document.body.getBoundingClientRect().top;

    window.scrollTo({
      top: top - bodyTop - offsetTop,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {searchFocus && backdrop}

      <div
        id="search-section"
        className="relative z-[100] mx-auto rounded-3xl bg-white p-12 shadow-lg lg:container"
      >
        <Typography.Title level={1}>
          Tìm kiếm thuốc, bài viết sức khỏe...
        </Typography.Title>

        <Input.Group compact className="flex w-full">
          <Input
            onClick={() => {
              scrollSectionIntoView();
              setSearchFocus(true);
            }}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                scrollSectionIntoView();
              } else if (e.key === 'Escape') {
                setSearchFocus(false);
              }
            }}
            ref={(ref) => (searchInput.current = ref)}
            value={searchValue}
            placeholder="Tìm kiếm thuốc, bài viết sức khỏe..."
            size="large"
            className="h-[60px] w-full flex-1 rounded-l-full px-4 text-xl"
          />
          <Spin spinning={searching}>
            <Button
              type="primary"
              className=" h-[60px]  rounded-r-full shadow-none"
              size="large"
              disabled={searching}
            >
              <div className="mx-8">
                <Search size={32} />
              </div>
            </Button>
          </Spin>
        </Input.Group>

        <div className="mt-4">
          <Typography.Title
            level={4}
            className="mb-1 font-normal text-neutral-600"
          >
            Nổi bật
          </Typography.Title>
          <Space size={[8, 8]} wrap>
            {[
              'Thuốc đau đầu',
              'Thuốc đau bụng',
              'Thuốc đau mắt',
              'Thuốc xương khớp',
            ].map((tag) => (
              <Tag
                key={tag}
                className="cursor-pointer rounded-full border-none bg-primary-background p-2 text-base"
                onClick={() => {
                  setSearchFocus(true);
                  scrollSectionIntoView();
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
          <div className="mt-4">
            <div className="mb-2 flex w-full items-end justify-between">
              <Typography.Title
                level={4}
                className="mb-1 font-normal text-neutral-600"
              >
                Tìm thấy {searchedProducts.length} kết quả
              </Typography.Title>

              <Link href="/tim-kiem">
                <a className=" ">
                  <Typography className="text-blue-500">Xem tất cả</Typography>
                </a>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {searchedProducts.slice(0, 8).map((product) => (
                <ProductCard
                  className="w-full"
                  key={product.key}
                  product={product}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default HomepageSearchSection;
