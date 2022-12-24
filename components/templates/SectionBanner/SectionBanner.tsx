import { Space } from 'antd';

type SectionBannerProps = {
  src: string;
  children: React.ReactNode;
  className?: string;
};

function SectionBanner({ src, children, className }: SectionBannerProps) {
  return (
    <Space direction="vertical">
      <img
        className={`${className} mt-8 mb-2 block h-48 w-full object-cover`}
        src={src}
        alt="banner image"
      />

      {children}
    </Space>
  );
}

export default SectionBanner;
