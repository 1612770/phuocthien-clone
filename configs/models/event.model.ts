type EventModel = Partial<{
  keyGroup: string;
  key: string;
  index: number;
  code: number;
  summary: string;
  description: string;
  name: string;
  imageUrl: string;
  eventUrl: string;
  visible: boolean;
  eventDate: string;
  isNew: boolean;
  isHot: boolean;
  isTop: boolean;
  seoUrl: string;
  titleSeo: string;
  metaSeo: string;
}>;

export default EventModel;
