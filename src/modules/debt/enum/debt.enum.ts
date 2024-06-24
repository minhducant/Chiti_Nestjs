export enum StatusEnum {
  draft = 0, // Nháp
  verified = 1, // Đã xác nhận
  paid = 2, // Đã thanh toán
  cancelled = 3, // Đã huỷ
  overdue = 4, // Quá hạn
  partial_payment = 5, // Thanh toán một phần
  payment_pending = 6, // Chờ thanh toán
  under_review = 7, // Đang xem xét
  refunded = 8, // Đã hoàn lại
  disputed = 9, // Đang bị tranh chấp
}
