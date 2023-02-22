import { Typography } from 'antd';
import FocusContentModel from '@configs/models/focus-content.model';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import LinkWrapper from '@components/templates/LinkWrapper';
import ImageUtils from '@libs/utils/image.utils';

function FocusContentSection({
  focusContent,
}: {
  focusContent: FocusContentModel[];
}) {
  return (
    <div className="mt-[32px] p-2 lg:container lg:mt-[40px] lg:p-0">
      <Typography.Title level={2} className="text-center font-medium ">
        Mua thuốc dễ dàng tại Phước Thiện
      </Typography.Title>

      <div className="mt-4 grid grid-cols-1 gap-2  md:grid-cols-2 md:gap-4 lg:grid-cols-4 ">
        {focusContent?.map((focus, index) => (
          <LinkWrapper href={focus.url} key={index}>
            <div className="flex h-full flex-col items-center rounded-lg border border-solid border-gray-300 p-4">
              <div className="relative h-[40px] w-[40px] lg:h-[80px] lg:w-[80px]">
                <ImageWithFallback
                  width={80}
                  height={80}
                  layout="fill"
                  src={focus.imageUrl || ''}
                  getMockImage={() => ImageUtils.getFocusMockUrl()}
                ></ImageWithFallback>
              </div>

              <Typography.Text className="mt-2 text-center text-lg font-medium text-primary">
                {focus.name}
              </Typography.Text>

              <Typography.Text className="text-center">
                {focus.description}
              </Typography.Text>
            </div>
          </LinkWrapper>
        ))}
      </div>
    </div>
  );
}

export default FocusContentSection;
