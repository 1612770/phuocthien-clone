import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Divider, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import EventModel from '@configs/models/event.model';
import { GeneralClient } from '@libs/client/General';
import EventItem from '@modules/event/EventItem';
import TimeUtils from '@libs/utils/time.utils';
import { Clock } from 'react-feather';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import GroupInfoModel from '@configs/models/GroupInfoModel';
import { NEXT_PUBLIC_GROUP_INFO_KEYS } from '@configs/env';
import Breadcrumbs from '@components/Breadcrumbs';
import MainInfoMenu from '@modules/tin-tuc/danh-muc/chi-tiet/MainInfoMenu';
import { useAppData } from '@providers/AppDataProvider';
import AppDangerouslySetInnerHTML from '@components/AppDangerouslySetInnerHTML';
import MainInfoMenuButton from '@modules/tin-tuc/danh-muc/chi-tiet/MainInfoMenuButton';

const EventPage: NextPageWithLayout<{
  event?: EventModel;
  otherEvents?: EventModel[];
  groupInfo?: GroupInfoModel;
}> = ({ event, otherEvents, groupInfo }) => {
  const { mainInfoFooter } = useAppData();

  if (!event) return null;
  if (typeof event?.visible === 'boolean' && !event?.visible) return null;

  const allMainInfoFooterEventKeys = mainInfoFooter.reduce((acc, curr) => {
    const groupInfoEventKeys =
      curr.groupInfo?.reduce((acc, cur) => {
        const eventKeys =
          cur.eventInfos?.map((event) => event?.key || '') || [];

        return [...acc, ...eventKeys];
      }, [] as string[]) || [];

    return [...acc, ...groupInfoEventKeys];
  }, [] as string[]);

  const isEventArticle = !allMainInfoFooterEventKeys.includes(event?.key || '');

  return (
    <>
      <div className="px-4 lg:container lg:px-0">
        <Breadcrumbs
          className="mt-4 mb-2"
          breadcrumbs={[
            { title: 'Trang chủ', path: '/' },
            { title: 'Góc tin tức', path: '/tin-tuc' },
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
        className={`grid grid-cols-1 gap-4 px-4 pb-4 md:${
          isEventArticle
            ? 'grid-cols-1'
            : 'grid-cols-[300px_minmax(200px,_1fr)]'
        } lg:container lg:px-0`}
      >
        {!isEventArticle && (
          <>
            <div className="md:hidden">
              <MainInfoMenuButton mainInfo={mainInfoFooter} />
            </div>
            <div className="hidden h-fit py-2 md:block">
              <MainInfoMenu mainInfo={mainInfoFooter} />
            </div>
          </>
        )}
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

          <AppDangerouslySetInnerHTML
            className={`w-full ${
              isEventArticle
                ? ''
                : 'overflow-y-auto rounded-lg border border-gray-500 md:max-h-[80vh] md:border-solid md:p-4'
            }`}
            dangerouslySetInnerHTML={{
              __html: event.description || '',
            }}
          ></AppDangerouslySetInnerHTML>

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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: {
      event?: EventModel;
      otherEvents?: EventModel[];
      groupInfo?: GroupInfoModel;
    };
  } = {
    props: {
      otherEvents: [],
    },
  };

  const currentEventSeoUrl = context.params?.eventSlugKey as string;
  const currentGroupInfoSeoUrl = context.params?.groupInfoSlugKey as string;

  const generalClient = new GeneralClient(context, {});

  try {
    const event = await generalClient.getEvent({
      eventSeoUrl: currentEventSeoUrl,
    });

    if (event.data) {
      serverSideProps.props.event = event.data;

      if (event.data?.keyGroup) {
        const otherEvents = await generalClient.getGroupInfos({
          page: 1,
          pageSize: 5,
          groupSeoUrl: currentGroupInfoSeoUrl,
        });

        if (otherEvents.data) {
          serverSideProps.props.groupInfo = otherEvents.data[0];

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

          serverSideProps.props.otherEvents = otherEventList;
        }
      }
    }
  } catch (error) {
    console.error(error);
  }

  return serverSideProps;
};

export default EventPage;

EventPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
