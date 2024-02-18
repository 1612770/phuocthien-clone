import { Button } from 'antd';
import LinkWrapper from '@components/templates/LinkWrapper';
import EventItem from '@modules/event/EventItem';
import GroupInfoModel from '@configs/models/GroupInfoModel';

function EventList({ group }: { group: GroupInfoModel }) {
  return (
    <div className="">
      <div className="grid-row-1 grid grid-flow-row gap-4 lg:grid-flow-col lg:grid-rows-3">
        {group.eventInfos?.map((event, index) => (
          <div
            key={index}
            className={`${
              index == 0 ? 'row-span-1 lg:row-span-3' : 'lg:col-span-1'
            }`}
          >
            <EventItem event={event} groupInfo={group} indexBlog={index} />
          </div>
        ))}
      </div>

      {!!group.eventInfos?.length && (
        <div className="flex justify-center">
          <LinkWrapper href={`/${group.seoUrl}`}>
            <Button type="primary" className="mt-4 inline-block" ghost>
              Xem tất cả các bài viết
            </Button>
          </LinkWrapper>
        </div>
      )}
    </div>
  );
}

export default EventList;
