import { Body, Controller, Get, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { MembershipService } from './membership.service';
import { RegisterMembershipDto } from './membership.dto';
import { ItemResponse } from '@/common/base';
import { Membership, UserRole } from '@/common/models';
import { AuthGuard, RolesGuard } from '@/common/guards';
import { Roles, UserId } from '@/common/decorators';

@Controller('memberships')
@ApiTags('Membership Controller')
@ApiBearerAuth()
@ApiExtraModels(ItemResponse, Membership)
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('register')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Đăng ký gói membership mới',
    description: `
        **Hướng dẫn sử dụng:**
        
        - API để shop mua gói subscription mới.  
        - Nếu chưa có gói -> mua trực tiếp.  
        - Nếu đã có gói:  
        + Nếu gói hiện tại cao cấp hơn -> không cho phép mua.  
        + Nếu gói hiện tại rẻ hơn -> cần force = true để xác nhận mua.  
`,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            items: { $ref: getSchemaPath(Membership) },
          },
        },
      ],
    },
  })
  async registerMembership(
    @UserId() userId: string,
    @Body() body: RegisterMembershipDto,
  ): Promise<ItemResponse<Membership>> {
    const membership = await this.membershipService.purchaseMembership(userId, body);
    return {
      message: 'Đăng ký gói membership thành công',
      statusCode: HttpStatus.CREATED,
      item: membership,
    };
  }

  @Put('cancel')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Hủy membership hiện tại',
    description: `
            **Hướng dẫn sử dụng:**

            - API để shop hủy gói membership đang hoạt động.  
            - Nếu không có membership active -> trả về lỗi 404.  
            - Nếu có -> chuyển status = INACTIVE, kết thúc ngay.  
        `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            items: { example: null },
          },
        },
      ],
    },
  })
  async cancelMembership(@UserId() userId: string): Promise<ItemResponse<null>> {
    await this.membershipService.cancelMembership(userId);
    return {
      message: 'Membership đã được hủy thành công',
      statusCode: HttpStatus.OK,
      item: null,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @Roles(UserRole.SHOP)
  @ApiOperation({
    summary: 'Lấy thông tin membership của shop',
    description: `
        **Hướng dẫn sử dụng:**

        - API để lấy thông tin membership hiện tại của shop.
        - Nếu không có membership active -> trả về lỗi 404.
        - Nếu có -> trả về thông tin membership.
    `,
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            items: { $ref: getSchemaPath(Membership) },
          },
        },
      ],
    },
  })
  async getMembership(@UserId() userId: string): Promise<ItemResponse<Membership>> {
    const membership = await this.membershipService.getOwner(userId);
    return {
      message: 'Lấy thông tin membership thành công',
      statusCode: HttpStatus.OK,
      item: membership,
    };
  }
}
