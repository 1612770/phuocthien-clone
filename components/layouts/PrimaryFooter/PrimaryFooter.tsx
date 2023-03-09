import { Divider, Space, Typography } from 'antd';
import Link from 'next/link';
import { Facebook, Mail, MapPin, Phone, Twitter, Youtube } from 'react-feather';
import IMAGES from 'configs/assests/images';
import { useAppData } from '@providers/AppDataProvider';
import FocusContentSection from '@modules/homepage/FocusContentSection';
import { useRouter } from 'next/router';
import LinkWrapper from '@components/templates/LinkWrapper';

function PrimaryFooter() {
  const { focusContent, mainInfo } = useAppData();
  const router = useRouter();

  return (
    <>
      <div className={`block ${router.asPath === '/' ? 'lg:hidden' : ''}`}>
        <FocusContentSection focusContent={focusContent || []} />
      </div>
      <footer className="bg-primary px-4">
        <div className="py-8 lg:container">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mainInfo.map((info, index) =>
              typeof info?.visible === 'boolean' && !info?.visible ? null : (
                <div className="w-full" key={index}>
                  <Typography.Text className="my-0.5 mb-2 block font-semibold uppercase text-white">
                    {info.name}
                  </Typography.Text>
                  {info.groupInfo?.map((groupInfo, index) =>
                    typeof groupInfo?.visible === 'boolean' &&
                    !groupInfo?.visible ? null : (
                      <Space className="my-0.5 w-full" key={index}>
                        <LinkWrapper href={groupInfo.eventUrl}>
                          <Typography.Text className="text-white">
                            {groupInfo.name}
                          </Typography.Text>
                        </LinkWrapper>
                      </Space>
                    )
                  )}
                </div>
              )
            )}

            <div className="w-full">
              <Typography.Text className="my-0.5 mb-2 block font-semibold uppercase text-white">
                Thông tin liên hệ
              </Typography.Text>
              <Space className="my-0.5 w-full">
                <MapPin className="text-white" size={16} />
                <Typography.Text className="text-white">
                  170 Ông Ích Khiêm - Thành phố Đà Nẵng
                </Typography.Text>
              </Space>
              <Space className="my-0.5 w-full">
                <Phone className="text-white" size={16} />
                <Typography.Text className="text-white">
                  1800599964
                </Typography.Text>
              </Space>
              <Space className="my-0.5 w-full">
                <Mail className="text-white" size={16} />
                <Typography.Text className="text-white">
                  phuocthiendn@yahoo.com
                </Typography.Text>
              </Space>
            </div>
          </div>
          <div className="my-3 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            <div>
              <img src={IMAGES.logo} alt="logo" className=" block h-10" />
              <Space className="mt-2">
                <Link
                  href="https://www.facebook.com/PhuocThienPharmacy/"
                  passHref
                >
                  <a target={'_blank'}>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-dark">
                      <Facebook color="white" size={16} />
                    </span>
                  </a>
                </Link>
                <Link href="/">
                  <a>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-dark">
                      <Youtube color="white" size={16} />
                    </span>
                  </a>
                </Link>
                <Link href="/">
                  <a>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-dark">
                      <Twitter color="white" size={16} />
                    </span>
                  </a>
                </Link>
              </Space>
            </div>

            <div>
              <Typography.Text className=" uppercase text-white">
                Tải về ứng dụng Phước Thiện
              </Typography.Text>
              <div className="mt-2 flex gap-2 lg:gap-4">
                <a href="https://play.google.com/store/apps/details?id=com.esuspharmacy.phuocthien&hl=en">
                  <img src="/chplay.png" alt="" className="w-[120px]" />
                </a>
                <a href="https://apps.apple.com/us/app/nh%C3%A0-thu%E1%BB%91c-ph%C6%B0%E1%BB%9Bc-thi%E1%BB%87n/id1662328703">
                  <img src="/appstore.png" alt="" className="w-[120px]" />
                </a>
              </div>
            </div>
          </div>
          <Divider className="bg-white" />
          <div>
            <Typography className="text-center text-xs text-white">
              © 2020 HỆ THỐNG NHÀ THUỐC PHƯỚC THIỆN. Giấy phép kinh doanh:
              32A8031215 - được cấp ngày: 16/04/2020. Địa chỉ: 370 Trưng Nữ
              Vương, Quận Hải Châu, TP Đà Nẵng. Điện thoại: (0236) 3827.772 -
              Fax: (0236) 3827.772. Email: phuocthien.pharmacy@gmail.com. Người
              quản lý nội dung: Ds Ngô Thị Huyền Trâm. All rights reserved.
            </Typography>
            <Typography className="text-center text-xs text-white">
              (Phiên bản chạy thử)
            </Typography>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <img
              src={IMAGES.bocongthuongDathongbao}
              alt="bocongthuong-dathongbao"
              className="h-10"
            />
            <img
              src={IMAGES.dmcaProtected}
              alt="dmca-protected"
              className="h-6"
            />
          </div>
        </div>
      </footer>
    </>
  );
}

export default PrimaryFooter;
