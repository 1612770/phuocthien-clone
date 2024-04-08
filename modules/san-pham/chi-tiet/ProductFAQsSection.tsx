import { InfoCircleFilled } from '@ant-design/icons';
import AppDangerouslySetInnerHTML from '@components/AppDangerouslySetInnerHTML';
import { FAQ } from '@configs/models/faq.model';
import { ProductClient } from '@libs/client/Product';
import { Collapse, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

function ProductFAQsSection({ productKey }: { productKey: string }) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    const loadFags = async () => {
      try {
        const productClient = new ProductClient(null, {});
        const res = await productClient.getFAQs({ key: productKey });
        if (res.status === 'OK' && res.data) {
          setFaqs(res.data);
        }
      } catch (error) {
        console.error('Failed load faq');
        setFaqs([]);
      }
    };
    if (productKey != '') {
      loadFags();
    }
  }, [productKey]);
  return faqs?.length > 0 ? (
    <div className="my-4 lg:container">
      <Typography.Title
        level={3}
        className="mb-1 mt-6 inline-block font-medium uppercase lg:mb-4 lg:mt-12"
      >
        Câu hỏi thường gặp về sản phẩm
      </Typography.Title>

      <Collapse
        accordion
        bordered={false}
        expandIconPosition="right"
        className="bg-primary-background"
        defaultActiveKey={[faqs[0].key]}
      >
        {faqs.map((faq) => (
          <Collapse.Panel
            className=""
            key={faq.key}
            header={
              <Typography.Title
                className="m-0 font-medium text-primary"
                level={5}
              >
                <InfoCircleFilled className="text-primary" /> {faq.nameFaq}
              </Typography.Title>
            }
          >
            <AppDangerouslySetInnerHTML
              dangerouslySetInnerHTML={{
                __html: faq.description,
              }}
            ></AppDangerouslySetInnerHTML>
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  ) : null;
}

export default ProductFAQsSection;
