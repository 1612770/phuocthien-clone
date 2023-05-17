import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { GeneralClient } from '@libs/client/General';
import EVENTS_LOAD_PER_TIME from '@configs/constants/events-load-per-time';
import MainInfoModel from '@configs/models/main-info.model';
import EventList from '@modules/event/EventList';
import Breadcrumbs from '@components/Breadcrumbs';
import { NEXT_PUBLIC_GROUP_INFO_KEYS } from '@configs/env';

const EventPage: NextPageWithLayout<{
  mainInfos?: MainInfoModel[];
}> = ({ mainInfos }) => {
  return (
    <>
      <div className="px-4 pb-4 lg:container lg:px-0">
        <Breadcrumbs
          className="pt-4 pb-2"
          breadcrumbs={[
            {
              title: 'Trang chủ',
              path: '/',
            },
            {
              title: 'Góc tin tức',
            },
          ]}
        ></Breadcrumbs>
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
              <div className="">
                {mainInfo.groupInfo?.map((groupInfo, index) => {
                  if (
                    !!groupInfo.eventInfos?.length &&
                    groupInfo.key &&
                    NEXT_PUBLIC_GROUP_INFO_KEYS.includes(groupInfo.key)
                  ) {
                    return (
                      <div key={index} className="mb-6">
                        <Typography.Title
                          level={1}
                          className="m-0 mb-2 text-2xl font-medium md:text-4xl"
                        >
                          {groupInfo.name}
                        </Typography.Title>
                        <EventList group={groupInfo} />
                      </div>
                    );
                  }
                  return null;
                })}
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
