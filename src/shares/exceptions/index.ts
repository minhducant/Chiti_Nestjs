export const httpErrors = {
  // USER
  ACCOUNT_NOT_FOUND: {
    message: 'Account not found.',
    code: 'USER_00000',
  },
  ACCOUNT_EXISTED: {
    message: 'Account already existed.',
    code: 'USER_00001',
  },
  ACCOUNT_HASH_NOT_MATCH: {
    message: 'Account address and hash message are not matched.',
    code: 'USER_00002',
  },
  UNAUTHORIZED: {
    message: 'Unauthorized user.',
    code: 'USER_00003',
  },
  USER_BANNED: {
    message: 'User has been banned.',
    code: 'USER_00004',
  },
  USER_UNVERIFIED: {
    message: 'Unverified user.',
    code: 'USER_00005',
  },
  VERIFY_SIGNATURE_FAIL: {
    message: 'System has been failed to verify signature.',
    code: 'USER_00006',
  },
  REFRESH_TOKEN_EXPIRED: {
    message: 'Refresh tokens is expired.',
    code: 'USER_00007',
  },
  ACCESS_TOKEN_EXPIRED: {
    message: 'Refresh tokens is expired.',
    code: 'USER_00008',
  },
  FORBIDDEN: {
    message: 'You are not authorized to access this resource.',
    code: 'USER_00009',
  },
  USER_EMAIL_EXISTED: {
    message: 'Email has been associated with an other account.',
    code: 'USER_00025',
  },
  USER_EMAIL_VERIFY_FAIL: {
    message: 'Failed to verify this email.',
    code: 'USER_00026',
  },
  EMAIL_CONFIRM_NOT_FOUND: {
    message: 'Email request not found!',
    code: 'USER_00027',
  },
  EMAIL_WAIT_TIME: {
    message: 'Too much request',
    code: 'USER_00028',
  },
  USER_WRONG_PASSWORD: {
    message: 'Password is incorrect',
    code: 'USER_00029',
  },
  USER_CODE_INVALID: {
    message: 'Verification code is invalid',
    code: 'USER_00030',
  },
  USER_EXPIRED_CODE: {
    message: `You've entered an incorrect code. Please note that current code will be expired if you enter it wrong 5 times in a row`,
    code: 'USER_00031',
  },

  // CLIENT
  CLIENT_NOT_FOUND: {
    message: 'Account not found.',
    code: 'CLIENT_00000',
  },
  CLIENT_EXISTED: {
    message: 'Account already existed.',
    code: 'CLIENT_00001',
  },
  CLIENT_HASH_NOT_MATCH: {
    message: 'Account address and hash message are not matched.',
    code: 'CLIENT_00002',
  },
  CLIENT_UNAUTHORIZED: {
    message: 'Unauthorized client.',
    code: 'CLIENT_00003',
  },
  CLIENT_LOCKED: {
    message: 'Client has been locked.',
    code: 'CLIENT_00004',
  },
  CLIENT_VERIFY_SIGNATURE_FAIL: {
    message: 'System has been failed to verify signature.',
    code: 'CLIENT_00005',
  },
  CLIENT_REFRESH_TOKEN_EXPIRED: {
    message: 'Refresh tokens is expired.',
    code: 'CLIENT_00006',
  },
  CLIENT_ACCESS_TOKEN_EXPIRED: {
    message: 'Refresh tokens is expired.',
    code: 'CLIENT_00007',
  },
  CLIENT_FORBIDDEN: {
    message: 'You are not authorized to access this resource.',
    code: 'CLIENT_00008',
  },
  CLIENT_EMAIL_EXISTED: {
    message: 'Email has been associated with an other account.',
    code: 'CLIENT_00009',
  },
  CLIENT_EMAIL_VERIFY_FAIL: {
    message: 'Failed to verify this email.',
    code: 'CLIENT_00010',
  },
  CLIENT_EMAIL_CONFIRM_NOT_FOUND: {
    message: 'Email request not found!',
    code: 'CLIENT_00011',
  },
  CLIENT_EMAIL_WAIT_TIME: {
    message: 'Too much request',
    code: 'CLIENT_00012',
  },
  CLIENT_WRONG_PASSWORD: {
    message: 'Password is incorrect',
    code: 'CLIENT_00013',
  },
  CLIENT_CODE_INVALID: {
    message: 'Verification code is invalid',
    code: 'CLIENT_00014',
  },
  CLIENT_EXPIRED_CODE: {
    message: `You've entered an incorrect code. Please note that current code will be expired if you enter it wrong 5 times in a row`,
    code: 'CLIENT_00015',
  },
  CLIENT_BANNED: {
    message: 'User has been banned.',
    code: 'CLIENT_00016',
  },
  CLIENT_UNVERIFIED: {
    message: 'Unverified user.',
    code: 'CLIENT_00017',
  },

  // ORDER
  ORDER_NOT_FOUND: {
    message: 'Order not found.',
    code: 'ORDER_00001',
  },
  ORDER_CANCEL_DENIED: {
    message: 'You do not have permission to cancel this order.',
    code: 'ORDER_00002',
  },
  ORDER_ALREADY_CANCELED: {
    message: 'This order have been already canceled and waiting to confirm.',
    code: 'ORDER_00003',
  },
  CLIENT_NOT_FOUND_WHEN_ORDER: {
    message: 'Client  not found or not active.',
    code: 'ORDER_00004',
  },

  //NOTE
  NOTE_NOT_FOUND: {
    message: 'Note not found.',
    code: 'NOTE_00001',
  },

  // FILE
  FILE_NOT_FOUND: {
    message: 'file not found.',
    code: 'FILE_00001',
  },

  // FACEBOOK
  FACEBOOK_TOKEN_INVALID_OR_EXPIRES: {
    message: 'Access token is invalid or expires.',
    code: 'FACEBOOK_00000',
  },

  // GOOGLE
  GOOGLE_TOKEN_INVALID_OR_EXPIRES: {
    message: 'Access token is invalid or expires.',
    code: 'GOOGLE_00000',
  },

  // ZALO
  ZALO_TOKEN_INVALID_OR_EXPIRES: {
    message: 'Access token is invalid or expires.',
    code: 'ZALO_00000',
  },

  // CATEGORY
  CATEGORY_EXISTED: {
    message: 'Category already existed.',
    code: 'CATEGORY_00000',
  },

  CATEGORY_NOT_FOUND: {
    message: 'Category not found.',
    code: 'CATEGORY_00001',
  },

  // PRODUCT_INFO
  PRODUCT_INFO_EXISTED: {
    message: 'Product info already existed.',
    code: 'PRODUCT_INFO_00000',
  },

  PRODUCT_INFO_NOT_FOUND: {
    message: 'Product info not found.',
    code: 'PRODUCT_INFO_00001',
  },

  // PRODUCT
  PRODUCT_EXISTED: {
    message: 'Product already existed.',
    code: 'PRODUCT_00000',
  },

  PRODUCT_NOT_FOUND: {
    message: 'Product not found.',
    code: 'PRODUCT_00001',
  },

  // CART
  CART_EXISTED: {
    message: 'Cart already existed.',
    code: 'CART_00000',
  },

  // SUPPLIER
  SUPPLIER_NOT_FOUND: {
    message: 'Supplier not found.',
    code: 'SUPPLIER_00000',
  },

  // ATTRIBUTE
  ATTRIBUTE_NOT_FOUND: {
    message: 'Attribute not found.',
    code: 'ATTRIBUTE_00000',
  },

  // SERVICE INFO
  SERVICE_NOT_FOUND: {
    message: 'Service info not found.',
    code: 'SERVICE_INFO_00000',
  },
  SERVICE_INFO_GROUP_NOT_FOUND: {
    message: 'Service info group not found.',
    code: 'SERVICE_INFO_GROUP_00001',
  },

  // PARTNER
  PARTNER_NOT_FOUND: {
    message: 'Partner not found.',
    code: 'PARTNER_00000',
  },

  // DEVICE
  DEVICE_NOT_FOUND: {
    message: 'Device not found.',
    code: 'DEVICE_00000',
  },

  // PARAM
  PARAM_NOT_FOUND: {
    message: 'Param not found.',
    code: 'PARAM_00000',
  },

  // CAPACITY
  CAPACITY_NOT_FOUND: {
    message: 'Capacity not found.',
    code: 'CAPACITY_00000',
  },

  // TYPE-SERVICE
  TYPE_NOT_FOUND: {
    message: 'Type service not found.',
    code: 'TYPE_SERVICE_00000',
  },

  // PROMOTIONAL
  PROMOTION_NOT_FOUND: {
    message: 'Promotion not found.',
    code: 'PROMOTION_00000',
  },

  // SHIPPING
  SHIPPING_NOT_FOUND: {
    message: 'Shipping not found.',
    code: 'SHIPPING_00000',
  },
  SHIPPING_METHOD_NOT_FOUND: {
    message: 'Shipping  method not found.',
    code: 'SHIPPING_00000',
  },

  // PERMISSION
  PERMISSION_NOT_FOUND: {
    message: 'Permission not found',
    code: 'PERMISSION_00000',
  },

  PERMISSION_EXISTED: {
    message: 'Permission existed',
    code: 'PERMISSION_00001',
  },
  PERMISSION_EDITED_DENIED: {
    message: 'You can not access this permission',
    code: 'PERMISSION_00002',
  },

  // PAYMENT
  PAYMENT_SESSION_NOT_FOUND: {
    message: 'Payment session not found.',
    code: 'PAYMENT_00000',
  },

  PAYMENT_INFO_NOT_FOUND: {
    message: 'Payment info not found.',
    code: 'PAYMENT_00001',
  },

  // CAMPAIGN
  CAMPAIGN_NOT_FOUND: {
    message: 'Campaign not found.',
    code: 'CAMPAIGN_00000',
  },

  // HOME
  HOME_NOT_FOUND: {
    message: 'Home not found.',
    code: 'HOME_00000',
  },
};
