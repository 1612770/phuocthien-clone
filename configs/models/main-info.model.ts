type MainInfoGroupInfoModel = Partial<{
  code: number;
  key: string;
  index: number;
  name: string;
  imageUrl: string;
  eventUrl: string;
  createdDate: string;
  description: string;
  visible: boolean;
}>;

type MainInfoModel = Partial<{
  code: number;
  name: string;
  type: number;
  visible: boolean;
  groupInfo: MainInfoGroupInfoModel[];
}>;

export default MainInfoModel;
