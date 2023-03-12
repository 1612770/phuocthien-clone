import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Breadcrumb, Divider, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import { GetServerSidePropsContext } from 'next';
import UrlUtils from '@libs/utils/url.utils';
import React from 'react';
import EventModel from '@configs/models/EventModel';
import LinkWrapper from '@components/templates/LinkWrapper';
import { GeneralClient } from '@libs/client/General';
import EventItem from '@modules/event/EventItem';
import TimeUtils from '@libs/utils/time.utils';
import { Clock } from 'react-feather';
import ImageWithFallback from '@components/templates/ImageWithFallback';

const EventPage: NextPageWithLayout<{
  event?: EventModel;
  otherEvents?: EventModel[];
}> = ({ event, otherEvents }) => {
  if (!event) return null;
  if (typeof event?.visible === 'boolean' && !event?.visible) return null;

  return (
    <>
      <div className="px-4 lg:container lg:px-0">
        <Breadcrumb className="mt-4 mb-2">
          <Breadcrumb.Item>
            <LinkWrapper href="/">Trang chủ</LinkWrapper>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <LinkWrapper href="/tin-tuc">Góc tin tức</LinkWrapper>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{event?.name}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

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

      <div className="px-4 pb-4 lg:container lg:px-0">
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

        <div
          className="w-full"
          dangerouslySetInnerHTML={{
            __html: event.description || '',
          }}
        ></div>

        {(otherEvents?.length || 0) > 0 && (
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
                  <EventItem event={event} key={index} />
                ))}
              </div>
            </div>
          </div>
        )}
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
    };
  } = {
    props: {
      otherEvents: [],
    },
  };

  const currentEventKey = UrlUtils.getKeyFromParam(
    context.params?.eventSlugKey as string
  );
  const generalClient = new GeneralClient(context, {});

  try {
    const event = await generalClient.getEvent({
      keyEvent: currentEventKey,
    });

    if (event.data) {
      serverSideProps.props.event = event.data;

      if (event.data?.keyGroup) {
        const otherEvents = await generalClient.getGroupInfos({
          page: 1,
          pageSize: 5,
          keyGroup: event.data?.keyGroup,
        });

        if (otherEvents.data) {
          const otherEventList = (otherEvents.data || [])
            .reduce((events, currentGroup) => {
              return [
                ...events,
                ...(currentGroup.eventInfos || []).filter(
                  (event) => event.key !== currentEventKey
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
