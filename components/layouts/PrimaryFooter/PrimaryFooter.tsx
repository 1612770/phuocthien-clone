import { Divider, Space, Typography } from 'antd';
import Link from 'next/link';
import { Facebook, Mail, MapPin, Phone, Twitter, Youtube } from 'react-feather';
import IMAGES from 'configs/assests/images';
import { useAppData } from '@providers/AppDataProvider';
import FocusContentSection from '@modules/homepage/FocusContentSection';
import { useRouter } from 'next/router';

function PrimaryFooter() {
  const { focusContent } = useAppData();
  const router = useRouter();

  return (
    <>
      <div className={`block ${router.asPath === '/' ? 'lg:hidden' : ''}`}>
        <FocusContentSection focusContent={focusContent || []} />
      </div>
      <footer className="bg-primary px-4">
        <div className="py-8 lg:container">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <Link href="/" style={{ color: 'white' }}>
                <a className="flex items-center">
                  <img
                    src={IMAGES.logo}
                    alt="Nhà thuốc Phước Thiện"
                    className="mr-2 h-8 object-contain"
                    style={{ width: 42, height: 32 }}
                  />

                  <Space
                    direction="vertical"
                    size={0}
                    className="mr-4 w-[92px]"
                  >
                    <Typography.Text className="m-0 -mb-2 inline-block text-base text-white">
                      Nhà thuốc
                    </Typography.Text>
                    <Typography.Text
                      strong
                      className="whitespace-nowrap uppercase text-white"
                    >
                      Phước Thiện
                    </Typography.Text>
                  </Space>
                </a>
              </Link>
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
              <Typography.Text className=" font-semibold uppercase text-white">
                Tải ứng dụng
              </Typography.Text>
              <div className="mt-2 flex gap-1 lg:gap-2">
                <a
                  href="https://play.google.com/store/apps/details?id=com.esuspharmacy.phuocthien&hl=en"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/chplay.png"
                    alt=""
                    className="w-[120px]"
                    style={{ width: 120, height: 40 }}
                  />
                </a>
                <a
                  target="_blank"
                  href="https://apps.apple.com/us/app/nh%C3%A0-thu%E1%BB%91c-ph%C6%B0%E1%BB%9Bc-thi%E1%BB%87n/id1662328703"
                  rel="noreferrer"
                >
                  <img
                    src="/appstore.png"
                    alt=""
                    className="w-[120px]"
                    style={{ width: 120, height: 40 }}
                  />
                </a>
              </div>
            </div>
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

          <Divider className="bg-white" />
          <div>
            <Typography className="text-center text-xs text-white">
              © 2023 HỆ THỐNG NHÀ THUỐC PHƯỚC THIỆN. Giấy phép kinh doanh:
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
            <a
              href="http://online.gov.vn/(X(1)S(m3qt0ctfachyjjpv1g2sbk23))/Home/WebDetails/53823?AspxAutoDetectCookieSupport=1"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={IMAGES.bocongthuongDathongbao}
                alt="bocongthuong-dathongbao"
                className="h-10"
                style={{
                  height: 40,
                  width: 104,
                }}
              />
            </a>
            <img
              src={IMAGES.dmcaProtected}
              alt="dmca-protected"
              className="h-6"
              style={{
                height: 24,
                width: 128,
              }}
            />
          </div>
        </div>
      </footer>
    </>
  );
}

export default PrimaryFooter;
