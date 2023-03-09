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
    <div className=" bg-primary-background py-4">
      <div className=" p-2 lg:container lg:p-0">
        <Typography.Title
          level={2}
          className="mb-4 mt-4 text-center text-2xl font-medium uppercase lg:hidden lg:text-left"
        >
          Mua thuốc dễ dàng tại Phước Thiện
        </Typography.Title>

        <div className="my-4 grid grid-cols-1 gap-2  md:grid-cols-2 md:gap-4 lg:grid-cols-4 ">
          {focusContent?.map((focus, index) => (
            <LinkWrapper href={focus.url} key={index}>
              <div className="flex h-full flex-col items-center rounded-lg ">
                <div className="relative mt-3 h-[40px] w-[40px] min-w-[40px]">
                  <ImageWithFallback
                    layout="fill"
                    src={focus.imageUrl || ''}
                    getMockImage={() => ImageUtils.getFocusMockUrl()}
                  ></ImageWithFallback>
                </div>

                <div className="ml-2 flex flex-col">
                  <Typography.Text className="mt-2 text-center text-lg font-medium text-primary ">
                    {focus.name}
                  </Typography.Text>

                  <Typography.Text className=" px-4 text-center ">
                    {focus.description}
                  </Typography.Text>
                </div>
              </div>
            </LinkWrapper>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FocusContentSection;
