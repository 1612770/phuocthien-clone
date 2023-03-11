import { Button, Modal, Typography } from 'antd';
import { MapPin } from 'react-feather';
import { useEffect, useState } from 'react';
import { useCheckout } from '@providers/CheckoutProvider';
import AddressInput from '@modules/cart/AddressInput';
import { useMasterData } from '@providers/MasterDataProvider';
import AddressModel from '@configs/models/address.model';
import { useAddresses } from '@providers/AddressesProvider';
import { useAuth } from '@providers/AuthProvider';
import { useAppMessage } from '@providers/AppMessageProvider';
import Addresses from '@modules/address/Addresses';

function AddressSection() {
  const [openModal, setOpenModal] = useState(false);

  const { checkoutForm } = useCheckout();

  const { isUserLoggedIn } = useAuth();
  const { defaultAddress } = useAddresses();
  const { loadWards, loadDistricts, provinces } = useMasterData();
  const { toastError } = useAppMessage();

  const setDefaultDistrictWard = async (
    defaultAddress: AddressModel,
    provinceCode: string
  ) => {
    try {
      const districts = await loadDistricts({ provinceCode });

      const foundDistrict = districts?.find(
        (district) => district.districtName === defaultAddress.districtName
      );
      checkoutForm?.setFieldValue(
        'currentDistrictKey',
        foundDistrict?.districtCode || ''
      );
      const wards = await loadWards({
        districtCode: foundDistrict?.districtCode || '',
      });
      const foundWard = wards?.find(
        (ward) => ward.wardName === defaultAddress.wardName
      );

      checkoutForm?.setFieldValue('currentWardKey', foundWard?.wardName || '');
    } catch (error) {
      toastError({
        data: error,
      });
    }
  };

  useEffect(() => {
    if (defaultAddress && isUserLoggedIn) {
      checkoutForm?.setFieldValue('address', defaultAddress.address || '');

      const foundProvince = provinces.find(
        (province) => province.provinceName === defaultAddress.provinceName
      );

      checkoutForm?.setFieldValue(
        'currentProvinceKey',
        foundProvince?.provinceCode || ''
      );

      setDefaultDistrictWard(defaultAddress, foundProvince?.provinceCode || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAddress, isUserLoggedIn]);

  return (
    <div className="my-4 rounded-lg bg-gray-50 p-4">
      <Typography.Text className="text-sm">
        Chọn địa chỉ để biết thời gian nhận hàng và phí vận chuyển (nếu có)
      </Typography.Text>
      {isUserLoggedIn && (
        <div>
          <Button
            type="link"
            className="my-0 px-0 "
            onClick={() => setOpenModal(true)}
            icon={<MapPin size={14} className=" mr-1 align-text-top" />}
          >
            Chọn địa chỉ từ sổ địa chỉ
          </Button>

          <Modal
            title={
              <Typography className="text-base font-medium">
                Sổ địa chỉ
              </Typography>
            }
            open={openModal}
            onCancel={() => setOpenModal(false)}
            footer={null}
          >
            <div className="max-h-[400px] overflow-y-auto">
              <Addresses
                pickOnly
                onAddressSelect={(address) => {
                  checkoutForm?.setFieldValue('address', address.address || '');

                  const foundProvince = provinces.find(
                    (province) => province.provinceName === address.provinceName
                  );

                  checkoutForm?.setFieldValue(
                    'currentProvinceKey',
                    foundProvince?.provinceCode || ''
                  );

                  setDefaultDistrictWard(
                    address,
                    foundProvince?.provinceCode || ''
                  );
                  setOpenModal(false);
                }}
              />
            </div>
          </Modal>
        </div>
      )}
      <AddressInput form={checkoutForm} />
    </div>
  );
}

export default AddressSection;
