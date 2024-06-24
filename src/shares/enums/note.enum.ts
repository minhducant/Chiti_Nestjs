export enum StatusEnum {
  draft = 0, // Nháp
  incomplete = 1, // Chưa hoàn tất
  complete = 2, // Hoàn tất
  priority = 3, // Quan trọng
  verified = 4, // Xác nhận
  pending = 5, // Chờ xử lý
  archived = 6, // Lưu trữ
  deleted = 7, // Đã xóa
}

export enum NotePermission {
  /** Quyền chỉnh sửa */
  edit = 0,
  /** Quyền xem */
  view = 1,
  /** Quyền chia sẻ */
  share = 2,
}

export enum Currency {
  VND = 1, // Vietnamese Dong
  USD = 2, // United States Dollar
  JPY = 3, // Japanese Yen
  KRW = 4, // South Korean Won
  EUR = 5, // Euro
  GBP = 6, // British Pound
  TWD = 7, // New Taiwan Dollar
  THB = 8, // Thai Baht
  LAK = 9, // Lao Kip
  KHR = 10, // Cambodian Riel
  PHP = 11, // Philippine Peso
  CNY = 12, // Chinese Yuan Renminbi
  AUD = 13, // Australian Dollar
  IDR = 14, // Indonesian Rupiah
  MYR = 15, // Malaysian Ringgit
  SGD = 16, // Singapore Dollar
  CAD = 17, // Canadian Dollar
}

/**
 * Enum đại diện cho các khoản chi tiêu phổ biến trong cuộc sống.
 * - `groceries`: Tiền mua sắm thực phẩm.
 * - `rent`: Tiền thuê nhà.
 * - `utilities`: Tiền các dịch vụ công cộng (điện, nước, gas, internet, v.v.).
 * - `transportation`: Tiền đi lại và giao thông vận tải.
 * - `entertainment`: Tiền giải trí và vui chơi.
 * - `healthcare`: Tiền chăm sóc sức khỏe và y tế.
 * - `education`: Tiền giáo dục và học phí.
 * - `clothing`: Tiền mua sắm quần áo và phụ kiện.
 * - `savings`: Tiền tiết kiệm.
 * - `otherExpense`: Khoản chi khác.
 */
export enum expenseCategory {
  groceries = 0,
  rent = 1,
  utilities = 2,
  transportation = 3,
  entertainment = 4,
  healthcare = 6,
  education = 7,
  clothing = 8,
  savings = 9,
  other = 10,
}
