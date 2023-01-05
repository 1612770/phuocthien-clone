import { Button, Input, Space, Tag, Typography } from 'antd';
import { Search } from 'react-feather';

function HomepageSearch() {
  return (
    <div className="relative mx-auto rounded-3xl bg-white p-12 shadow-lg lg:container">
      <Typography.Title level={1}>
        Tìm kiếm thuốc, bài viết sức khỏe...
      </Typography.Title>

      <Input.Group compact className="flex w-full">
        <Input
          placeholder="Tìm kiếm thuốc, bài viết sức khỏe..."
          size="large"
          className="h-[60px] w-full flex-1 rounded-l-full text-xl"
        />
        <Button
          type="primary"
          className=" h-[60px]  rounded-r-full shadow-none"
          size="large"
        >
          <Search size={32} className="mx-8" />
        </Button>
      </Input.Group>

      <div className="mt-4">
        <Typography.Title
          level={4}
          className="mb-1 font-normal text-neutral-600"
        >
          Nổi bật
        </Typography.Title>
        <Space size={[8, 8]} wrap>
          <a href="#">
            <Tag className="rounded-full border-none bg-primary-background p-2 text-base">
              Thuốc đau đầu
            </Tag>
          </a>
          <a href="#">
            <Tag className="rounded-full border-none bg-primary-background p-2 text-base">
              Thuốc đau bụng
            </Tag>
          </a>
          <a href="#">
            <Tag className="rounded-full border-none bg-primary-background p-2 text-base">
              Thuốc đau mắt
            </Tag>
          </a>
          <a href="#">
            <Tag className="rounded-full border-none bg-primary-background p-2 text-base">
              Thuốc xương khớp
            </Tag>
          </a>
        </Space>
      </div>
    </div>
  );
}

export default HomepageSearch;
