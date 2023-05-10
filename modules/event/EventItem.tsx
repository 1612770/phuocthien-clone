import { Typography } from 'antd';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import TimeUtils from '@libs/utils/time.utils';
import LinkWrapper from '@components/templates/LinkWrapper';
import UrlUtils from '@libs/utils/url.utils';
import EventModel from '@configs/models/event.model';

function EventItem({
  event,
  className,
}: {
  className?: string;
  event?: EventModel;
}): JSX.Element {
  if (!event) return <></>;

  return (
    <LinkWrapper
      href={`/tin-tuc/bai-viet/${UrlUtils.generateSlug(event.name, event.key)}`}
      className={className}
    >
      <div className={`group flex gap-2 lg:gap-4`} title={event.name}>
        <div className=" relative h-[100px] w-[100px] min-w-[100px] overflow-hidden rounded-lg border border-solid border-gray-100 transition-transform duration-300 group-hover:scale-105">
          <ImageWithFallback
            src={event.imageUrl || ''}
            layout="fill"
            placeholder="blur"
            objectFit="cover"
          ></ImageWithFallback>
        </div>
        <div className="flex flex-col py-1">
          <div className="flex-1">
            <Typography.Text className="two-line-text font-medium group-hover:text-primary">
              {event.name}
            </Typography.Text>
            <Typography.Text className=" two-line-text  text-gray-700">
              {event.summary}
            </Typography.Text>
          </div>
          <div className="mt-1 flex items-center">
            <Typography.Text className="text-xs text-gray-500">
              {TimeUtils.formatDate(event.eventDate, {
                noTime: true,
              })}
            </Typography.Text>
          </div>
        </div>
      </div>
    </LinkWrapper>
  );
}

export default EventItem;
