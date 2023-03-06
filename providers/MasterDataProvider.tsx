import DistrictModel from '@configs/models/district.model';
import ProvinceModel from '@configs/models/province.model';
import WardModel from '@configs/models/ward.model';
import { MasterDataClient } from '@libs/client/MasterData';
import React, { useCallback, useState } from 'react';
import { useAppMessage } from './AppMessageProvider';

const MasterDataContext = React.createContext<{
  provinces: ProvinceModel[];
  setProvinces: (provinces: ProvinceModel[]) => void;
  districts: DistrictModel[];
  setDistricts: (districts: DistrictModel[]) => void;
  wards: WardModel[];
  setWards: (wards: WardModel[]) => void;

  loadDistricts: (payload: { provinceCode: string }) => Promise<void>;
  loadWards: (payload: { districtCode: string }) => Promise<void>;

  loadingDistricts: boolean;
  loadingWards: boolean;
}>({
  provinces: [],
  setProvinces: () => undefined,
  districts: [],
  setDistricts: () => undefined,
  wards: [],
  setWards: () => undefined,

  loadDistricts: () => Promise.resolve(),
  loadWards: () => Promise.resolve(),

  loadingDistricts: false,
  loadingWards: false,
});

function MasterDataProvider({
  defaultProvinces,
  children,
}: {
  defaultProvinces: ProvinceModel[];
  children: React.ReactNode;
}) {
  const [provinces, setProvinces] = useState<ProvinceModel[]>(defaultProvinces);
  const [districts, setDistricts] = useState<DistrictModel[]>([]);
  const [wards, setWards] = useState<WardModel[]>([]);

  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const { toastError } = useAppMessage();

  const loadDistricts = useCallback(
    async (payload: { provinceCode: string }) => {
      const masterDataClient = new MasterDataClient(null, {});

      try {
        setLoadingDistricts(true);

        const districts = await masterDataClient.getAllDistricts(payload);
        if (districts.data) {
          setDistricts(districts.data);
        }
      } catch (error) {
        toastError({
          data: error,
        });
      } finally {
        setLoadingDistricts(false);
      }
    },
    [toastError]
  );

  const loadWards = useCallback(
    async (payload: { districtCode: string }) => {
      const masterDataClient = new MasterDataClient(null, {});

      try {
        setLoadingWards(true);

        const wards = await masterDataClient.getAllWards(payload);
        if (wards.data) {
          setWards(wards.data);
        }
      } catch (error) {
        toastError({
          data: error,
        });
      } finally {
        setLoadingWards(false);
      }
    },
    [toastError]
  );

  return (
    <MasterDataContext.Provider
      value={{
        provinces,
        setProvinces,
        districts,
        setDistricts,
        wards,
        setWards,

        loadDistricts,
        loadWards,

        loadingDistricts,
        loadingWards,
      }}
    >
      {children}
    </MasterDataContext.Provider>
  );
}

export function useMasterData() {
  const context = React.useContext(MasterDataContext);

  //   if (context === undefined) {
  //     throw new Error('__void');
  //   }

  return context;
}

export default MasterDataProvider;
