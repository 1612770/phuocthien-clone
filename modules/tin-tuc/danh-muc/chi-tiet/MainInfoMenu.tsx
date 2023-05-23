import { SearchOutlined } from '@ant-design/icons';
import LinkWrapper from '@components/templates/LinkWrapper';
import MainInfoModel from '@configs/models/main-info.model';
import { convertStringToASCII } from '@libs/helpers';
import UrlUtils from '@libs/utils/url.utils';
import { Empty, Input, Typography } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const checkMatch = (name?: string, searchString?: string) =>
  convertStringToASCII((name || '').toLowerCase()).includes(
    convertStringToASCII((searchString || '').toLowerCase())
  );

function MainInfoMenu({
  mainInfo,
  onItemClick,
}: {
  mainInfo: MainInfoModel[];
  onItemClick?: () => void;
}) {
  const [searchString, setSearchString] = useState('');
  const router = useRouter();

  const {
    query: { groupInfoSlugKey, eventSlugKey },
  } = router;

  const groupInfoKey = UrlUtils.getKeyFromParam(groupInfoSlugKey as string);
  const eventInfoKey = UrlUtils.getKeyFromParam(eventSlugKey as string);

  const isSearchHasNoResult = mainInfo.every((info) =>
    info.groupInfo?.every((group) =>
      group.eventInfos?.every((event) => !checkMatch(event.name, searchString))
    )
  );

  return (
    <div>
      <Input
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        placeholder="Tìm kiếm"
        className="mb-2"
        suffix={<SearchOutlined />}
      />
      {!isSearchHasNoResult && (
        <ul className="block list-none p-0">
          {mainInfo.map((info, index) => (
            <li key={index}>
              {/* hide level 1 */}
              {/* {info.name} */}

              <ul className="block list-none p-0">
                {info.groupInfo?.map((group, index) => {
                  // hide if every event in group is not match search string
                  if (
                    group.eventInfos?.every(
                      (event) => !checkMatch(event.name, searchString)
                    )
                  ) {
                    return null;
                  }

                  return (
                    <div className="mb-1" key={index}>
                      <b className="my-2 inline-block font-semibold">
                        {group.name}
                      </b>
                      {group.eventInfos?.map((event, index) => {
                        // hide if event is not match search string
                        if (!checkMatch(event.name, searchString)) {
                          return null;
                        }

                        return (
                          <LinkWrapper
                            className=""
                            key={index}
                            href={`/tin-tuc/${UrlUtils.generateSlug(
                              group.name,
                              group.key
                            )}/${UrlUtils.generateSlug(event.name, event.key)}`}
                          >
                            <span
                              onClick={onItemClick}
                              className={`${
                                groupInfoKey === group.key &&
                                eventInfoKey === event.key
                                  ? 'bg-gray-100'
                                  : 'bg-white'
                              } my-1 ml-2 block rounded-lg p-2 transition-all duration-200 ease-in-out hover:bg-gray-100 hover:text-black`}
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
      )}

      {isSearchHasNoResult && (
        <Empty
          className="mt-4 mb-8"
          description={<Typography>Không tìm thấy bài viết nào</Typography>}
        ></Empty>
      )}
    </div>
  );
}

export default MainInfoMenu;
