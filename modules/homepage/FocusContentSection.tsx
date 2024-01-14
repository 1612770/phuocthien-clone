import { Typography } from 'antd';
import FocusContentModel from '@configs/models/focus-content.model';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import LinkWrapper from '@components/templates/LinkWrapper';
import ImageUtils from '@libs/utils/image.utils';

function FocusContentSection({
  focusContent,
  isProductPage,
}: {
  focusContent: FocusContentModel[];
  isProductPage?: boolean;
}) {
  return (
    <div className=" bg-primary-background py-4">
      <div className=" p-2 lg:container lg:p-0">
        <div
          className={`my-2 grid grid-cols-1 gap-2  md:grid-cols-2 md:gap-4 ${
            isProductPage ? 'ml-2 lg:grid-rows-2' : 'lg:grid-cols-4'
          } `}
        >
          {focusContent?.map((focus, index) => (
            <LinkWrapper href={focus.url} key={index}>
              <div className="flex items-center">
                <div className="relative h-[40px] w-[40px] min-w-[40px]">
                  <ImageWithFallback
                    layout="fill"
                    alt={focus.name}
                    src={focus.imageUrl || ''}
                    getMockImage={() => ImageUtils.getFocusMockUrl()}
                  ></ImageWithFallback>
                </div>
                <div className="flex h-full flex-col items-center rounded-lg ">
                  <div className=" flex flex-col">
                    <Typography.Text className="mt-2 text-center text-sm font-medium text-primary ">
                      {focus.name}
                    </Typography.Text>

                    <Typography.Text className=" px-4 text-center text-xs">
                      {focus.description}
                    </Typography.Text>
                  </div>
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
