import { Button, Form, Radio, Spin, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { DrugstoreClient } from '@libs/client/DrugStore';
import { useAppMessage } from '@providers/AppMessageProvider';
import DrugStore from '@configs/models/drug-store.model';
import DrugStorePickerInventoryChecking from './DrugStorePickerInventoryChecking';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';

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
        <div className=" rounded-lg bg-gray-50 ">
          <Form.Item
            name="drugStore"
            className="relative w-full"
            rules={[
              {
                required: true,
                message: 'Hãy chọn một nhà thuốc để nhận hàng',
              },
            ]}
          >
            <div className="max-h-[280px] overflow-auto px-4">
              <Radio.Group
                className={isListLimited ? 'pb-12' : ''}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
                value={value}
              >
                {showedDrugStores.map((drugStore) => (
                  <div key={drugStore.key} className="my-4">
                    <Radio value={drugStore.key}>
                      <div className="ml-2 flex items-center">
                        <ImageWithFallback
                          src={drugStore.image || ''}
                          width={40}
                          height={40}
                          layout="fixed"
                          getMockImage={() =>
                            ImageUtils.getRandomMockDrugstoreUrl()
                          }
                        />
                        <div className="ml-4">
                          <Typography className="">{drugStore.name}</Typography>
                          <Typography className="text-xs text-gray-600">
                            Địa chỉ: {drugStore.address}
                          </Typography>
                        </div>
                      </div>
                    </Radio>
                  </div>
                ))}
              </Radio.Group>

              {drugStores.length > 4 && isListLimited && (
                <div className="absolute bottom-0 left-0 right-0 bg-gray-50 px-4">
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
            </div>
          </Form.Item>
        </div>

        <DrugStorePickerInventoryChecking drugStoreKey={value} />
      </div>
    </Spin>
  );
}

export default DrugStorePicker;
