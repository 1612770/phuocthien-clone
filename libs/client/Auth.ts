import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import ProfileModel from '@configs/models/profile.model';
import OtpSendAims from '@configs/enums/otp-send-aims.enum';

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
}
