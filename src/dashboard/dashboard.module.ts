import { Module } from '@nestjs/common';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [SuppliersModule, PurchaseOrdersModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
