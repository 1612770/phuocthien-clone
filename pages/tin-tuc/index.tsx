import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Breadcrumb, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import LinkWrapper from '@components/templates/LinkWrapper';
import { GeneralClient } from '@libs/client/General';
import EVENTS_LOAD_PER_TIME from '@configs/constants/events-load-per-time';
import MainInfoModel from '@configs/models/main-info.model';
import EventList from '@modules/event/EventList';

const EventPage: NextPageWithLayout<{
  mainInfos?: MainInfoModel[];
}> = ({ mainInfos }) => {
  return (
    <>
      <div className="px-4 pb-4 lg:container lg:px-0">
        <Breadcrumb className="mt-4 mb-2">
          <Breadcrumb.Item>
            <LinkWrapper href="/">Trang chủ</LinkWrapper>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Góc tin tức</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="px-4 pb-4 lg:container lg:px-0">
        {mainInfos?.map((mainInfo, index) => {
          if (!mainInfo.groupInfo?.length) return null;
          if (
            mainInfo.groupInfo.every(
              (groupInfo) => !groupInfo.eventInfos?.length
            )
          )
            return null;

          return (
            <div key={index}>
              <div className="mb-2">
                {mainInfo.groupInfo?.map(
                  (groupInfo, index) =>
                    !!groupInfo.eventInfos?.length && (
                      <div key={index}>
                        <Typography.Title
                          level={1}
                          className="m-0 mb-2 text-2xl font-medium md:text-4xl"
                        >
                          {groupInfo.name}
                        </Typography.Title>
                        <EventList group={groupInfo} />
                      </div>
                    )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: {
      mainInfos?: MainInfoModel[];
    };
  } = {
    props: {
      mainInfos: [],
    },
  };

  const generalClient = new GeneralClient(context, {});

  try {
    const mainInfos = await generalClient.getMainInfos({
      page: 1,
      pageSize: EVENTS_LOAD_PER_TIME,
    });

    if (mainInfos.data) {
      serverSideProps.props.mainInfos = mainInfos.data;
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
