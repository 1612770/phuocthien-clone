import { Typography } from 'antd';
import FocusContentModel from '@configs/models/focus-content.model';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import LinkWrapper from '@components/templates/LinkWrapper';

function FocusContentSection({ 
  focusContent,
  isProductPage,
}: {
  focusContent: FocusContentModel[];
  isProductPage?: boolean;
}) {
  return (
    <div
      className={`bg-primary-background md:py-4 ${
        isProductPage ? 'hidden md:block' : ''
      }`}
    >
      <div className="p-1 md:p-2 lg:container lg:p-0">
        <div
          className={`grid grid-cols-1 gap-2 md:my-2  md:grid-cols-2 md:gap-4 ${
            isProductPage ? 'ml-2 lg:grid-rows-2' : 'lg:grid-cols-4'
          } `}
        >
          {focusContent?.map((focus, index) => (
            <LinkWrapper href={focus.url} key={index}>
              <div className="flex items-center">
                <div className="relative aspect-[1/1] h-[40px]">
                  <ImageWithFallback
                    layout="fill"
                    unoptimized
                    alt={focus.name}
                    src={focus.imageUrl || ''}
                  />
                </div>

                <div className="ml-2 flex h-full  flex-col items-center rounded-lg">
                  <div className="flex flex-col">
                    <Typography.Text className="mt-2 text-left text-sm font-medium text-primary md:text-center ">
                      {focus.name}
                    </Typography.Text>
                    <Typography.Text className="text-left text-xs md:text-center">
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
