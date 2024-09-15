import { Typography } from 'antd';
import useProductAutoLoadByIds from '@libs/utils/hooks/useProductAutoLoadByIds';
import AddToCartButton from '@modules/products/AddToCartButton';
import CurrencyUtils from '@libs/utils/currency.utils';
import ProductImages from './ProductImages';
import Link from 'next/link';
import { ComboPromotionModel } from '@configs/models/promotion.model';

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
    <div className="mb-4 flex flex-col gap-4 md:flex-row">
      <div className="relative h-[200px] w-full flex-none md:w-1/3">
        <ProductImages imageUrls={imageUrls} />
      </div>
      <div className="flex-auto pt-2">
        <Typography.Title level={4}>{comboPromotion.name}</Typography.Title>

        <ul className="flex flex-col gap-2 pl-2">
          {productsWithPolicyAndDiscount.map((product) => (
            <li key={product.key} className="flex flex-col gap-1">
              <Link
                href={`/${product?.productType?.seoUrl}/${product?.detail?.seoUrl}`}
                passHref
              >
                <a className="hover:text-primary">
                  <Typography.Text>
                    • {product.policy?.requiredProdQty} x{' '}
                    <span className="inline-block" style={{ fontWeight: 500 }}>
                      {product.detail?.displayName}
                    </span>
                  </Typography.Text>
                </a>
              </Link>
            </li>
          ))}
        </ul>

        <Typography.Title level={3} className="m-0 text-primary">
          {CurrencyUtils.format(comboPromotion.totalCost)}
        </Typography.Title>
        <Typography.Paragraph className="line-through">
          {CurrencyUtils.format(comboPromotion.totalAmount)}
        </Typography.Paragraph>

        <AddToCartButton
          label="Chọn mua combo"
          className="w-full rounded-full shadow-none transition duration-300 group-hover:border-primary-light group-hover:bg-primary-light group-hover:text-white"
          comboPromotion={{ ...comboPromotion, images: imageUrls }}
        />
      </div>
    </div>
  );
}

export default ComboPromotionItem;
