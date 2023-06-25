import EventModel from './event.model';

type GroupInfoModel = Partial<{
  code: number;
  key: string;
  index: number;
  name: string;
  imageUrl: string;
  eventUrl: string;
  createdDate: string;
  description: string;
  visible: boolean;
  eventInfos: EventModel[];
  seoUrl: string;
  titleSeo: string;
  metaSeo: string;
}>;

export default GroupInfoModel;
