import IMAGES from '@configs/assests/images';
import { HOST } from '@configs/env';
import Link from 'next/link';

const listUtils = [
  {
    title: 'Cần mua thuốc',
    link: 'https://zalo.me/phuocthienpharmacy',
    newTab: true,
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

export const HomeUtils = () => {
  return (
    <div className="relative grid w-full grid-cols-12 gap-3 p-4 pt-0 md:mt-0 md:px-0">
      <div className="col-span-3 hidden md:col-span-2 md:block"></div>
      {listUtils.map((el, idx) => (
        <div className="col-span-3 md:col-span-2" key={`${el.title}#${idx}`}>
          <Link href={el.link} target={el.newTab ? '_blank' : ''}>
            <a target={el.newTab ? '_blank' : ''}>
              <div className="flex h-full cursor-pointer flex-col items-center gap-2 rounded-lg bg-white py-[10px] px-2 text-center shadow-sm md:flex-row md:gap-2 md:py-[16px] md:px-[18px]">
                <div className="flex h-10 w-10 shrink-0 justify-center md:h-12 md:w-12">
                  <img src={el.img} alt="bill" />
                </div>

                <div className="">
                  <p className="text-md m-0 text-ellipsis p-0 font-semibold md:text-left">
                    {el.title}
                  </p>
                </div>
              </div>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
};
