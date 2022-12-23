import { Space, Typography } from 'antd';

type SectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

function Section({ title, children, className }: SectionProps) {
  return (
    <Space direction="vertical">
      <Typography.Title
        level={3}
        className={`mb-1 mt-2 uppercase ${className}`}
      >
        {title}
      </Typography.Title>
      {children}
    </Space>
  );
}

export default Section;
