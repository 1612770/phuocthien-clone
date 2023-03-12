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

  loadProvinces: () => Promise<void>;
  loadDistricts: (payload: {
    provinceCode: string;
  }) => Promise<DistrictModel[] | undefined>;
  loadWards: (payload: {
    districtCode: string;
  }) => Promise<WardModel[] | undefined>;

  loadingProvinces: boolean;
  loadingDistricts: boolean;
  loadingWards: boolean;
}>({
  provinces: [],
  setProvinces: () => undefined,
  districts: [],
  setDistricts: () => undefined,
  wards: [],
  setWards: () => undefined,

  loadProvinces: () => Promise.resolve(),
  loadDistricts: () => Promise.resolve([]),
  loadWards: () => Promise.resolve([]),

  loadingProvinces: false,
  loadingDistricts: false,
  loadingWards: false,
});

function MasterDataProvider({
  defaultProvinces,
  children,
}: {
  defaultProvinces?: ProvinceModel[];
  children: React.ReactNode;
}) {
  const [provinces, setProvinces] = useState<ProvinceModel[]>(
    defaultProvinces || []
  );
  const [districts, setDistricts] = useState<DistrictModel[]>([]);
  const [wards, setWards] = useState<WardModel[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const { toastError } = useAppMessage();

  const loadProvinces = useCallback(async () => {
    const masterDataClient = new MasterDataClient(null, {});

    try {
      setLoadingProvinces(true);

      const provices = await masterDataClient.getAllProvinces();
      if (provices.data) {
        setProvinces(provices.data);
      }
    } catch (error) {
      toastError({
        data: error,
      });
    } finally {
      setLoadingProvinces(false);
    }
  }, [toastError]);

  const loadDistricts = useCallback(
    async (payload: { provinceCode: string }) => {
      const masterDataClient = new MasterDataClient(null, {});

      try {
        setLoadingDistricts(true);

        const districts = await masterDataClient.getAllDistricts(payload);
        if (districts.data) {
          setDistricts(districts.data);
        }

        return districts.data;
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

        return wards.data;
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

        loadProvinces,
        loadDistricts,
        loadWards,

        loadingProvinces,
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
