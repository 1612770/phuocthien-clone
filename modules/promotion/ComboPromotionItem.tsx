import { Typography } from 'antd';
import useProductAutoLoadByIds from '@libs/utils/hooks/useProductAutoLoadByIds';
import AddToCartButton from '@modules/products/AddToCartButton';
import CurrencyUtils from '@libs/utils/currency.utils';
import ProductImages from './ProductImages';
import Link from 'next/link';
import { ComboPromotionModel } from '@configs/models/promotion.model';
import { FireFilled, PlusOutlined } from '@ant-design/icons';

function ComboPromotionItem({
  comboPromotion,
}: {
  comboPromotion: ComboPromotionModel;
}) {
  const productIds = (comboPromotion.policies || []).map(
    (policy) => policy.prodId
  );

  const { products } = useProductAutoLoadByIds(productIds);

  const imageUrls =
    products.map(
      (product) => product.images?.[0].image || product.detail?.image || ''
    ) || [];

  const productsWithPolicyAndDiscount = products.map((product) => {
    const policy = comboPromotion.policies?.find(
      (policy) => policy.prodId === product.key
    );

    const discount = comboPromotion.discounts?.find(
      (discount) => discount.prodId === product.key
    );

    return {
      ...product,
      policy,
      discount,
    };
  });

  return (
    <div className="border-1s mb-4 flex flex-col gap-4 rounded-lg border-solid border-gray-100 bg-white p-4 py-0 pb-6 shadow-sm transition-all duration-200 ease-in-out hover:cursor-pointer hover:shadow-md md:flex-row md:py-6">
      <div className="relative h-[200px] w-full flex-none md:w-1/3">
        <ProductImages imageUrls={imageUrls} />

        <div className="absolute top-3 left-3 rounded-md bg-red-500 px-2 py-1 font-medium text-white">
          <FireFilled className="mr-1 stroke-white text-orange-400" />
          COMBO
        </div>
      </div>
      <div className="flex-auto">
        <Typography.Title level={5} className="mx-0 my-0.5">
          {comboPromotion.name}
        </Typography.Title>

        <ul className="my-1 flex flex-col gap-1 pl-2">
          {productsWithPolicyAndDiscount.map((product) => (
            <li key={product.key} className="flex flex-col gap-1">
              <Link
                href={`/${product?.productType?.seoUrl}/${product?.detail?.seoUrl}`}
                passHref
              >
                <a className="hover:text-primary">
                  <Typography.Text>
                    <span className="inline-block" style={{ fontWeight: 500 }}>
                      • {product.policy?.requiredProdQty} x{' '}
                      {product.detail?.displayName}
                    </span>
                  </Typography.Text>
                </a>
              </Link>
            </li>
          ))}
        </ul>

        <Typography.Title
          level={3}
          className="m-0 flex items-end gap-1 text-primary"
        >
          {CurrencyUtils.format(comboPromotion.totalCost)}

          <Typography.Paragraph className="m-0 ">/ combo</Typography.Paragraph>
          <Typography.Paragraph className="m-0 ">(</Typography.Paragraph>
          <Typography.Paragraph className="m-0 line-through">
            {CurrencyUtils.format(comboPromotion.totalAmount)}
          </Typography.Paragraph>
          <Typography.Paragraph className="m-0 ">)</Typography.Paragraph>
        </Typography.Title>
      </div>
      <div className="w-[160px]">
        <AddToCartButton
          label={
            <div className="flex items-center font-medium">
              <PlusOutlined className="mr-1" />
              Chọn mua combo
            </div>
          }
          className="h-[40px] w-full rounded-full shadow-none transition duration-300 group-hover:border-primary-light group-hover:bg-primary-light group-hover:text-white"
          comboPromotion={{ ...comboPromotion, images: imageUrls }}
        />
      </div>
    </div>
  );
}

export default ComboPromotionItem;
