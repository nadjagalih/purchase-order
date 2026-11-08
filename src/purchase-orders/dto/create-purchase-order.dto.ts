import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';
import { PurchaseOrderStatus } from '../purchase-order.entity';

export class CreatePurchaseOrderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  orderNumber: string;

  @IsDateString()
  orderDate: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount: number;

  @IsEnum(PurchaseOrderStatus)
  status: PurchaseOrderStatus;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  supplierId: number;
}
