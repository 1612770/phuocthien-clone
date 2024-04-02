import AppDangerouslySetInnerHTML from '@components/AppDangerouslySetInnerHTML';
import LinkWrapper from '@components/templates/LinkWrapper';
import { configPage } from '@configs/constants/generalPage';
import { Article } from '@configs/models/cms.model';
import { Grid, Typography } from 'antd';
import { flatten } from 'lodash';
const { useBreakpoint } = Grid;
export const GeneralPageDetail = ({ page }: { page: Article }) => {
  const breakp = useBreakpoint();

  return (
    <div
      className={`${breakp.lg ? 'flex' : ''} px-4 pb-4 lg:container lg:px-0`}
    >
      {breakp.lg && (
        <div className="mt-5 max-w-[300px]">
          <div className="sticky top-10">
            <div className="pb-4 text-lg font-bold">Nội dung chính</div>
            {configPage.map((el, idx) => (
              <div key={`${el.title}-${idx}`}>
                <div className="text-md pb-2 font-bold text-primary">
                  {el.title}
                </div>
                <div>
                  {el.children.map((dataPage) => (
                    <div
                      key={`${dataPage.link}`}
                      className="pl-5 pb-1 hover:text-primary"
                    >
                      <LinkWrapper
                        className="hover:text-primary"
                        href={dataPage.link}
                      >
                        {dataPage.title}
                      </LinkWrapper>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="ml-3 mt-5 w-full max-w-[900px] bg-white p-4">
        <div className="">
          <Typography.Title
            level={4}
            className="mb-0 whitespace-nowrap  lg:mb-2"
          >
            {page.title}
          </Typography.Title>
          <p>
            <i>{page?.shortDesc || ''}</i>
          </p>
          <AppDangerouslySetInnerHTML
            className={`ck-content w-full `}
            dangerouslySetInnerHTML={{
              __html: page.content || '',
            }}
          ></AppDangerouslySetInnerHTML>
        </div>
      </div>
      {!breakp.lg && (
        <div className="ml-3 mt-5 pb-3">
          <Typography.Title level={3} className=" text-primary">
            Các trang liên quan
          </Typography.Title>
          <div className="grid grid-flow-row grid-cols-2">
            {flatten(configPage.map((_el) => _el.children)).map((el, idx) => (
              <div key={`${el.title}-${idx}`} className="pb-1">
                <LinkWrapper className="hover:text-primary" href={el.link}>
                  {el.title}
                </LinkWrapper>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
