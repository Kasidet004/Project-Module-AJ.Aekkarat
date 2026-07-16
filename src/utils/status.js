export const ORDER_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  PAYMENT_VERIFICATION: 'payment_verification',
  PROCESSING: 'processing',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

export const ORDER_STATUS_FLOW = [
  ORDER_STATUS.PENDING_PAYMENT,
  ORDER_STATUS.PAYMENT_VERIFICATION,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.SHIPPING,
  ORDER_STATUS.DELIVERED,
]

export const ORDER_STATUS_LABEL = {
  [ORDER_STATUS.PENDING_PAYMENT]: 'รอการชำระเงิน',
  [ORDER_STATUS.PAYMENT_VERIFICATION]: 'ตรวจสอบการชำระเงิน',
  [ORDER_STATUS.PROCESSING]: 'กำลังจัดเตรียมสินค้า',
  [ORDER_STATUS.SHIPPING]: 'กำลังจัดส่ง',
  [ORDER_STATUS.DELIVERED]: 'จัดส่งสำเร็จ',
  [ORDER_STATUS.CANCELLED]: 'ยกเลิกคำสั่งซื้อ',
}

export const ORDER_STATUS_COLOR = {
  [ORDER_STATUS.PENDING_PAYMENT]: 'text-warn border-warn/40 bg-warn/10',
  [ORDER_STATUS.PAYMENT_VERIFICATION]: 'text-volt-400 border-volt-400/40 bg-volt-400/10',
  [ORDER_STATUS.PROCESSING]: 'text-circuit-400 border-circuit-400/40 bg-circuit-400/10',
  [ORDER_STATUS.SHIPPING]: 'text-circuit-400 border-circuit-400/40 bg-circuit-400/10',
  [ORDER_STATUS.DELIVERED]: 'text-ok border-ok/40 bg-ok/10',
  [ORDER_STATUS.CANCELLED]: 'text-danger border-danger/40 bg-danger/10',
}

export const PRODUCT_CATEGORIES = ['CPU', 'Mainboard', 'RAM', 'GPU', 'SSD', 'PSU', 'Case']
