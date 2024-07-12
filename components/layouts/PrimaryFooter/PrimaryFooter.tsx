import { Divider, Space, Typography } from 'antd';
import Link from 'next/link';
import IMAGES from 'configs/assests/images';
import { useAppData } from '@providers/AppDataProvider';
import { useWatchCacheProduct } from '@libs/utils/hooks/useWatchCacheProduct';
import ProductList from '@components/templates/ProductList';

import { GlobalOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { configPage } from '@configs/constants/generalPage';
import { useRouter } from 'next/router';
import FocusContentSection from '@modules/homepage/FocusContentSection';

function PrimaryFooter() {
  const { focusContent } = useAppData();
  const router = useRouter();
  const [products] = useWatchCacheProduct();

  return (
    <>
      {!!products.length && (
        <div className="py-2 px-4 md:py-8 lg:container lg:px-0">
          <Typography.Title
            level={3}
            className={
              'm-0 text-center font-medium uppercase md:my-4 lg:text-left'
            }
          >
            Sản phẩm vừa xem
          </Typography.Title>
          <ProductList products={products} forceSlide />
        </div>
      )}

      <FocusContentSection focusContent={focusContent || []} />

      <footer className="bg-white">
        <div className="m-auto justify-center py-8 px-4 lg:container lg:px-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className=" text-white" onClick={() => router.push('/')}>
              <div>
                <img
                  src={IMAGES.logo}
                  alt="Nhà thuốc Phước Thiện"
                  className="mr-2 h-8"
                  style={{ minHeight: 60, objectFit: 'contain' }}
                  width={242}
                  height={60}
                />
              </div>

              <div className="mt-4">
                <Typography.Text className=" font-semibold uppercase text-primary">
                  Tải ứng dụng
                </Typography.Text>
                <div className="mt-2 flex gap-1 lg:gap-2">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.esuspharmacy.phuocthien&hl=en"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Google Play Store"
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
                    aria-label="App Store"
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
            </div>

            {configPage.map((el, idx) => {
              return (
                <div key={`${el}-${idx}`} className="w-full">
                  <Typography.Text className="my-0.5 mb-1 block font-semibold uppercase text-primary">
                    {el?.title || ''}
                  </Typography.Text>
                  {el.children.length > 0 ? (
                    el.children.map((page, idx) => (
                      <Link href={page.link} passHref key={`${page}-${idx}`}>
                        <a className="flex min-h-[25px] md:min-h-[32px]">
                          <Space className="my-0.5 w-full">
                            <Typography.Text className="cursor-pointer text-primary">
                              {page.title}
                            </Typography.Text>
                          </Space>
                        </a>
                      </Link>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}

            <div className="w-full">
              <Typography.Text className="my-0.5 mb-1 block font-semibold uppercase text-primary">
                Thông tin liên hệ
              </Typography.Text>
              <Space className="my-0.5 w-full">
                <GlobalOutlined className="text-primary" size={16} />
                <Typography.Text className="">
                  Tầng 2, 170 Ông Ích Khiêm, Phường Tam Thuận, Quận Thanh Khê,
                  Thành Phố Đà Nẵng, Việt Nam
                </Typography.Text>
              </Space>
              <Space className="my-0.5 w-full">
                <PhoneOutlined className="text-primary" size={16} />
                <Typography.Text className="">1800 599 964</Typography.Text>
              </Space>
              <Space className="my-0.5 w-full">
                <MailOutlined className="text-primary" size={16} />
                <Typography.Text className="">
                  lienhe@nhathuocphuocthien.com
                </Typography.Text>
              </Space>
            </div>
          </div>

          <Divider className="bg-primary" />
          <div>
            <Typography className="text-center text-xs text-primary">
              © 2023 CÔNG TY TNHH PHƯỚC THIỆN 3T. Số ĐKKD: 0402173059 ngày cấp
              25/11/2022 Địa chỉ: Tầng 2, 170 Ông Ích Khiêm, Phường Tam Thuận,
              Quận Thanh Khê, Thành Phố Đà Nẵng, Việt Nam.
              <br />
              <br /> Điện thoại: (0236) 3745.488 - Email:
              lienhe@nhathuocphuocthien.com. Người quản lý nội dung: Đoàn Phước
              Lân
            </Typography>
          </div>
          <div className="flex items-center justify-center md:mt-4 ">
            <a
              href="http://online.gov.vn/Home/WebDetails/106523"
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
