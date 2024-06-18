import ProductTypeGroupModel from '@configs/models/product-type-group.model';
import Product from '@configs/models/product.model';
import { flatten } from 'lodash';

export const listMenu = [
  {
    productTypeUrl: 'thuc-pham-chuc-nang',
    productTypeName: 'Thực phẩm chức năng',
    fetchAll: true,
    productGroups: [
      {
        productGroupUrl: 'bo-than-tang-sinh-ly',
        productGroupImage: '/photos/140610CH_bo-than-tang-sinh-ly.svg',
        productGroupName: 'Bổ thận, tăng sinh lý',
      },
      {
        productGroupUrl: 'ho-tro-tim-mach',
        productGroupImage: '/photos/140808CH_ho-tro-tim-mach.svg',
        productGroupName: 'Hỗ trợ tim mạch',
      },
      {
        productGroupUrl: 'ho-tro-tri-gian-tinh-mach-tri-tao-bon',
        productGroupImage:
          '/photos/113917SA_Ho-tro-gian-tinh-mach-tri-tao-bon.svg',
        productGroupName: 'Hỗ trợ trị giãn tĩnh mạch, trĩ, táo bón',
      },
      {
        productGroupUrl: 'lam-dep-giam-can',
        productGroupImage: '/photos/141216CH_lam-dep-giam-can.svg',
        productGroupName: 'Làm đẹp, giảm cân',
      },
      {
        productGroupUrl: 'bo-nao',
        productGroupImage: '/photos/141039CH_bo-nao.svg',
        productGroupName: 'Bổ não',
      },
      {
        productGroupUrl: 'ho-tro-tri-ung-thu',
        productGroupImage: '/photos/141432CH_ho-tro-ung-thu.svg',
        productGroupName: 'Hỗ trợ trị ung thư',
      },
      {
        productGroupUrl: 'keo-ngam-vien-ngam',
        productGroupImage: '/photos/141354CH_keo-ngam-vien-ngam.svg',
        productGroupName: 'Kẹo ngậm, viên ngậm',
      },
      {
        productGroupUrl: 'bo-tro-xuong-khop',
        productGroupImage: '/photos/141106CH_bo-tro-xuong-khop.svg',
        productGroupName: 'Bổ trợ xương khớp',
      },
      {
        productGroupUrl: 'tang-suc-de-khang',
        productGroupImage: '/photos/141316CH_tang-suc-de-khang.svg',
        productGroupName: 'Tăng sức đề kháng',
      },
      {
        productGroupUrl: 'ho-tro-tieu-duong',
        productGroupImage: '/photos/140908CH_ho-tro-tieu-duong.svg',
        productGroupName: 'Hỗ trợ tiểu đường',
      },
      {
        productGroupUrl: 'dau-ca-bo-mat',
        productGroupImage: '/photos/141127CH_dau-ca-bo-mat.svg',
        productGroupName: 'Dầu Cá, bổ mắt',
      },
      {
        productGroupUrl: 'bo-phe-ho-hap',
        productGroupImage: '/photos/141018CH_bo-phe-ho-hap.svg',
        productGroupName: 'Bổ phế, hô hấp',
      },
      {
        productGroupUrl: 'vitamin-khoang-chat',
        productGroupImage: '/photos/141158CH_vitamin-khoang-chat.svg',
        productGroupName: 'Vitamin và  khoáng chất',
      },
      {
        productGroupUrl: 'bo-gan',
        productGroupImage: '/photos/140627CH_bo-gan.svg',
        productGroupName: 'Bổ gan',
      },
      {
        productGroupUrl: 'ho-tro-tieu-hoa',
        productGroupImage: '/photos/141412CH_ho-tro-tieu-hoa.svg',
        productGroupName: 'Hỗ trợ tiêu hoá',
      },
    ],
  },
  {
    productTypeUrl: 'cham-soc-ca-nhan',
    productTypeName: 'Chăm sóc cá nhân',
    fetchAll: true,
    productGroups: [
      {
        productGroupUrl: 'cham-soc-toan-than',
        productGroupImage: '/photos/141750CH_cham-soc-toan-than.svg',
        productGroupName: 'Chăm sóc toàn thân',
      },
      {
        productGroupUrl: 'cham-soc-mat-tai-mui-hong',
        productGroupImage: '/photos/141918CH_cham-soc-tai-mat-mui-hong.svg',
        productGroupName: 'Chăm sóc mắt, tai, mũi, họng',
      },
      {
        productGroupUrl: 'dau-goi-xa-duong-toc',
        productGroupImage: '/photos/142136CH_dau-goi-xa-duong-toc.svg',
        productGroupName: 'Dầu gội, xả, dưỡng tóc',
      },
      {
        productGroupUrl: 'cham-soc-rang-mieng',
        productGroupImage: '/photos/142120CH_cham-soc-rang-mieng.svg',
        productGroupName: 'Chăm sóc răng miệng',
      },
      {
        productGroupUrl: 'cham-soc-vung-kin',
        productGroupImage: '/photos/142528CH_cham-soc-vung-kin.svg',
        productGroupName: 'Chăm sóc vùng kín',
      },
      {
        productGroupUrl: 'dau-tinh-dau',
        productGroupImage: '/photos/142046CH_dau-tinh-dau.svg',
        productGroupName: 'Dầu, tinh dầu',
      },
      {
        productGroupUrl: 'thuc-pham-do-uong',
        productGroupImage: '/photos/141720CH_thuc-pham-do uong.svg',
        productGroupName: 'Thực phẩm, đồ uống',
      },
      {
        productGroupUrl: 'kem-xit-chong-con-trung',
        productGroupImage: '/photos/142012CH_kem-xit-con-trung.svg',
        productGroupName: 'Kem, xịt chống côn trùng',
      },
      {
        productGroupUrl: 'sua-bot',
        productGroupImage: '/photos/141659CH_sua-bot.svg',
        productGroupName: 'Sữa bột',
      },
      {
        productGroupUrl: 'dao-bot-cao-rau',
        productGroupImage: '/photos/141943CH_dao-cao-rau.svg',
        productGroupName: 'Dao, bọt cạo râu',
      },
      {
        productGroupUrl: 'cham-soc-chan-tay',
        productGroupImage: '/photos/142103CH_cham-soc-chan-tay.svg',
        productGroupName: 'Chăm sóc chân tay',
      },
      {
        productGroupUrl: 'khan-giay-khan-uot',
        productGroupImage: '/photos/141844CH_khan-giay-khan-uot.svg',
        productGroupName: 'Khăn giấy, khăn ướt',
      },
      {
        productGroupUrl: 'bao-cao-su-gel-boi-tron',
        productGroupImage: '/photos/141637CH_bao-cao-su-gel-boi-tron.svg',
        productGroupName: 'Bao cao su, gel bôi trơn',
      },
    ],
  },
  {
    productTypeUrl: 'duoc-my-pham',
    productTypeName: 'Dược mỹ phẩm',
    fetchAll: true,
    productGroups: [
      {
        productGroupUrl: 'kem-xit-chong-nang',
        productGroupImage: '/photos/115847SA_kem-xit-chong-nang.svg',
        productGroupName: 'Kem, xịt chống nắng',
      },
      {
        productGroupUrl: 'duong-da-duong-moi',
        productGroupImage: '/photos/115800SA_duong-da-duong-moi.svg',
        productGroupName: 'Dưỡng da, dưỡng môi',
      },
      {
        productGroupUrl: 'tay-te-bao-chet',
        productGroupImage: '/photos/115730SA_tay-te-bao-da-chet.svg',
        productGroupName: 'Tẩy tế bào chết',
      },
      {
        productGroupUrl: 'duong-the',
        productGroupImage: '/photos/115818SA_duong-the.svg',
        productGroupName: 'Dưỡng thể',
      },
      {
        productGroupUrl: 'tay-trang',
        productGroupImage: '/photos/115912SA_tay-trang.svg',
        productGroupName: 'Tẩy trang',
      },
      {
        productGroupUrl: 'toner-xit-khoang',
        productGroupImage: '/photos/120110CH_tonner-xit-khoang.svg',
        productGroupName: 'Toner và xịt khoáng',
      },
      {
        productGroupUrl: 'mat-na',
        productGroupImage: '/photos/120052CH_mat-na.svg',
        productGroupName: 'Mặt nạ',
      },
      {
        productGroupUrl: 'kem-sua-rua-mat',
        productGroupImage: '/photos/120035CH_kem-sua-rua-mat.svg',
        productGroupName: 'Kem, sữa rửa mặt',
      },
      {
        productGroupUrl: 'tri-mun--ngua-seo-mo-tham',
        productGroupImage: '/photos/115934SA_tri-mun-ngua-seo-mo-tham.svg',
        productGroupName: 'Trị mụn, ngừa sẹo, mờ thâm',
      },
    ],
  },
  {
    productTypeUrl: 'cham-soc-em-be',
    productTypeName: 'Chăm sóc trẻ em',
    fetchAll: false,
    productGroups: [
      {
        productGroupUrl: 'tinh-dau-tre-em',
        productGroupImage: '/photos/170134CH_Tinh dầu trẻ em.svg',
        productGroupName: 'Tinh dầu trẻ em',
      },
      {
        productGroupUrl: 'sua-bot-cho-be',
        productGroupImage: '/photos/170037CH_Sữa bột cho bé.svg',
        productGroupName: 'Sữa bột cho bé',
      },
      {
        productGroupUrl: 'khan-uot-cho-be',
        productGroupImage: '/photos/170013CH_Khăn ướt cho trẻ.svg',
        productGroupName: 'Khăn ướt cho bé',
      },
      {
        productGroupUrl: 'phan-thom-kem-chong-ham',
        productGroupImage: '/photos/170151CH_Phấn thơm, kem chống hăm.svg',
        productGroupName: 'Phấn thơm, kem chống hăm',
      },
      {
        productGroupUrl: 'danh-rang-cho-be',
        productGroupImage: '/photos/170257CH_Đánh răng cho bé.svg',
        productGroupName: 'Đánh răng cho bé',
      },
      {
        productGroupUrl: 'dau-goi-sua-tam-cho-be',
        productGroupImage: '/photos/170220CH_Dầu gội, sữa tắm cho bé.svg',
        productGroupName: 'Dầu gội, sữa tắm cho bé',
      },
      {
        productGroupUrl: 'khau-trang-cho-be',
        productGroupImage: '/photos/170237CH_Khẩu trang cho bé.svg',
        productGroupName: 'Khẩu trang cho bé',
      },
    ],
  },
  {
    productTypeUrl: 'thiet-bi-y-te',
    productTypeName: 'Thiết bị y tế',
    fetchAll: false,
    productGroups: [
      {
        productGroupUrl: 'nuoc-muoi-dung-dich-sat-trung',
        productGroupImage: '/photos/145111CH_nuoc-muoi-dung-dich-sat-trung.svg',
        productGroupName: 'Nước muối, dung dịch sát trùng',
      },
      {
        productGroupUrl: 'nhiet-ke',
        productGroupImage: '/photos/145139CH_nhiet-ke.svg',
        productGroupName: 'Nhiệt kế',
      },
      {
        productGroupUrl: 'may-do-spo2',
        productGroupImage: '/photos/145622CH_may-do-spo2.svg',
        productGroupName: 'Máy đo SpO2',
      },
      {
        productGroupUrl: 'may-do-huyet-ap',
        productGroupImage: '/photos/145243CH_may-do-huyet-ap.svg',
        productGroupName: 'Máy đo huyết áp',
      },
      {
        productGroupUrl: 'mat-kinh-tam-chan-giot-ban',
        productGroupImage: '/photos/144909CH_mat-kinh-tam-chan-giot-ban.svg',
        productGroupName: 'Mắt kính, tấm chắn giọt bắn',
      },
      {
        productGroupUrl: 'may-xong-khi',
        productGroupImage: '/photos/145204CH_may-xong-khi-dung.svg',
        productGroupName: 'Máy xông khí',
      },
      {
        productGroupUrl: 'vo-dai-y-khoa',
        productGroupImage: '/photos/145444CH_vo-dai-y-khoa.svg',
        productGroupName: 'Vớ, đai y khoa ',
      },
      {
        productGroupUrl: 'kit-test-covid',
        productGroupImage: '/photos/144958CH_kit-test-covid.svg',
        productGroupName: 'Kit test Covid',
      },
      {
        productGroupUrl: 'can-suc-khoe',
        productGroupImage: '/photos/144936CH_can-suc-khoe.svg',
        productGroupName: 'Cân sức khoẻ',
      },
      {
        productGroupUrl: 'may-do-que-thu-duong-huyet',
        productGroupImage: '/photos/145423CH_may-do-duong-huyet.svg',
        productGroupName: 'Máy đo, que thử đường huyết',
      },
      {
        productGroupUrl: 'mieng-dan-giam-dau-ha-sot',
        productGroupImage: '/photos/145030CH_mieng-dan-giam-dau-ha-sot.svg',
        productGroupName: 'Miếng dán giảm đau, hạ sốt',
      },
      {
        productGroupUrl: 'que-thu-thai-rung-trung',
        productGroupImage: '/photos/145605CH_que-thu-thai-rung-trung.svg',
        productGroupName: 'Que thử thai, rụng trứng',
      },
      {
        productGroupUrl: 'khau-trang',
        productGroupImage: '/photos/145538CH_khau-trang.svg',
        productGroupName: 'Khẩu trang',
      },
      {
        productGroupUrl: 'cac-dung-cu-khac',
        productGroupImage: '/photos/145507CH_cac-dung-cu-khac.svg',
        productGroupName: 'Các dụng cụ khác',
      },
      {
        productGroupUrl: 'bong-bang-gac-gang-tay',
        productGroupImage: '/photos/145050CH_bong-bang-gac-gang-tay.svg',
        productGroupName: 'Bông, băng gạc, găng tay',
      },
    ],
  },
];
export interface MenuProductType {
  productTypeUrl: string;
  productTypeName: string;
  fetchAll: boolean;
  productGroups: MenuProductGroup[];
}
export const fetchDataFirstSlugs: {
  productTypeSlug: string;
  productGroupSlug: string;
}[] = flatten(
  listMenu.map((menu) => {
    if (menu.fetchAll) {
      return menu.productGroups.slice(0, 4).map((group) => {
        return {
          productTypeSlug: menu.productTypeUrl,
          productGroupSlug: group.productGroupUrl,
        };
      });
    } else {
      return menu.productGroups.slice(0, 2).map((group) => {
        return {
          productTypeSlug: menu.productTypeUrl,
          productGroupSlug: group.productGroupUrl,
        };
      });
    }
  })
);
export interface MenuProductGroup {
  productGroupUrl: string;
  productGroupImage: string;
  productGroupName: string;
  products?: Product[];
  productTypeGroup?: ProductTypeGroupModel[];
}
