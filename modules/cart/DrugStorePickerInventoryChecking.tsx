import { Divider, Spin, Typography } from 'antd';
import { useCart } from '@providers/CartProvider';
import { useEffect, useState } from 'react';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { useAppMessage } from '@providers/AppMessageProvider';
import DrugStore from '@configs/models/drug-store.model';
import { ProductClient } from '@libs/client/Product';
import Product from '@configs/models/product.model';
import ImageUtils from '@libs/utils/image.utils';

function DrugStorePickerInventoryChecking({
  drugStoreKey,
}: {
  drugStoreKey: string;
}) {
  const [checking, setChecking] = useState(false);

  const [productStatuses, setProductStatuses] = useState<
    { product: Product; status: boolean }[]
  >([]);

  const { cartProducts } = useCart();
  const { toastError } = useAppMessage();

  const checkProductStillAvailableAtDrugStore = (
    drugStoreKey: string,
    inventoryAtDrugStores:
      | {
          drugstore: DrugStore;
          quantity: number;
        }[]
      | undefined,
    productCart: { product: Product; quantity: number }
  ) => {
    const foundDrugstore = (inventoryAtDrugStores || []).find(
      (inventoryAtDrugStore) =>
        inventoryAtDrugStore?.drugstore.key === drugStoreKey
    );
    if (!foundDrugstore) return false;

    if (foundDrugstore.quantity < productCart.quantity) return false;

    return true;
  };

  const checkAllProducts = async () => {
    const product = new ProductClient(null, {});

    try {
      setChecking(true);
      const inventoryAtDrugStoresResponses = await Promise.all(
        cartProducts.map((cartProduct) =>
          product.checkInventoryAtDrugStores({
            key: cartProduct.product.key || '',
          })
        )
      );

      const inventoryAtDrugStores = inventoryAtDrugStoresResponses.map(
        (inventoryAtDrugStoresResponse) => inventoryAtDrugStoresResponse.data
      );

      const productStatuses: { product: Product; status: boolean }[] =
        inventoryAtDrugStores.reduce(
          (currentProductStatuses, inventoryAtDrugStore, index) => {
            const productStatus: { product: Product; status: boolean } = {
              product: {},
              status: false,
            };

            productStatus.product = cartProducts[index].product;
            productStatus.status = checkProductStillAvailableAtDrugStore(
              drugStoreKey,
              inventoryAtDrugStore,
              cartProducts[index]
            );

            return currentProductStatuses.concat(productStatus);
          },
          [] as { product: Product; status: boolean }[]
        );

      setProductStatuses(productStatuses);
    } catch (error) {
      toastError({ data: error });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (drugStoreKey) {
      checkAllProducts();
    }
  }, [drugStoreKey]);

  return (
    <>
      {productStatuses.length > 0 && (
        <>
          <Typography className="mt-2 font-medium">
            Tình trạng các sản phẩm tại nhà thuốc
          </Typography>
          <Divider className="my-2 h-[4px]"></Divider>

          <div className="pb-[20px]">
            <Spin spinning={checking}>
              <div className="bg-white">
                {productStatuses.map(
                  (productStatus, index) =>
                    !productStatus.status && (
                      <div
                        key={index}
                        className="mx-2 flex items-center rounded-lg border-b py-2"
                      >
                        <div className="relative mr-4 flex h-[60px] w-[60px] flex-col">
                          <ImageWithFallback
                            src={productStatus.product.detail?.image || ''}
                            alt="product image"
                            getMockImage={() => {
                              return ImageUtils.getRandomMockProductImageUrl();
                            }}
                            layout="fill"
                          />
                        </div>
                        <div key={productStatus.product.key} className="  p-2">
                          <Typography>{productStatus.product.name}</Typography>
                          <Typography
                            className={
                              productStatus.status
                                ? 'text-green-500'
                                : 'text-red-500'
                            }
                          >
                            {productStatus.status ? 'Còn hàng' : 'Hết hàng'}
                          </Typography>
                        </div>
                      </div>
                    )
                )}
              </div>
            </Spin>
          </div>
        </>
      )}
    </>
  );
}

export default DrugStorePickerInventoryChecking;
