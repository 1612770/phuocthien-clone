import { Button, Radio, Spin, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { DrugstoreClient } from '@libs/client/DrugStore';
import { useAppMessage } from '@providers/AppMessageProvider';
import DrugStore from '@configs/models/drug-store.model';
import DrugStorePickerInventoryChecking from './DrugStorePickerInventoryChecking';

function DrugStorePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (drugStoreKey: string) => void;
}) {
  const [drugStores, setDrugStores] = useState<DrugStore[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListLimited, setIsListLimited] = useState(true);

  const { toastError } = useAppMessage();
  const getDrugStores = async () => {
    try {
      setLoading(true);
      const drugStore = new DrugstoreClient(null, {});
      const drugStores = await drugStore.getAllDrugStores();
      setDrugStores(drugStores?.data || []);
    } catch (error) {
      toastError({ data: error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDrugStores();
  }, []);

  const showedDrugStores = useMemo(
    () => (isListLimited ? drugStores.slice(0, 4) : drugStores),
    [drugStores, isListLimited]
  );

  return (
    <Spin spinning={loading}>
      <div className="my-4 rounded-lg">
        <div className=" rounded-lg bg-gray-50 px-4">
          <div className="max-h-[200px] overflow-auto">
            <Radio.Group
              onChange={(e) => {
                onChange(e.target.value);
              }}
              value={value}
            >
              {showedDrugStores.map((drugStore) => (
                <div key={drugStore.key} className="my-4">
                  <Radio value={drugStore.key}>
                    <div className="ml-2">
                      <Typography className=" capitalize">
                        {drugStore.name}
                      </Typography>
                      <Typography className="text-xs capitalize text-gray-600">
                        {drugStore.address}
                      </Typography>
                    </div>
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          {drugStores.length > 4 && isListLimited && (
            <div>
              <Button
                className="my-4 cursor-pointer text-center text-blue-500"
                type="text"
                onClick={() => {
                  setIsListLimited(false);
                }}
              >
                Xem thêm {drugStores.length - 4} cửa hàng
              </Button>
            </div>
          )}

          <DrugStorePickerInventoryChecking drugStoreKey={value} />
        </div>
      </div>
    </Spin>
  );
}

export default DrugStorePicker;
