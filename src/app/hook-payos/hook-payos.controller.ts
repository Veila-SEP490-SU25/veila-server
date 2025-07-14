// import { Public } from "@/decorator/customize"
// import responses from "@/helpers/responses"
// import { MessageResponseType } from "@/schemas/root.validation"
// import { Body, Controller, Patch, Post, Req } from "@nestjs/common"
// import {
//   ApiBadRequestResponse,
//   ApiBody,
//   ApiConflictResponse,
//   ApiNotFoundResponse,
//   ApiOkResponse,
//   ApiOperation,
//   ApiTags
// } from "@nestjs/swagger"
// import { WebhookType } from "@payos/node/lib/type"
// import { HandlePayOSWebhook, PayOSReturnDTO } from "@/app/hook-payos/hook-payos.dto"
// import { HookPayosService } from "./hook-payos.service"

// @ApiTags("Order")
// @Controller("hook-payos")
export class HookPayosController {
  //   constructor(private readonly hookPayosService: HookPayosService) {}
  //   @Post("receive-hook")
  //   @Public()
  //   @ApiOperation({ summary: "Handle PayOS Webhook | For PayOS Webhook used api", operationId: "handlePayOSWebhook" })
  //   @ApiOkResponse({ description: "Webhook processed successfully" })
  //   @ApiNotFoundResponse({
  //     description: "Order Id not found in webhook content | Payment is not found or amount mismatch"
  //   })
  //   @ApiConflictResponse({ description: "Webhook is already processed" })
  //   async handlePayosWebhook(@Req() req: Request): Promise<MessageResponseType> {
  //     const dataCallback = req.body as unknown as WebhookType
  //     const dataRequest: HandlePayOSWebhook = {
  //       orderCode: dataCallback.data.orderCode,
  //       transactionDate: new Date(),
  //       content: dataCallback.data.description,
  //       transferAmount: dataCallback.data.amount
  //     }
  //     const response = await this.hookPayosService.handlePayOSWebhook(dataRequest)
  //     return responses.response200Message(response)
  //   }
  //   @Post("confirm-hook")
  //   @Public()
  //   @ApiOperation({
  //     summary: "Confirm PayOS Webhook Url | For PayOS Webhook used api",
  //     operationId: "handlePayosWebhookConfirm"
  //   })
  //   @ApiOkResponse({ description: "Webhook confirmed successfully" })
  //   async handlePayosWebhookConfirm(): Promise<any> {
  //     const response = await this.hookPayosService.confirmWebhook()
  //     return responses.response200Data("Success", response)
  //   }
  //   @Patch("return-hook")
  //   @Public()
  //   @ApiOperation({
  //     summary: "Return PayOS Webhook Url | For client manually used api",
  //     operationId: "handlePayosWebhookReturn"
  //   })
  //   @ApiBody({ type: PayOSReturnDTO })
  //   @ApiOkResponse({ description: "Webhook returned successfully" })
  //   @ApiBadRequestResponse({ description: "Invalid transaction" })
  //   async handlePayosWebhookReturn(@Body() data: PayOSReturnDTO): Promise<MessageResponseType> {
  //     await this.hookPayosService.returnWebhook(data)
  //     return responses.response200Message("Webhook returned successfully")
  //   }
}
