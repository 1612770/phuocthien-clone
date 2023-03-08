import ProfileModel from '@configs/models/profile.model';
import { AuthClient } from '@libs/client/Auth';
import { COOKIE_KEYS, getCookie, setCookie } from '@libs/helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppMessage } from './AppMessageProvider';
import { useRouter } from 'next/router';
import { useAppConfirmDialog } from './AppConfirmDialogProvider';
import ErrorCodes from '@configs/enums/error-codes.enum';

const AuthContext = React.createContext<{
  userData?: ProfileModel;
  setUserData: (payload: ProfileModel) => void;
  logOut: () => void;
  isUserLoggedIn: boolean;
}>({
  userData: undefined,
  setUserData: () => undefined,
  logOut: () => undefined,
  isUserLoggedIn: false,
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<ProfileModel>();

  const { toastError } = useAppMessage();
  const router = useRouter();
  const { setConfirmData } = useAppConfirmDialog();

  const logOut = useCallback(() => {
    setConfirmData({
      title: 'Đăng xuất',
      content: 'Bạn có chắc chắn muốn đăng xuất?',
      onOk: () => {
        setUserData(undefined);
        setCookie(null, '', COOKIE_KEYS.TOKEN);
        router.replace('/dang-nhap');
      },
    });
  }, [router, setConfirmData]);

  const getAuthProfile = async () => {
    try {
      const auth = new AuthClient(null, {});
      const profileResult = await auth.getProfile();
      if (profileResult.data) {
        setUserData(profileResult.data);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.error?.code === ErrorCodes.USER_NOT_FOUND) {
        setUserData(undefined);
        setCookie(null, '', COOKIE_KEYS.TOKEN);
      }

      toastError({ data: error });
    }
  };

  useEffect(() => {
    const token = getCookie(null, COOKIE_KEYS.TOKEN);

    if (token) {
      getAuthProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isUserLoggedIn = !!userData?.id;

  return (
    <AuthContext.Provider
      value={{ userData, setUserData, logOut, isUserLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  return context;
}

export default AuthProvider;
