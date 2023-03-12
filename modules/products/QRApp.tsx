import { Typography } from 'antd';
import React from 'react';
import { QR_URL } from '@configs/env';
import { QRCode } from 'react-qrcode-logo';

function QRApp() {
  return (
    <div className="flex justify-center rounded-lg bg-gray-50 p-4 pt-0 pb-2">
      <div className="mt-2 flex items-center gap-1 lg:gap-2">
        <div className="flex flex-col items-center">
          <QRCode
            value={QR_URL}
            logoImage="/logo.png"
            size={96}
            logoWidth={16}
            logoHeight={14}
          />
          <Typography className=" mt-1 text-sm text-gray-500">
            Quét để tải app
          </Typography>
        </div>
        <div className="min-w-[120px]">
          <Typography className="text-center ">Sử dụng app để</Typography>
          <Typography className="text-center text-sm text-gray-500">
            Tích & Sử dụng điểm cho khách hàng thân thiết
          </Typography>
        </div>
        <div className="flex flex-col  gap-3">
          <div>
            <a
              href="https://play.google.com/store/apps/details?id=com.esuspharmacy.phuocthien&hl=en"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/chplay.png" alt="" className="w-[120px]" />
            </a>
          </div>
          <div>
            <a
              target="_blank"
              href="https://apps.apple.com/us/app/nh%C3%A0-thu%E1%BB%91c-ph%C6%B0%E1%BB%9Bc-thi%E1%BB%87n/id1662328703"
              rel="noreferrer"
            >
              <img src="/appstore.png" alt="" className="w-[120px]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRApp;
