import { Col, Divider, Row, Space, Typography } from 'antd';
import Link from 'next/link';
import { Facebook, Mail, MapPin, Phone, Twitter, Youtube } from 'react-feather';
import IMAGES from 'configs/assests/images';

type PrimaryFooterProps = {};

// eslint-disable-next-line no-empty-pattern
function PrimaryFooter({}: PrimaryFooterProps) {
  return (
    <>
      <footer className="mt-8 bg-primary px-4">
        <div className="container py-8">
          <Row>
            <Col xs={24} sm={12} lg={6} className="my-4">
              <Typography.Text className="my-0.5 mb-2 block font-semibold uppercase text-white">
                Nhà thuốc Phước Thiện
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
            </Col>

            <Col xs={24} sm={12} lg={6} className="my-4">
              <Typography.Text className="my-0.5 mb-2 block font-semibold uppercase text-white">
                Hỗ trợ khách hàng
              </Typography.Text>
              <Space className="my-0.5 w-full">
                <Link href="/">
                  <a>
                    <Typography.Text className="text-white">
                      Mua hàng online
                    </Typography.Text>
                  </a>
                </Link>
              </Space>
              <Space className="my-0.5 w-full">
                <Link href="/">
                  <a>
                    <Typography.Text className="text-white">
                      Chính sách vận chuyển và giao hàng
                    </Typography.Text>
                  </a>
                </Link>
              </Space>
              <Space className="my-0.5 w-full">
                <Link href="/">
                  <a>
                    <Typography.Text className="text-white">
                      Bảo mật thông tin khách hàng
                    </Typography.Text>
                  </a>
                </Link>
              </Space>
            </Col>

            <Col xs={24} sm={12} lg={6} className="my-4">
              <Typography.Text className="my-0.5 mb-2 block font-semibold uppercase text-white">
                Hệ thống thuốc
              </Typography.Text>
              <Space className="my-0.5 w-full">
                <Link href="/">
                  <a>
                    <Typography.Text className="text-white">
                      Hệ thống nhà thuốc
                    </Typography.Text>
                  </a>
                </Link>
              </Space>
              <Space className="my-0.5 w-full">
                <Link href="/">
                  <a>
                    <Typography.Text className="text-white">
                      Quy định chung
                    </Typography.Text>
                  </a>
                </Link>
              </Space>
              <Space className="my-0.5 w-full">
                <Link href="/">
                  <a>
                    <Typography.Text className="text-white">
                      Chính sách đổi trả
                    </Typography.Text>
                  </a>
                </Link>
              </Space>
              <Space className="my-0.5 w-full">
                <Link href="/">
                  <a>
                    <Typography.Text className="text-white">
                      Chính sách bảo hành sản phẩm
                    </Typography.Text>
                  </a>
                </Link>
              </Space>
            </Col>

            <Col xs={24} sm={12} lg={6} className="my-4">
              <Typography.Text className="my-0.5 mb-2 block font-semibold uppercase text-white">
                Thông tin chung
              </Typography.Text>
              <Space className="my-0.5 w-full">
                <Link href="/">
                  <a>
                    <Typography.Text className="text-white">
                      Khuyến mãi
                    </Typography.Text>
                  </a>
                </Link>
              </Space>
              <Space className="my-0.5 w-full">
                <Link href="/">
                  <a>
                    <Typography.Text className="text-white">
                      Tìm kiếm nhà thuốc gần nhất
                    </Typography.Text>
                  </a>
                </Link>
              </Space>
              <Link href="/">
                <a>
                  <Typography.Text className="my-2 block font-semibold uppercase text-white">
                    Danh mục hợp chất
                  </Typography.Text>
                </a>
              </Link>
              <Link href="/">
                <a>
                  <Typography.Text className="my-2 block font-semibold uppercase text-white">
                    Bản tin sức khỏe
                  </Typography.Text>
                </a>
              </Link>
            </Col>
          </Row>
          <div>
            <img src={IMAGES.logo} alt="logo" className="my-3 block h-10" />
            <Space className="my-2">
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
