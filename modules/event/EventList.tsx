import { Button } from 'antd';
import LinkWrapper from '@components/templates/LinkWrapper';
import EventItem from '@modules/event/EventItem';
import GroupInfoModel from '@configs/models/GroupInfoModel';

function EventList({ group }: { group: GroupInfoModel }) {
  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-4">
        {group.eventInfos?.map((event, index) => (
          <EventItem event={event} groupInfo={group} key={index} />
        ))}
      </div>

      {!!group.eventInfos?.length && (
        <div className="flex justify-center">
          <LinkWrapper href={`/tin-tuc/${group.seoUrl}`}>
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
