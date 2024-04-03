import AppDangerouslySetInnerHTML from '@components/AppDangerouslySetInnerHTML';
import Breadcrumbs from '@components/Breadcrumbs';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { NEXT_PUBLIC_GROUP_INFO_KEYS } from '@configs/env';
import GroupInfoModel from '@configs/models/GroupInfoModel';
import EventModel from '@configs/models/event.model';
import TimeUtils from '@libs/utils/time.utils';
import EventItem from '@modules/event/EventItem';
import { useAppData } from '@providers/AppDataProvider';
import { Divider, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import { Clock } from 'react-feather';
import MainInfoMenu from './MainInfoMenu';
import MainInfoMenuButton from './MainInfoMenuButton';

const EventPage: NextPageWithLayout<{
  event?: EventModel;
  otherEvents?: EventModel[];
  groupInfo?: GroupInfoModel;
}> = ({ event, otherEvents, groupInfo }) => {
  // const { mainInfoFooter } = useAppData();

  if (!event) return null;
  if (typeof event?.visible === 'boolean' && !event?.visible) return null;

  // const allMainInfoFooterEventKeys = mainInfoFooter.reduce((acc, curr) => {
  //   const groupInfoEventKeys =
  //     curr.groupInfo?.reduce((acc, cur) => {
  //       const eventKeys =
  //         cur.eventInfos?.map((event) => event?.key || '') || [];

  //       return [...acc, ...eventKeys];
  //     }, [] as string[]) || [];

  //   return [...acc, ...groupInfoEventKeys];
  // }, [] as string[]);

  // const isEventArticle = !allMainInfoFooterEventKeys.includes(event?.key || '');

  return (
    <>
      <div className="px-4 lg:container lg:px-0">
        <Breadcrumbs
          className="mt-4 mb-2"
          breadcrumbs={[
            { title: 'Trang chủ', path: '/' },
            { title: 'Góc sức khỏe', path: '/bai-viet' },
            { title: event?.name },
          ]}
        ></Breadcrumbs>
      </div>

      {event?.imageUrl && (
        <div className="mb-6">
          <Divider className="m-0" />
          <div className="relative h-[400px]">
            <ImageWithFallback
              src={event?.imageUrl || ''}
              layout="fill"
              objectFit="contain"
            ></ImageWithFallback>
          </div>
          <Divider className="m-0" />
        </div>
      )}

      <div
        className={`grid grid-cols-1 gap-4 px-4 pb-4 ${'md:grid-cols-[300px_minmax(200px,_1fr)]'} lg:container lg:px-0`}
      >
        {/* {!isEventArticle && (
          <>
            <div className="md:hidden">
              <MainInfoMenuButton mainInfo={mainInfoFooter} />
            </div>
            <div className="hidden h-fit py-2 md:block">
              <MainInfoMenu mainInfo={mainInfoFooter} />
            </div>
          </>
        )} */}
        <div className="">
          <div className="mb-6">
            <Typography.Title
              level={1}
              className="m-0 mb-2 text-2xl font-medium md:text-4xl"
            >
              {event?.name}
            </Typography.Title>
            <Typography.Text className="m-0 mb-2 block text-xl text-gray-600">
              {event?.summary}
            </Typography.Text>
            <Typography.Text className="text-sm text-gray-500">
              <Clock size={16} className=" align-text-bottom" /> Ngày đăng:{' '}
              {TimeUtils.formatDate(event?.eventDate, { noTime: true })}
            </Typography.Text>
          </div>

          {/* <AppDangerouslySetInnerHTML
            className={`w-full ${
              isEventArticle
                ? ''
                : 'overflow-y-auto rounded-lg border border-gray-500 md:max-h-[80vh] md:border-solid md:p-4'
            }`}
            dangerouslySetInnerHTML={{
              __html: event.description || '',
            }}
          ></AppDangerouslySetInnerHTML> */}

          {groupInfo?.key &&
            NEXT_PUBLIC_GROUP_INFO_KEYS.includes(groupInfo?.key) &&
            (otherEvents?.length || 0) > 0 && (
              <div className="mb-8 grid grid-cols-1">
                <div className=" lg:container lg:pl-0">
                  <Typography.Title
                    level={3}
                    className="mb-4 mt-6 inline-block uppercase lg:mt-12"
                  >
                    Các tin tức liên quan
                  </Typography.Title>{' '}
                </div>

                <div className="lg:container">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
                    {otherEvents?.map((event, index) => (
                      <EventItem
                        event={event}
                        key={index}
                        groupInfo={groupInfo}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default EventPage;
