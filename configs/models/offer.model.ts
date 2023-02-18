type OfferModel = Partial<{
  key: string;
  offerCode: string;
  offerName: string;
  offerImg: string;
  offerVal: number;
  beginDate: string;
  endDate: string;
  minAmountOffer: number;
  maxAmountOffer: number;
}>;

export default OfferModel;
