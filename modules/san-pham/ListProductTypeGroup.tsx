import ImageWithFallback from '@components/templates/ImageWithFallback';
import { MenuProductType } from '@configs/constants/listMenu';
import ProductTypeGroupModel from '@configs/models/product-type-group.model';
import ProductType from '@configs/models/product-type.model';
import Link from 'next/link';

export const ListProductTypeGroup = ({
  productTypeGroupData,
  productType,
  productTypeUrl,
  type,
}: {
  productTypeGroupData: ProductTypeGroupModel[];
  productType: ProductType;
  productTypeUrl?: string;
  type?: string;
}) => {
  if (productTypeGroupData.length === 0) {
    return <></>;
  }
  return (
    <div
      className={`"${
        type === 'menu'
          ? 'shadow-inner md:grid-cols-2 lg:grid-cols-4'
          : 'md:grid-cols-4 lg:grid-cols-6'
      } lg:grid-cols-6"  mt-4 mb-4 grid grid-cols-2 gap-4 md:grid-cols-4`}
    >
      {productTypeGroupData.map((el) => (
        <Link
          key={el.key}
          href={`/${type === 'menu' ? productTypeUrl : productType.seoUrl}/${
            el.seoUrl
          }`}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center rounded-xl border border-solid border-gray-50 bg-white p-2 hover:cursor-pointer hover:border-primary hover:text-primary"
          >
            <ImageWithFallback
              src={el?.image || ''}
              width={type === 'menu' ? 24 : 32}
              height={type === 'menu' ? 24 : 32}
            />
            <div className="ml-4">
              <b>{el.name}</b>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
