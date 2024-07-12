import { InfoCircleOutlined } from '@ant-design/icons';
import PrimaryLayout from '@components/layouts/PrimaryLayout';
import ProductCard from '@components/templates/ProductCard';
import Product from '@configs/models/product.model';
import PrescriptionGuidelinesModal from '@modules/products/PrescriptionGuidelinesModal';
import ProductSearchModal from '@modules/products/ProductSearchModal';
import ProductSearchModalProductList from '@modules/products/ProductSearchModalProductList';
import { Button, Card, Empty, Form, Input } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import React, { useState } from 'react';
import PrescriptionFileFormItem from '../../modules/products/PrescriptionFileFormItem';
import PrescriptionGuidelinesSteps from '../../modules/products/PrescriptionGuidelinesSteps';
import PrescriptionSuccessView from '../../modules/products/PrescriptionSuccessView';
import IMAGES from '@configs/assests/images';

export interface PrescriptionFormData {
  fullName: string;
  phone: string;
  note: string;
  prescriptionUrl: string;
  selectedProducts: Product[];
}

const PrescriptionSendingPage: NextPageWithLayout = () => {
  const [form] = Form.useForm<PrescriptionFormData>();

  const [isProductSearchModalOpen, setIsProductSearchModalOpen] =
    useState(false);
  const [
    isPrescriptionGuidlinesModalOpen,
    setIsPrescriptionGuidlinesModalOpen,
  ] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const showModal = () => {
    setIsProductSearchModalOpen(true);
  };

  const handleCancel = () => {
    setIsProductSearchModalOpen(false);
  };

  const selectedProducts = Form.useWatch('selectedProducts', form) || [];

  const onFinish = (values: {
    fullName: string;
    phone: string;
    note: string;
    prescriptionUrl: string;
    selectedProducts: Product[];
  }) => {
    // eslint-disable-next-line no-console
    console.log(values);

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <PrescriptionSuccessView
        onReset={() => {
          setIsSubmitted(false);
          form.resetFields();
        }}
      />
    );
  }

  return (
    <Form
      autoComplete="off"
      scrollToFirstError
      layout="vertical"
      colon={false}
      onFinish={onFinish}
      form={form}
      disabled={isSubmitting}
    >
      <div className="mx-auto px-4 py-4 md:py-8 md:px-2 lg:container">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 grid grid-cols-12 gap-4 md:col-span-8">
            <div className="col-span-12 flex w-full justify-between">
              <h1 className="col-span-12 mb-0 text-xl font-semibold md:mb-2 md:text-2xl">
                Gửi toa thuốc
              </h1>

              <Button
                className="md:hidden"
                size="small"
                type="text"
                onClick={() => setIsPrescriptionGuidlinesModalOpen(true)}
              >
                Xem hướng dẫn <InfoCircleOutlined />
              </Button>
            </div>

            <Card title="Thông tin cá nhân" className="col-span-12">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    className="mb-2"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập họ và tên',
                      },
                    ]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </div>

                <div className="col-span-12 md:col-span-6">
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    className="mb-2"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số điện thoại',
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </div>
              </div>

              <Form.Item label="Ghi chú" name="note" className="mb-2">
                <Input.TextArea
                  autoSize={{ minRows: 3 }}
                  placeholder="Nhập ghi chú"
                />
              </Form.Item>

              <PrescriptionFileFormItem form={form} />
              <Card
                title="Thêm thuốc cần tư vấn (không bắt buộc)"
                className="col-span-12 mt-4"
                actions={
                  selectedProducts.length > 0
                    ? [
                        <Button key="submit" type="primary" onClick={showModal}>
                          Tìm kiếm
                        </Button>,
                      ]
                    : []
                }
              >
                <Form.Item
                  name="selectedProducts"
                  className="mb-0"
                  hidden
                  initialValue={[]}
                />

                {!selectedProducts.length && (
                  <Empty
                    description="Chưa có sản phẩm nào"
                    image={IMAGES.empty}
                    imageStyle={{ height: 60 }}
                  >
                    <Button type="primary" onClick={showModal}>
                      Tìm kiếm
                    </Button>
                  </Empty>
                )}

                {selectedProducts.length > 0 &&
                  selectedProducts.map((product, index) => (
                    <div key={index} className="my-2">
                      <ProductCard
                        hrefDisabled
                        hidePrice
                        variant="list"
                        product={product}
                        actionComponent={
                          <Button
                            block
                            size="small"
                            shape="round"
                            type="default"
                            className="h-[32px] w-[fit-content]"
                            onClick={() => {
                              form.setFieldValue(
                                'selectedProducts',
                                selectedProducts.filter(
                                  (item) => item.key !== product.key
                                )
                              );
                            }}
                          >
                            Bỏ chọn
                          </Button>
                        }
                      />
                    </div>
                  ))}
              </Card>
            </Card>
          </div>

          <div className="col-span-12 grid-cols-12 gap-2 pt-[56px] md:col-span-4">
            <Card
              className="fixed bottom-0 left-0 right-0 z-10 col-span-12 h-fit md:static"
              bodyStyle={{
                padding: '16px',
              }}
            >
              <Button
                loading={isSubmitting}
                className=""
                shape="round"
                type="primary"
                size="large"
                block
                htmlType="submit"
              >
                Gửi toa thuốc
              </Button>
            </Card>

            <Card
              className="col-span-12 mt-4 hidden md:block"
              title="Quy trình tư vấn thuốc"
            >
              <PrescriptionGuidelinesSteps />
            </Card>
          </div>
        </div>

        <ProductSearchModal
          open={isProductSearchModalOpen}
          handleCancel={handleCancel}
        >
          <ProductSearchModalProductList
            selectedProducts={selectedProducts}
            setSelectedProducts={(products) => {
              form.setFieldValue('selectedProducts', products);
            }}
          />
        </ProductSearchModal>

        <PrescriptionGuidelinesModal
          open={isPrescriptionGuidlinesModalOpen}
          handleCancel={() => setIsPrescriptionGuidlinesModalOpen(false)}
        >
          <PrescriptionGuidelinesSteps />
        </PrescriptionGuidelinesModal>
      </div>
    </Form>
  );
};

PrescriptionSendingPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export default PrescriptionSendingPage;
