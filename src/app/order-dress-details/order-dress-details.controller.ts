import { Controller } from '@nestjs/common';
import { OrderDressDetailsService } from './order-dress-details.service';

@Controller('order-dress-details')
export class OrderDressDetailsController {
  constructor(private readonly orderDressDetailsService: OrderDressDetailsService) {}
}
