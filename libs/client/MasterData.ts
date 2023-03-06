import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import ProvinceModel from '@configs/models/province.model';
import DistrictModel from '@configs/models/district.model';
import WardModel from '@configs/models/ward.model';

export class MasterDataClient extends BaseClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(ctx: any, data: any) {
    super(ctx, data);
  }

  async getAllProvinces(): Promise<APIResponse<ProvinceModel[]>> {
    return await super.call('POST', `master-data/province`, {});
  }

  async getAllDistricts(payload: {
    provinceCode: string;
  }): Promise<APIResponse<DistrictModel[]>> {
    return await super.call('POST', `master-data/district`, payload);
  }

  async getAllWards(payload: {
    districtCode: string;
  }): Promise<APIResponse<WardModel[]>> {
    return await super.call('POST', `master-data/ward`, payload);
  }
}
