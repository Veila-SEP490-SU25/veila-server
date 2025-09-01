import { VonageController } from "@/app/voyage/vonage.controller";
import { VonageService } from "@/app/voyage/vonage.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [VonageController],
  providers: [VonageService],
  exports: [VonageService],
})
export class VonageModule {}