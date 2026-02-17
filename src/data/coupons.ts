import { Coupon } from '@/types/product';

export const coupons: Coupon[] = [
  {
    code: 'FRESH10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 299,
    maxDiscount: 100,
    isActive: true,
  },
  {
    code: 'SAVE50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 499,
    isActive: true,
  },
  {
    code: 'FIRST20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 399,
    maxDiscount: 150,
    isActive: true,
  },
  {
    code: 'MEGA100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderValue: 999,
    isActive: true,
  },
];

export const validateCoupon = (code: string, orderTotal: number): { valid: boolean; coupon?: Coupon; discount?: number; message?: string } => {
  const coupon = coupons.find((c) => c.code.toLowerCase() === code.toLowerCase() && c.isActive);
  
  if (!coupon) {
    return { valid: false, message: 'Invalid coupon code' };
  }
  
  if (orderTotal < coupon.minOrderValue) {
    return { 
      valid: false, 
      message: `Minimum order value of ₹${coupon.minOrderValue} required` 
    };
  }
  
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((orderTotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.discountValue;
  }
  
  return { valid: true, coupon, discount };
};

