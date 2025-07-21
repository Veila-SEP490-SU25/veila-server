import { ApiProperty } from '@nestjs/swagger';

export class HandlePayOSWebhook {
  orderCode: number; // Mã đơn hàng
  transactionDate: Date; // Thời gian xảy ra giao dịch phía ngân hàng
  content: string; // Nội dung chuyển khoản
  transferAmount: number; // Số tiền giao dịch
}

export class PayOSReturnDTO {
  @ApiProperty({ description: 'Payment Link Id' })
  id: string;
  @ApiProperty({ description: 'Mã lỗi giao dịch (00: Thành công, 01: Invalid Params)' })
  code: string;
  @ApiProperty({ description: 'Trạng thái hủy (true: Đã hủy, false: Đã thanh toán hoặc chờ)' })
  cancel: boolean;
  @ApiProperty({ description: 'Trạng thái thanh toán (PAID, PENDING, PROCESSING, CANCELLED)' })
  status: string;
  @ApiProperty({ description: 'Mã đơn hàng' })
  orderCode: number;
}
