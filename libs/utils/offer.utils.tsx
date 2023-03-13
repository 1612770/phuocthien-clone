import OfferModel from '@configs/models/offer.model';

const OfferUtils = {
  filterNonValueOffer: (offers: OfferModel[]) => {
    return offers.filter((offer) => {
      return offer.offerVal !== 0;
    });
  },
};

export default OfferUtils;
