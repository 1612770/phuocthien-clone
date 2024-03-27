import LinkWrapper from '@components/templates/LinkWrapper';
import EVENTS_LOAD_PER_TIME from '@configs/constants/events-load-per-time';
import GroupInfoModel from '@configs/models/GroupInfoModel';
import EventModel from '@configs/models/event.model';
import { GeneralClient } from '@libs/client/General';
import EventItem from '@modules/event/EventItem';
import { useAppMessage } from '@providers/AppMessageProvider';
import { Breadcrumb, Typography, Button, Empty } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import { useState } from 'react';

const GroupInfoPage: NextPageWithLayout<{
  groupInfo?: GroupInfoModel;
}> = ({ groupInfo }) => {
  const [eventInfos, setEventInfos] = useState<EventModel[]>(
    groupInfo?.eventInfos || []
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [allowLoadMore, setAllowLoadMore] = useState(
    (groupInfo?.eventInfos?.length || 0) >= EVENTS_LOAD_PER_TIME
  );

  const { toastError } = useAppMessage();

  const loadMore = async () => {
    try {
      const generalClient = new GeneralClient(null, {});

      setLoadingMore(true);
      const groupInfos = await generalClient.getGroupInfos({
        page: Math.floor(+(eventInfos?.length || 0) / EVENTS_LOAD_PER_TIME) + 1,
        pageSize: EVENTS_LOAD_PER_TIME,
        groupSeoUrl: groupInfo?.seoUrl,
      });

      if (groupInfos.data?.[0]) {
        setEventInfos([
          ...eventInfos,
          ...(groupInfos.data?.[0].eventInfos || []),
        ]);
        setAllowLoadMore(
          (groupInfos.data?.[0].eventInfos?.length || 0) >= EVENTS_LOAD_PER_TIME
        );
      }
    } catch (error) {
      toastError({ data: error });
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <>
      <div className="px-4 pb-4 lg:container lg:px-0">
        <Breadcrumb className="mt-4 mb-2">
          <Breadcrumb.Item>
            <LinkWrapper href="/">Trang chủ</LinkWrapper>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <LinkWrapper href="/bai-viet">Góc sức khỏe</LinkWrapper>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{groupInfo?.name}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="px-4 pb-4 lg:container lg:px-0">
        <div className="mb-2">
          <Typography.Title
            level={1}
            className="m-0 mb-2 text-2xl font-medium md:text-4xl"
          >
            {groupInfo?.name}
          </Typography.Title>
        </div>

        <div className="mb-6 lg:container">
          {(eventInfos?.length || 0) > 0 && (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:gap-6 xl:grid-cols-2">
              {eventInfos?.map((event, index) => (
                <EventItem event={event} key={index} groupInfo={groupInfo} />
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-center">
            {allowLoadMore && (
              <Button
                type="primary"
                className={''}
                ghost
                onClick={loadMore}
                loading={loadingMore}
              >
                Xem thêm
              </Button>
            )}
          </div>

          {!eventInfos?.length && (
            <Empty
              className="mt-4 mb-8"
              description={<Typography>Không tìm thấy bài viết nào</Typography>}
            ></Empty>
          )}
        </div>
      </div>
    </>
  );
};

export default GroupInfoPage;
