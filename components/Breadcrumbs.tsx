import { Breadcrumb, BreadcrumbProps } from 'antd';
import LinkWrapper from './templates/LinkWrapper';
import { LeftOutlined } from '@ant-design/icons';

interface Breadcrumb {
  title?: string;
  path?: string;
}

type Breadcrumbs = Breadcrumb[];

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumbs;
}

const Breadcrumbs: React.FC<BreadcrumbsProps & BreadcrumbProps> = ({
  breadcrumbs,
  ...props
}) => {
  return (
    <Breadcrumb {...props}>
      {breadcrumbs.map((br, index) => (
        <Breadcrumb.Item key={index}>
          <LinkWrapper href={br.path} className="text-primary">
            {br.title || ''}
          </LinkWrapper>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
