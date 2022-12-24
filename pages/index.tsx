import { Typography } from 'antd';
import { NextPageWithLayout } from './page';

const Home: NextPageWithLayout = () => {
  return (
    <main className="p-4 md:p-11">
      <Typography.Title level={1}>NextJS-Antd-Tailwindcss</Typography.Title>

      <section>
        <Typography.Title level={2}>Button</Typography.Title>
      </section>

      <section>
        <Typography.Title level={3}>Input</Typography.Title>
      </section>

      <section>
        <Typography.Title level={4}>Switch</Typography.Title>
      </section>

      <section>
        <Typography.Title level={5} className="font-bold underline">
          Modal
        </Typography.Title>
      </section>
    </main>
  );
};

export default Home;

Home.getLayout = (page) => {
  return page;
};
