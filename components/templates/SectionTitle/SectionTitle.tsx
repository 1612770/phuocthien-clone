import { Space, Typography } from 'antd';

type SectionTitleProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

function SectionTitle({ title, children, className }: SectionTitleProps) {
  return (
    <Space direction="vertical">
      <Typography.Title
        level={3}
        className={`mb-4 mt-12 uppercase ${className}`}
      >
        {title}
      </Typography.Title>
      {children}
    </Space>
  );
}

export default SectionTitle;
