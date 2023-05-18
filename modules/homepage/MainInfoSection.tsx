import MainInfoModel from '@configs/models/main-info.model';
import { Empty, Tabs, Typography } from 'antd';
import EventList from '../event/EventList';
import { NEXT_PUBLIC_GROUP_INFO_KEYS } from '@configs/env';

function MainInfoSection({ mainInfo }: { mainInfo?: MainInfoModel }) {
  if (!mainInfo) return null;

  const allowedGroupInfoKeys = (mainInfo.groupInfo || []).filter(
    (groupInfo) =>
      groupInfo.key && NEXT_PUBLIC_GROUP_INFO_KEYS.includes(groupInfo.key)
  );

  return (
    <div className={'my-2 py-4'}>
      <div className={'px-4 lg:container'}>
        <div className="mb-2 flex items-center justify-center lg:mb-2 lg:justify-between">
          <Typography.Title
            level={3}
            className={
              'm-0 my-4 text-center font-medium uppercase lg:text-left'
            }
          >
            {mainInfo?.name}
          </Typography.Title>
        </div>

        <Tabs
          type="card"
          items={allowedGroupInfoKeys.map((groupInfo, index) => {
            return {
              key: String(index),
              label: groupInfo.name,
              children: (
                <>
                  <EventList group={groupInfo} />

                  {!groupInfo.eventInfos?.length && (
                    <div className="w-full py-8">
                      <Empty
                        description={
                          <Typography>Chưa có sự kiện nào</Typography>
                        }
                      ></Empty>
                    </div>
                  )}
                </>
              ),
            };
          })}
        />
      </div>
    </div>
  );
}

export default MainInfoSection;
