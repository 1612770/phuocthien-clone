import MainInfoModel from '@configs/models/main-info.model';
import { Empty, Tabs, Typography } from 'antd';
import EventList from '../event/EventList';

function MainInfoSection({ mainInfo }: { mainInfo?: MainInfoModel }) {
  if (!mainInfo) return null;

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
          items={(mainInfo.groupInfo || []).map((group, index) => {
            return {
              key: String(index),
              label: group.name,
              children: (
                <>
                  <EventList group={group} />

                  {!group.eventInfos?.length && (
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
