import GroupInfoModel from '@configs/models/GroupInfoModel';
import EventModel from '@configs/models/event.model';
import { GeneralClient } from '@libs/client/General';
import { GetServerSidePropsContext } from 'next';

const getEventData = async (context: GetServerSidePropsContext) => {
  const eventData: {
    event?: EventModel;
    otherEvents?: EventModel[];
    groupInfo?: GroupInfoModel;
  } = {};

  const generalClient = new GeneralClient(context, {});
  const currentEventSeoUrl = context.params?.lv2Param as string;
  const currentGroupInfoSeoUrl = context.params?.lv1Param as string;

  const event = await generalClient.getEvent({
    eventSeoUrl: currentEventSeoUrl,
  });

  if (event.data) {
    eventData.event = event.data;

    if (event.data?.keyGroup) {
      const otherEvents = await generalClient.getGroupInfos({
        page: 1,
        pageSize: 5,
        groupSeoUrl: currentGroupInfoSeoUrl,
      });

      if (otherEvents.data) {
        eventData.groupInfo = otherEvents.data[0];

        const otherEventList = (otherEvents.data || [])
          .reduce((events, currentGroup) => {
            return [
              ...events,
              ...(currentGroup.eventInfos || []).filter(
                (event) => event.seoUrl !== currentEventSeoUrl
              ),
            ];
          }, [] as EventModel[])
          .slice(0, 3);

        eventData.otherEvents = otherEventList;
      }
    }
  } else {
    throw new Error('Không tìm thấy sự kiện');
  }

  return eventData;
};

export default getEventData;
