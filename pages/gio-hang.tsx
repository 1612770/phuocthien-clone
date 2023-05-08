import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { useCart } from '@providers/CartProvider';
import { GetServerSidePropsContext } from 'next';
import PaymentMethodModel from '@configs/models/payment-method.model';
import { GeneralClient } from '@libs/client/General';
import CheckoutProvider, { useCheckout } from '@providers/CheckoutProvider';
import { OfferClient } from '@libs/client/Offer';
import OfferModel from '@configs/models/offer.model';
import { MasterDataClient } from '@libs/client/MasterData';
import ProvinceModel from '@configs/models/province.model';
import MasterDataProvider from '@providers/MasterDataProvider';
import AddressesProvider from '@providers/AddressesProvider';
import AddressModel from '@configs/models/address.model';
import { AuthClient } from '@libs/client/Auth';
import { COOKIE_KEYS } from '@libs/helpers';
import OfferUtils from '@libs/utils/offer.utils';
import SEO from '@components/SEO';
import Breadcrumbs from '@components/Breadcrumbs';
import CheckoutForm from '@modules/gio-hang/CheckoutForm';
import CheckoutEmptyState from '@modules/gio-hang/CheckoutEmptyState';
import { useAppConfirmDialog } from '@providers/AppConfirmDialogProvider';
import { Grid } from 'antd';

const CartPage: NextPageWithLayout<{
  paymentMethods: PaymentMethodModel[];
  offers: OfferModel[];
}> = ({ paymentMethods, offers }) => {
  const { cartProducts } = useCart();
  const { checkoutForm, checkout, setCheckoutError } = useCheckout();
  const { setConfirmData } = useAppConfirmDialog();
  const { lg } = Grid.useBreakpoint();

  const onCheckoutButtonClick = async () => {
    try {
      await checkoutForm?.validateFields();
      setConfirmData({
        title: 'Xác nhận đặt hàng',
        content:
          'Bạn đã kiểm tra thông tin mua hàng của mình và xác nhận đặt hàng',
        onOk: checkout,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setCheckoutError('Vui lòng kiểm tra lại thông tin');

      if (error.errorFields?.[0]?.name?.[0]) {
        checkoutForm?.scrollToField(
          error.errorFields?.[0]?.name?.[0] as string,
          {
            behavior: 'smooth',
            block: lg ? 'center' : 'start',
          }
        );
      }
    }
  };

  return (
    <>
      <SEO title="Giỏ hàng - Nhà thuốc Phước Thiện" />

      <div className="container pb-4">
        <Breadcrumbs
          className="pt-4 pb-2"
          breadcrumbs={[
            {
              title: 'Mua thêm sản phẩm khác',
              path: '/',
            },
          ]}
        ></Breadcrumbs>

        {cartProducts.length > 0 && (
          <CheckoutForm
            paymentMethods={paymentMethods}
            offers={offers}
            onCheckout={onCheckoutButtonClick}
          />
        )}

        {!cartProducts.length && <CheckoutEmptyState />}
      </div>
    </>
  );
};

export default CartPage;

CartPage.getLayout = (page) => {
  return (
    <PrimaryLayout background="primary">
      <MasterDataProvider defaultProvinces={page.props.provinces}>
        <CheckoutProvider>
          <AddressesProvider defaultAddresses={page.props.addresses}>
            {page}
          </AddressesProvider>
        </CheckoutProvider>
      </MasterDataProvider>
    </PrimaryLayout>
  );
};

// get server side props
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: {
      paymentMethods: PaymentMethodModel[];
      offers: OfferModel[];
      provinces: ProvinceModel[];
      addresses: AddressModel[];
    };
  } = {
    props: {
      paymentMethods: [],
      offers: [],
      provinces: [],
      addresses: [],
    },
  };

  const { req } = context;
  const token = req.cookies[COOKIE_KEYS.TOKEN];

  const generalClient = new GeneralClient(context, {});
  const authClient = new AuthClient(context, {});
  const offerClient = new OfferClient(context, {});
  const masterDataClient = new MasterDataClient(context, {});

  try {
    const [paymentMethods, offers, provinces] = await Promise.all([
      generalClient.getPaymentMethods(),
      offerClient.getAllActiveOffers(),
      masterDataClient.getAllProvinces(),
    ]);

    if (offers.data) {
      serverSideProps.props.offers = OfferUtils.filterNonValueOffer(
        offers.data
      );
    }

    if (provinces.data) {
      serverSideProps.props.provinces = provinces.data;
    }

    if (token) {
      const addresses = await authClient.getAddresses();
      if (addresses.data) {
        serverSideProps.props.addresses = addresses.data;
      }
    }

    serverSideProps.props.paymentMethods =
      paymentMethods.data?.filter(
        (method) =>
          (typeof method.visible === 'boolean' && method.visible) ||
          typeof method.visible === 'undefined'
      ) || [];
  } catch (error) {
    console.error('Gio hang', error);
  }

  return serverSideProps;
};
