import {
  CaretRightOutlined,
  InboxOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import { UploadClient } from '@libs/client/upload';
import { Collapse, Form, FormInstance, Spin, Typography, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { useState } from 'react';
import { PrescriptionFormData } from '../../pages/gui-don-thuoc/index';
import Image from 'next/image';

function PrescriptionFileFormItem({
  form,
}: {
  form: FormInstance<PrescriptionFormData>;
}) {
  const [uploading, setUploading] = useState(false);

  const prescriptFileUrl = Form.useWatch('prescriptionUrl', form);

  const isPrescriptFileImage = ['png', 'jpg', 'jpeg', 'svg'].includes(
    prescriptFileUrl?.split('.').pop() || ''
  );

  const onUploadImage = async (
    file: RcFile | string | Blob
  ): Promise<string | undefined> => {
    try {
      setUploading(true);
      const uploadClient = new UploadClient(null, {});
      const formData = new FormData();

      formData.append('file', file);
      const uploadResponse = await uploadClient.upload(formData);
      if (uploadResponse.data?.url) {
        return uploadResponse.data.url;
      }
      return undefined;
    } catch (error) {
      // TODO: Ignore error
      return 'https://nhathuocphuocthien.com/logo_new.svg';
    } finally {
      setUploading(false);
    }
  };

  return (
    <Collapse
      bordered={false}
      expandIconPosition="end"
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
    >
      <Collapse.Panel
        header={
          <div className="flex items-center gap-2">
            <PaperClipOutlined
              style={{ fontSize: '20px' }}
              className="text-primary"
            />
            <Typography.Text className="font-semibold">
              Đính kèm toa thuốc (không bắt buộc)
            </Typography.Text>
          </div>
        }
        key="1"
      >
        <Spin spinning={uploading}>
          <Form.Item name="prescriptionUrl" className="mb-0" hidden />
          <Upload.Dragger
            name="file"
            multiple={false}
            itemRender={() => null}
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            maxCount={1}
            customRequest={async ({ file }) => {
              const url = await onUploadImage(file);

              form.setFieldsValue({
                prescriptionUrl: url,
              });
            }}
          >
            {!prescriptFileUrl && (
              <>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Kéo thả hoặc click để tải lên tập tin
                </p>
                <p className="ant-upload-hint">
                  Bạn có thể đính kèm file hình ảnh toa thuốc hoặc Word, PDF
                </p>
              </>
            )}

            {prescriptFileUrl && (
              <>
                {isPrescriptFileImage && (
                  <Image
                    src={prescriptFileUrl}
                    objectFit="contain"
                    alt="preview"
                    loading="lazy"
                    height={200}
                    className="w-full p-[16px]"
                  />
                )}

                {!isPrescriptFileImage && (
                  <div className="flex h-[120px] items-center justify-center gap-2">
                    <PaperClipOutlined
                      style={{ fontSize: '20px' }}
                      className="text-primary"
                    ></PaperClipOutlined>
                    <Typography.Text className="font-semibold">
                      {prescriptFileUrl.split('/').pop()}
                    </Typography.Text>
                  </div>
                )}
              </>
            )}
          </Upload.Dragger>
        </Spin>
      </Collapse.Panel>
    </Collapse>
  );
}

export default PrescriptionFileFormItem;
