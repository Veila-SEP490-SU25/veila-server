import { ItemResponse, ListResponse } from "@/common/base";
import { Shop } from "@/common/models";
import { Controller } from "@nestjs/common";
import { ApiExtraModels } from "@nestjs/swagger";
import { ShopService } from "@/app/shop/shop.service";

@Controller('shops')
@ApiExtraModels(ItemResponse,ListResponse,Shop)
export class ShopController {
    constructor(private readonly shopService: ShopService){}
    
}