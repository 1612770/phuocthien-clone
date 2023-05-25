import LinkWrapper from '@components/templates/LinkWrapper';
import MainInfoModel from '@configs/models/main-info.model';
import { useRouter } from 'next/router';
import React from 'react';

function MainInfoMenu({
  mainInfo,
  onItemClick,
}: {
  mainInfo: MainInfoModel[];
  onItemClick?: () => void;
}) {
  const router = useRouter();

  const {
    query: { groupInfoSlugKey, eventSlugKey },
  } = router;

  const groupInfoSeoUrl = groupInfoSlugKey as string;
  const eventInfoSeoUrl = eventSlugKey as string;

  return (
    <div>
      <ul className="block list-none p-0">
        {mainInfo.map((info, index) => (
          <li key={index}>
            {/* hide level 1 */}
            {/* {info.name} */}

            <ul className="block list-none p-0">
              {info.groupInfo?.map((group, index) => {
                // hide if every event in group is not match search string

                return (
                  <div className="mb-1" key={index}>
                    <b className="my-2 inline-block font-semibold">
                      {group.name}
                    </b>
                    {group.eventInfos?.map((event, index) => {
                      // hide if event is not match search string
                      const isActive =
                        groupInfoSeoUrl === group.seoUrl &&
                        eventInfoSeoUrl === event.seoUrl;

                      return (
                        <LinkWrapper
                          className=""
                          key={index}
                          href={`/tin-tuc/${group.seoUrl}/${event.seoUrl}`}
                        >
                          <span
                            onClick={onItemClick}
                            className={`my-1 ml-2 block rounded-lg border border-solid p-2 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white ${
                              isActive
                                ? 'border-primary bg-primary text-white'
                                : 'border-white bg-white text-black'
                            }`}
                          >
                            {event.name}
                          </span>
                        </LinkWrapper>
                      );
                    })}
                  </div>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MainInfoMenu;
