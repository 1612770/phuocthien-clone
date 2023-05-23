import { InfoCircleFilled } from '@ant-design/icons';
import AppDangerouslySetInnerHTML from '@components/AppDangerouslySetInnerHTML';
import { FAQ } from '@configs/models/faq.model';
import { Collapse, Typography } from 'antd';
import React from 'react';

function ProductFAQsSection({ faqs }: { faqs: FAQ[] }) {
  if (!faqs?.length) return null;

  const sortedFaqs = faqs.sort((a, b) => a.indexFaq - b.indexFaq);

  return (
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
        defaultActiveKey={[sortedFaqs[0].key]}
      >
        {sortedFaqs.map((faq) => (
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
  );
}

export default ProductFAQsSection;
