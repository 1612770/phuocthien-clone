import { Button, Typography } from 'antd';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import TimeUtils from '@libs/utils/time.utils';
import LinkWrapper from '@components/templates/LinkWrapper';
import UrlUtils from '@libs/utils/url.utils';
import EventItem from '@modules/event/EventItem';
import GroupInfoModel from '@configs/models/GroupInfoModel';

function EventList({ group }: { group: GroupInfoModel }) {
  return (
    <div>
      {group.eventInfos?.[0] && (
        <LinkWrapper
          href={`/tin-tuc/bai-viet/${UrlUtils.generateSlug(
            group.eventInfos?.[0].name,
            group.eventInfos?.[0].key
          )}`}
        >
          <div className="group hidden lg:block">
            <div className="relative mb-6 h-[280px] overflow-hidden rounded-lg border border-solid border-gray-100  ">
              <ImageWithFallback
                src={group.eventInfos?.[0].imageUrl || ''}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              ></ImageWithFallback>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 pt-12">
                <div className="flex flex-col">
                  <Typography.Text
                    className="block text-left text-xl font-medium text-white"
                    ellipsis
                  >
                    {group.eventInfos?.[0].name}
                  </Typography.Text>
                  <Typography.Text
                    className="text-base text-white opacity-80"
                    ellipsis
                  >
                    {group.eventInfos[0].summary}
                  </Typography.Text>
                  <div className="mt-2 flex items-center">
                    <Typography.Text className="text-xs text-gray-300">
                      {TimeUtils.formatDate(group.eventInfos[0].eventDate, {
                        noTime: true,
                      })}
                    </Typography.Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LinkWrapper>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        {group.eventInfos?.map((event, index) => (
          <EventItem
            event={event}
            key={index}
            className={`${index === 0 ? 'lg:hidden' : ''}`}
          />
        ))}
      </div>

      {!!group.eventInfos?.length && (
        <div className="flex justify-center">
          <LinkWrapper
            href={`/tin-tuc/danh-muc/${UrlUtils.generateSlug(
              group.name,
              group.key
            )}`}
          >
            <Button type="primary" className="mt-4 inline-block" ghost>
              Xem tất cả
            </Button>
          </LinkWrapper>
        </div>
      )}
    </div>
  );
}

export default EventList;
