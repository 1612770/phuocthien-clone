import GroupInfoModel from './GroupInfoModel';

type MainInfoModel = Partial<{
  code: number;
  name: string;
  type: string;
  visible: boolean;
  groupInfo: GroupInfoModel[];
}>;

export default MainInfoModel;
