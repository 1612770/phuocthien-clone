import IMAGES from '@configs/assests/images';
import { Typography } from 'antd';
import Image from 'next/image';

import Link from 'next/link';

const listUtils = [
  {
    title: 'Cần mua thuốc',
    link: '/gui-don-thuoc',
    newTab: false,
    img: IMAGES.drug,
  },
  {
    title: 'Tư vấn với dược sĩ',
    link: 'https://zalo.me/phuocthienpharmacy',
    newTab: true,
    img: IMAGES.doctor,
  },
  {
    title: 'Tìm nhà thuốc',
    link: `/nha-thuoc`,
    newTab: false,
    img: IMAGES.location,
  },
  {
    title: 'Đơn của tôi',
    link: '/lich-su-don-hang',
    newTab: false,
    img: IMAGES.bill,
  },
];

const HomeUtils = () => {
  return (
    <div className="relative mt-4 grid w-full grid-cols-12 gap-3 p-0 py-2 pt-0 md:mt-0 md:p-4 md:px-0">
      <div className="col-span-3 hidden md:col-span-2 md:block"></div>
      {listUtils.map((el, idx) => (
        <div className="col-span-3  md:col-span-2" key={`${el.title}#${idx}`}>
          <Link
            href={el.link}
            target={el.newTab ? '_blank' : ''}
            prefetch={false}
          >
            <a target={el.newTab ? '_blank' : ''}>
              <div className="flex h-full cursor-pointer flex-col items-center gap-2 rounded-lg border-solid border-white bg-white py-[10px] px-2 shadow-md hover:border-solid hover:border-primary md:flex-row md:gap-2 md:py-[16px] md:px-[18px]">
                <div className="relative flex h-6 w-6 shrink-0 justify-center md:h-8 md:w-8 lg:h-10 lg:w-10">
                  <Image
                    src={el.img}
                    alt={`${el.title}-${new Date().getTime()}`}
                    layout="fill"
                    unoptimized
                  />
                </div>

                <Typography.Text className="m-0	text-ellipsis p-0 text-center text-xs font-semibold text-neutral-800 md:text-base">
                  {el.title}
                </Typography.Text>
              </div>
            </a>
          </Link>
        </div>
      ))}
      <div className="col-span-3 hidden md:col-span-2 md:block"></div>
    </div>
  );
};
export default HomeUtils;
