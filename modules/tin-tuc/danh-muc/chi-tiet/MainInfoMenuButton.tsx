import { MenuOutlined } from '@ant-design/icons';
import MainInfoModel from '@configs/models/main-info.model';
import { Button, Drawer } from 'antd';
import React, { useState } from 'react';
import MainInfoMenu from './MainInfoMenu';

function MainInfoMenuButton({ mainInfo }: { mainInfo: MainInfoModel[] }) {
  const [mainInfoDrawerOpen, setMainInfoDrawerOpen] = useState(false);
  return (
    <>
      <Button
        block
        icon={<MenuOutlined />}
        type="primary"
        className="shadow-none"
        onClick={() => setMainInfoDrawerOpen(true)}
      >
        Danh sách bài viết
      </Button>
      <Drawer
        title="Danh sách bài viết"
        open={mainInfoDrawerOpen}
        onClose={() => setMainInfoDrawerOpen(false)}
      >
        <MainInfoMenu
          mainInfo={mainInfo}
          onItemClick={() => {
            setMainInfoDrawerOpen(false);
          }}
        ></MainInfoMenu>
      </Drawer>
    </>
  );
}

export default MainInfoMenuButton;
