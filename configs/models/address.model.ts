type AddressModel = Partial<{
  clientId: string;
  key: string;
  address: string;
  wardName: string;
  districtName: string;
  provinceName: string;
  isDefault: boolean;
}>;

export default AddressModel;
