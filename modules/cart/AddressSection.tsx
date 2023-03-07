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

  const {
    address,
    setAddress,
    currentProvinceKey,
    setCurrentProvinceKey,
    currentDistrictKey,
    setCurrentDistrictKey,
    currentWardKey,
    setCurrentWardKey,
  } = useCheckout();

  const { isUserLoggedIn } = useAuth();
  const { defaultAddress } = useAddresses();
  const { loadWards, loadDistricts, provinces } = useMasterData();
  const { toastError } = useAppMessage();

  const setDefaultDistrict = async (
    defaultAddress: AddressModel,
    provinceCode: string
  ) => {
    try {
      const districts = await loadDistricts({ provinceCode });

      const foundDistrict = districts?.find(
        (district) => district.districtName === defaultAddress.districtName
      );
      setCurrentDistrictKey(foundDistrict?.districtCode || '');
      const wards = await loadWards({
        districtCode: foundDistrict?.districtCode || '',
      });
      const foundWard = wards?.find(
        (ward) => ward.wardName === defaultAddress.wardName
      );
      setCurrentWardKey(foundWard?.wardName || '');
    } catch (error) {
      toastError({
        data: error,
      });
    }
  };

  useEffect(() => {
    if (defaultAddress && isUserLoggedIn) {
      setAddress(defaultAddress.address || '');

      const foundProvince = provinces.find(
        (province) => province.provinceName === defaultAddress.provinceName
      );

      setCurrentProvinceKey(foundProvince?.provinceCode || '');

      setDefaultDistrict(defaultAddress, foundProvince?.provinceCode || '');
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
                  setAddress(address.address || '');
                  const foundProvince = provinces.find(
                    (province) => province.provinceName === address.provinceName
                  );

                  setCurrentProvinceKey(foundProvince?.provinceCode || '');

                  setDefaultDistrict(
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
      <AddressInput
        address={address}
        setAddress={setAddress}
        currentProvinceKey={currentProvinceKey}
        setCurrentProvinceKey={setCurrentProvinceKey}
        currentDistrictKey={currentDistrictKey}
        setCurrentDistrictKey={setCurrentDistrictKey}
        currentWardKey={currentWardKey}
        setCurrentWardKey={setCurrentWardKey}
      />
    </div>
  );
}

export default AddressSection;
