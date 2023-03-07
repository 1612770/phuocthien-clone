import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import ProfileModel from '@configs/models/profile.model';
import OtpSendAims from '@configs/enums/otp-send-aims.enum';
import AddressModel from '@configs/models/address.model';

export class AuthClient extends BaseClient {
  constructor(ctx: unknown, data: unknown) {
    super(ctx, data);
  }

  async verifyPhone(payload: { phoneNumber: string }): Promise<
    APIResponse<{
      code: string;
      msg: string;
    }>
  > {
    return await super.call('PUT', `auth/verify-phone`, payload);
  }

  async sendOtp(payload: {
    phoneNumber: string;
    aim: OtpSendAims;
  }): Promise<APIResponse<{ verifyToken: string; remainSeconds: number }>> {
    return await super.call('POST', `auth/otp`, payload);
  }

  async verifyOtp(payload: {
    verifyToken: string;
    otpCode: string;
  }): Promise<APIResponse<string>> {
    return await super.call('POST', `auth/verify-otp`, payload);
  }

  async createAccount(payload: {
    phoneNumber: string;
    verifyToken: string;
    password: string;
  }): Promise<APIResponse<string>> {
    return await super.call('POST', `auth/create`, payload);
  }

  async signIn(payload: { phoneNumber: string; password: string }): Promise<
    APIResponse<{
      token: string;
      user: ProfileModel;
    }>
  > {
    return await super.call('POST', `auth/sign-in`, payload);
  }

  async updatePasswordByPhone(payload: {
    phoneNumber: string;
    verifyToken: string;
    password: string;
  }): Promise<APIResponse<unknown>> {
    return await super.call('POST', `auth/update-password-by-phone`, payload);
  }

  async getProfile(): Promise<APIResponse<ProfileModel>> {
    return await super.call('GET', `auth/profile`, {});
  }

  async getAddresses(): Promise<APIResponse<AddressModel[]>> {
    return await super.call('GET', `auth/address`, {});
  }

  async createAddress(payload: {
    address: string;
    provinceName: string;
    districtName: string;
    wardName: string;
    isDefault?: boolean;
  }): Promise<APIResponse<AddressModel[]>> {
    return await super.call('POST', `auth/address`, payload);
  }

  async updateAddress(payload: {
    key: string;
    address: string;
    provinceName: string;
    districtName: string;
    wardName: string;
    isDefault?: boolean;
  }): Promise<APIResponse<AddressModel[]>> {
    return await super.call('PUT', `auth/address`, payload);
  }

  async deleteAddress(payload: {
    key: string;
  }): Promise<APIResponse<AddressModel[]>> {
    return await super.call('POST', `auth/address/delete`, payload);
  }
}
