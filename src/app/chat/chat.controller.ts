import { CreateConversationDto, GetConversationDto } from '@/app/chat/chat.dto';
import { ChatService } from '@/app/chat/chat.service';
import { ItemResponse, ListResponse } from '@/common/base';
import {
  Filtering,
  FilteringParams,
  Pagination,
  PaginationParams,
  Sorting,
  SortingParams,
  UserId,
} from '@/common/decorators';
import { AuthGuard } from '@/common/guards';
import { Conversation } from '@/common/models';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@Controller('chats')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Chat Controller')
@ApiExtraModels(ItemResponse, ListResponse, Conversation, GetConversationDto)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo cuộc trò chuyện nếu chưa tồn tại' })
  @ApiCreatedResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ItemResponse) },
        {
          properties: {
            item: { $ref: getSchemaPath(Conversation) },
          },
        },
      ],
    },
  })
  async createConversation(
    @Body() body: CreateConversationDto,
  ): Promise<ItemResponse<Conversation>> {
    const conversation = await this.chatService.createConversationIfNotExists(body);
    return {
      message: 'Tạo cuộc trò chuyện thành công',
      statusCode: 201,
      item: conversation,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách cuộc trò chuyện của người dùng' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    default: 0,
    description: 'Trang hiện tại (bắt đầu từ 0)',
  })
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
    default: 10,
    description: 'Số lượng mỗi trang',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sắp xếp theo trường, ví dụ: name:asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Lọc theo trường, ví dụ: name:like:áo',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponse) },
        {
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(GetConversationDto) },
            },
          },
        },
      ],
    },
  })
  async getUserConversations(
    @UserId() userId: string,
    @PaginationParams() { page, size, limit, offset }: Pagination,
    @SortingParams([]) sort?: Sorting[],
    @FilteringParams([]) filter?: Filtering[],
  ): Promise<ListResponse<GetConversationDto>> {
    const [conversations, totalItems] = await this.chatService.getConversations(
      userId,
      limit,
      offset,
      sort,
      filter,
    );
    const totalPages = Math.ceil(totalItems / limit);
    return {
      message: 'Lấy danh sách cuộc trò chuyện thành công',
      statusCode: 200,
      pageIndex: page,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: page + 1 < totalPages,
      hasPrevPage: page > 0,
      items: conversations,
    };
  }
}
