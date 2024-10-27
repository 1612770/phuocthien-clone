import { Button, Checkbox, Form, Spin, Typography } from 'antd';
import { useCart } from '@providers/CartProvider';
import { useEffect, useState } from 'react';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { useAppMessage } from '@providers/AppMessageProvider';
import DrugStore from '@configs/models/drug-store.model';
import { ProductClient } from '@libs/client/Product';
import Product, { InventoryAtDrugStore } from '@configs/models/product.model';
import { useCheckout } from '@providers/CheckoutProvider';

function DrugStorePickerInventoryChecking({
  drugStoreKey,
}: {
  drugStoreKey: string;
}) {
  const [checking, setChecking] = useState(false);

  const { changeCartItemData, removeFromCart, cartProducts } = useCart();
  const { productStatuses, setProductStatuses } = useCheckout();
  const { toastError, toastSuccess } = useAppMessage();

  const choosenCartProducts = cartProducts.filter(
    (cartProduct) => cartProduct.choosen
  );

  const checkProductStillAvailableAtDrugStore = (
    drugStoreKey: string,
    inventoryAtDrugStores:
      | {
          drugstore: DrugStore;
          quantity: number;
        }[]
      | undefined,
    productCart: { product?: Product; quantity: number }
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

      const inventoryAtDrugStores: (InventoryAtDrugStore[] | undefined)[] = [];

      for (let i = 0; i < choosenCartProducts.length; i++) {
        const retInventory = await product.checkInventoryAtDrugStores({
          key: choosenCartProducts[i].product?.key || '',
        });
        inventoryAtDrugStores.push(retInventory.data);
      }

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

          const product = choosenCartProducts[index].product;
          if (product) {
            productStatus.product = product;
            productStatus.statusData = checkProductStillAvailableAtDrugStore(
              drugStoreKey,
              inventoryAtDrugStore,
              choosenCartProducts[index]
            );
            return currentProductStatuses.concat(productStatus);
          }

          return currentProductStatuses;
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
    <div className="bg-red-100">
      {productStatuses.length > 0 && (
        <>
          {notAvailableProducts.length > 0 && (
            <Spin spinning={checking}>
              <div className="bg-red-50 p-4">
                <>
                  <Form.Item
                    className="m-0 h-1 w-0 overflow-hidden"
                    name={`action-message`}
                    rules={[{ required: true, message: '' }]}
                  >
                    <Checkbox checked={false}></Checkbox>
                  </Form.Item>
                  <Typography className="font-medium text-red-500">
                    Vui lòng kiểm tra lại các sản phẩm bên dưới hoặc đổi hình
                    thức nhận hàng.
                  </Typography>
                </>

                {notAvailableProducts.map((productStatus, index) => (
                  <div
                    key={index}
                    className="mx-2 flex items-center rounded-lg border-b py-2"
                  >
                    <div className="relative mr-4 flex h-[60px] w-[60px] flex-col">
                      <ImageWithFallback
                        src={productStatus.product.detail?.image || ''}
                        alt="product image"
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
                                <b>
                                  {productStatus.statusData.drugstoreQuantity}{' '}
                                </b>
                                {(
                                  productStatus.product.unit || ''
                                ).toLowerCase()}
                              </Typography>
                              <Button
                                type="primary"
                                ghost
                                className="mt-2"
                                onClick={() => {
                                  changeCartItemData(
                                    { product: productStatus.product },
                                    {
                                      field: 'quantity',
                                      value:
                                        productStatus.statusData
                                          .drugstoreQuantity || 1,
                                    }
                                  );

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
                                  removeFromCart(
                                    { product: productStatus.product },
                                    {
                                      isShowConfirm: false,
                                    }
                                  );

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
          )}
        </>
      )}
    </div>
  );
}

export default DrugStorePickerInventoryChecking;
