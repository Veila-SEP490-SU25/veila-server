import { AccessoryStatus } from '@/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ItemAccessoryDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  images: string | null;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description: string | null;

  @Expose()
  @ApiProperty()
  sellPrice: number;

  @Expose()
  @ApiProperty()
  rentalPrice: number;

  @Expose()
  @ApiProperty()
  isSellable: boolean;

  @Expose()
  @ApiProperty()
  isRentable: boolean;

  @Expose()
  @ApiProperty()
  status: AccessoryStatus;
}

export class CUAccessoryDto {
  @ApiProperty()
  categoryId: string | null;

  @ApiProperty()
  images: string | null;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  sellPrice: number;

  @ApiProperty()
  rentalPrice: number;

  @ApiProperty()
  isSellable: boolean;

  @ApiProperty()
  isRentable: boolean;

  @ApiProperty()
  status: AccessoryStatus;
}

export class ListAccessoryDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  images: string | null;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  sellPrice: number;

  @Expose()
  @ApiProperty()
  rentalPrice: number;

  @Expose()
  @ApiProperty()
  isSellable: boolean;

  @Expose()
  @ApiProperty()
  isRentable: boolean;

  @Expose()
  @ApiProperty()
  status: AccessoryStatus;
}
