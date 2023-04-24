const CurrencyUtils = {
  format: (price?: number): string => {
    return (price || 0)?.toLocaleString('it-IT', {
      style: 'currency',
      currency: 'VND',
    });
  },

  formatWithDiscount: (price?: number, discountVal?: number): string => {
    if (!price) price = 0;
    if (!discountVal) discountVal = 0;

    return (price * (1 - discountVal)).toLocaleString('it-IT', {
      style: 'currency',
      currency: 'VND',
    });
  },
};

export default CurrencyUtils;
