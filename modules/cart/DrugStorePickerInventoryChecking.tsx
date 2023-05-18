import { Button, Checkbox, Form, Spin, Typography } from 'antd';
import { useCart } from '@providers/CartProvider';
import { useEffect, useState } from 'react';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { useAppMessage } from '@providers/AppMessageProvider';
import DrugStore from '@configs/models/drug-store.model';
import { ProductClient } from '@libs/client/Product';
import Product from '@configs/models/product.model';
import ImageUtils from '@libs/utils/image.utils';
import { useCheckout } from '@providers/CheckoutProvider';

function DrugStorePickerInventoryChecking({
  drugStoreKey,
}: {
  drugStoreKey: string;
}) {
  const [checking, setChecking] = useState(false);

  const { choosenCartProducts, changeProductData, removeFromCart } = useCart();
  const { productStatuses, setProductStatuses } = useCheckout();
  const { toastError, toastSuccess } = useAppMessage();

  const checkProductStillAvailableAtDrugStore = (
    drugStoreKey: string,
    inventoryAtDrugStores:
      | {
          drugstore: DrugStore;
          quantity: number;
        }[]
      | undefined,
    productCart: { product: Product; quantity: number }
  ): {
    isStillAvailable: boolean;
    drugstoreQuantity?: number;
  } => {
    const foundDrugstore = (inventoryAtDrugStores || []).find(
      (inventoryAtDrugStore) =>
        inventoryAtDrugStore?.drugstore.key === drugStoreKey
    );
    if (!foundDrugstore)
      return {
        isStillAvailable: false,
      };

    if (foundDrugstore.quantity < productCart.quantity)
      return {
        isStillAvailable: false,
        drugstoreQuantity: foundDrugstore.quantity,
      };

    return { isStillAvailable: true };
  };

  const checkAllProducts = async () => {
    const product = new ProductClient(null, {});

    try {
      setChecking(true);
      const inventoryAtDrugStoresResponses = await Promise.all(
        choosenCartProducts.map((cartProduct) =>
          product.checkInventoryAtDrugStores({
            key: cartProduct.product.key || '',
          })
        )
      );

      const inventoryAtDrugStores = inventoryAtDrugStoresResponses.map(
        (inventoryAtDrugStoresResponse) => inventoryAtDrugStoresResponse.data
      );

      const productStatuses: {
        product: Product;
        statusData: {
          isStillAvailable: boolean;
          drugstoreQuantity?: number;
        };
      }[] = inventoryAtDrugStores.reduce(
        (currentProductStatuses, inventoryAtDrugStore, index) => {
          const productStatus: {
            product: Product;
            statusData: {
              isStillAvailable: boolean;
              drugstoreQuantity?: number;
            };
          } = {
            product: {},
            statusData: {
              isStillAvailable: false,
            },
          };

          productStatus.product = choosenCartProducts[index].product;
          productStatus.statusData = checkProductStillAvailableAtDrugStore(
            drugStoreKey,
            inventoryAtDrugStore,
            choosenCartProducts[index]
          );

          return currentProductStatuses.concat(productStatus);
        },
        [] as {
          product: Product;
          statusData: {
            isStillAvailable: boolean;
            drugstoreQuantity?: number;
          };
        }[]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drugStoreKey]);

  /**
   * Clear product statuses when unmount
   */
  useEffect(() => {
    return () => {
      setProductStatuses([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notAvailableProducts = productStatuses.filter(
    (productStatus) => !productStatus.statusData.isStillAvailable
  );

  return (
    <>
      {productStatuses.length > 0 && (
        <>
          <Spin spinning={checking}>
            <div className="bg-white">
              {notAvailableProducts.length > 0 && (
                <>
                  <Form.Item
                    className="m-0 h-1 w-0 overflow-hidden"
                    name={`action-message`}
                    rules={[{ required: true, message: '' }]}
                  >
                    <Checkbox checked={false}></Checkbox>
                  </Form.Item>
                  <Typography className="font-medium text-red-500">
                    Hãy kiểm tra lại các hành động bên dưới
                  </Typography>
                </>
              )}

              {notAvailableProducts.map((productStatus, index) => (
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
                    <Typography className="font-medium">
                      {productStatus.product.detail?.displayName}
                    </Typography>
                    {!productStatus.statusData.isStillAvailable && (
                      <>
                        {(productStatus.statusData.drugstoreQuantity ||
                          0 > 0) && (
                          <>
                            <Typography className={'text-red-500'}>
                              Hiện tại, nhà thuốc này chỉ còn{' '}
                              {productStatus.statusData.drugstoreQuantity}{' '}
                              {(productStatus.product.unit || '').toLowerCase()}
                            </Typography>
                            <Button
                              type="primary"
                              ghost
                              className="mt-2"
                              onClick={() => {
                                changeProductData(productStatus.product, {
                                  field: 'quantity',
                                  value:
                                    productStatus.statusData
                                      .drugstoreQuantity || 1,
                                });

                                setProductStatuses(
                                  productStatuses.filter(
                                    (productStatus) =>
                                      productStatus.product.key !==
                                      productStatus.product.key
                                  )
                                );

                                toastSuccess({
                                  data: 'Cập nhật số lượng thành công',
                                });
                              }}
                            >
                              Cập nhật giỏ hàng
                            </Button>
                          </>
                        )}

                        {!productStatus.statusData.drugstoreQuantity && (
                          <>
                            <Typography className={'text-red-500'}>
                              Hiện tại, nhà thuốc này đã hết hàng
                            </Typography>
                            <Button
                              type="primary"
                              ghost
                              danger
                              className="mt-2"
                              onClick={() => {
                                removeFromCart(productStatus.product, {
                                  isShowConfirm: false,
                                });

                                setProductStatuses(
                                  productStatuses.filter(
                                    (productStatus) =>
                                      productStatus.product.key !==
                                      productStatus.product.key
                                  )
                                );

                                toastSuccess({
                                  data: 'Bỏ khỏi giỏ hàng thành công',
                                });
                              }}
                            >
                              Bỏ khỏi giỏ hàng
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Spin>
        </>
      )}
    </>
  );
}

export default DrugStorePickerInventoryChecking;
