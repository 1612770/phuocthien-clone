import ProfileModel from '@configs/models/profile.model';
import { AuthClient } from '@libs/client/Auth';
import { COOKIE_KEYS, getCookie, setCookie } from '@libs/helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppMessage } from './AppMessageProvider\b';
import { useRouter } from 'next/router';

const AuthContext = React.createContext<{
  userData?: ProfileModel;
  setUserData: (payload: ProfileModel) => void;
  logOut: () => void;
}>({
  userData: undefined,
  setUserData: () => undefined,
  logOut: () => undefined,
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<ProfileModel>();

  const { toastError } = useAppMessage();
  const router = useRouter();

  const logOut = useCallback(() => {
    setUserData(undefined);
    setCookie(null, '', COOKIE_KEYS.TOKEN);
    router.replace('/dang-nhap');
  }, [router]);

  const getAuthProfile = async () => {
    try {
      const auth = new AuthClient(null, {});
      const profileResult = await auth.getProfile();
      if (profileResult.data) {
        setUserData(profileResult.data);
      }
    } catch (error) {
      toastError({ data: error });
    }
  };

  useEffect(() => {
    const token = getCookie(null, COOKIE_KEYS.TOKEN);

    if (token) {
      getAuthProfile();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userData, setUserData, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  return context;
}

export default AuthProvider;
