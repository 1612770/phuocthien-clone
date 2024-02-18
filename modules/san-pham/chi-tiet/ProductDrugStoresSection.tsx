import { InfoCircleOutlined, ShopOutlined } from '@ant-design/icons';
import DrugStore from '@configs/models/drug-store.model';
import { InventoryAtDrugStore } from '@configs/models/product.model';
import DrugstoreItem from '@modules/drugstore/DrugstoreItem';
import { Typography, List, Empty, Modal, ModalProps } from 'antd';
import React, { useState } from 'react';

function ProductDrugStoresModal({
  drugStoresAvailable,
  drugStores,
  ...modalProps
}: ModalProps & {
  drugStoresAvailable: InventoryAtDrugStore[];
  drugStores: DrugStore[];
}) {
  return (
    <Modal {...modalProps} footer={null}>
      <List className="max-h-[440px] overflow-y-scroll px-0">
        {!!drugStores.length &&
          drugStores?.map((drugStore) => (
            <DrugstoreItem drugstore={drugStore} key={drugStore.key} />
          ))}

        {!!drugStoresAvailable.length &&
          drugStoresAvailable?.map((drugStore) => (
            <DrugstoreItem
              quantity={drugStore.quantity}
              drugstore={drugStore.drugstore}
              key={drugStore.drugstore?.key}
            />
          ))}

        {!drugStoresAvailable?.length && !drugStores.length && (
          <Empty
            className="my-8"
            description={<Typography>Không có nhà thuốc nào</Typography>}
          ></Empty>
        )}
      </List>
    </Modal>
  );
}

function ProductDrugStoresSection({
  drugStoresAvailable,
  drugStores,
}: {
  drugStoresAvailable: InventoryAtDrugStore[];
  drugStores: DrugStore[];
}) {
  const [openDrugStoresModal, setOpenDrugStoresModal] = useState(false);

  if (!drugStoresAvailable?.length && !drugStores.length)
    return (
      <div className="font-bold text-red-600">
        <InfoCircleOutlined className="mr-2" /> Sản phẩm tạm hết hàng. Vui lòng
        liên hệ dược sĩ.
      </div>
    );

  return (
    <>
      <Typography.Text
        className="mt-4 cursor-pointer text-primary underline"
        onClick={() => setOpenDrugStoresModal(true)}
      >
        <ShopOutlined className="mr-2" />
        {(drugStoresAvailable?.length || 0) > 0 ? (
          <>
            Có <b className="text-primary">{drugStoresAvailable?.length}</b> nhà
            thuốc có sẵn hàng
          </>
        ) : (
          <>Hệ thống nhà thuốc Phước Thiện</>
        )}
      </Typography.Text>

      <ProductDrugStoresModal
        title="Danh sách nhà thuốc"
        drugStores={drugStores}
        drugStoresAvailable={drugStoresAvailable}
        open={openDrugStoresModal}
        onCancel={() => setOpenDrugStoresModal(false)}
      />
    </>
  );
}

export default ProductDrugStoresSection;
