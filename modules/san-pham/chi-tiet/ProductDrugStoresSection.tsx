import DrugStore from '@configs/models/drug-store.model';
import { InventoryAtDrugStore } from '@configs/models/product.model';
import DrugstoreItem from '@modules/drugstore/DrugstoreItem';
import { Typography, List, Empty } from 'antd';
import React from 'react';

function ProductDrugStoresSection({
  drugStoresAvailable,
  drugStores,
}: {
  drugStoresAvailable: InventoryAtDrugStore[];
  drugStores: DrugStore[];
}) {
  return (
    <div className="rounded-lg border border-solid border-gray-200">
      <Typography.Title level={5} className="px-4 pt-6 font-medium uppercase">
        {(drugStoresAvailable?.length || 0) > 0 ? (
          <>
            Có <b className="text-primary">{drugStoresAvailable?.length}</b> nhà
            thuốc có sẵn
          </>
        ) : (
          <>Hệ thống nhà thuốc Phước Thiện</>
        )}
      </Typography.Title>
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
    </div>
  );
}

export default ProductDrugStoresSection;
