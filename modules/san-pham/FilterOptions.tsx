import BrandModel from '@configs/models/brand.model';
import { Typography, Checkbox } from 'antd';
import { useRouter } from 'next/router';

function FilterOptions({
  productBrands,
  onFilterClick,
}: {
  productBrands: BrandModel[];
  onFilterClick?: () => void;
}) {
  const router = useRouter();
  const selectedBrands = ((router.query.brands as string) || '')
    .split(',')
    .filter((brand) => !!brand);

  return (
    <div className="py-4">
      <div className="flex gap-4">
        <Typography.Text className="font-medium">Hãng sản xuất</Typography.Text>
      </div>
      <div className="mt-2 ml-4 flex flex-col">
        {productBrands.map((brand) => {
          const isActive =
            !!brand?.seoUrl && selectedBrands.includes(brand?.seoUrl || '');

          return (
            <div key={brand.key}>
              <Checkbox
                className="my-2 cursor-pointer"
                checked={isActive}
                onClick={() => {
                  onFilterClick?.();
                  if (isActive) {
                    const newBrands = selectedBrands.filter(
                      (selectedBrand) => selectedBrand !== brand.seoUrl
                    );
                    router.push({
                      query: {
                        ...router.query,
                        brands: newBrands.join(','),
                      },
                    });
                  } else {
                    router.push({
                      query: {
                        ...router.query,
                        brands: [...selectedBrands, brand.seoUrl].join(','),
                      },
                    });
                  }
                }}
              >
                {brand.name}
              </Checkbox>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FilterOptions;
