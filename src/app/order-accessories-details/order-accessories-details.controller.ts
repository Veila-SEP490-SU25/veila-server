import { Controller } from '@nestjs/common';
import { OrderAccessoriesDetailsService } from './order-accessories-details.service';

@Controller('order-accessories-details')
export class OrderAccessoriesDetailsController {
  constructor(private readonly orderAccessoriesDetailsService: OrderAccessoriesDetailsService) {}
}
