import { InfoCircleOutlined, ShopOutlined } from '@ant-design/icons';
import { InventoryAtDrugStore } from '@configs/models/product.model';
import DrugstoreItem from '@modules/drugstore/DrugstoreItem';
import { Typography, List, Empty, Modal, ModalProps } from 'antd';
import React, { useState } from 'react';

function ProductDrugStoresModal({
  drugStoresAvailable,
  ...modalProps
}: ModalProps & {
  drugStoresAvailable: InventoryAtDrugStore[];
}) {
  return (
    <Modal {...modalProps} footer={null}>
      <List className="max-h-[440px] overflow-y-scroll px-0">
        {!!drugStoresAvailable.length &&
          drugStoresAvailable?.map((drugStore) => (
            <DrugstoreItem
              quantity={drugStore.quantity}
              drugstore={drugStore.drugstore}
              key={drugStore.drugstore?.key}
            />
          ))}

        {!drugStoresAvailable?.length && (
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
}: {
  drugStoresAvailable: InventoryAtDrugStore[] | undefined;
}) {
  const [openDrugStoresModal, setOpenDrugStoresModal] = useState(false);

  if (drugStoresAvailable != undefined && drugStoresAvailable.length == 0)
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
        drugStoresAvailable={drugStoresAvailable || []}
        open={openDrugStoresModal}
        onCancel={() => setOpenDrugStoresModal(false)}
      />
    </>
  );
}

export default ProductDrugStoresSection;
