import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../common/guards/auth.guard';
import { SuppliersService } from '../suppliers/suppliers.service';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';

@Controller()
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(
    private readonly suppliersService: SuppliersService,
    private readonly purchaseOrdersService: PurchaseOrdersService,
  ) { }

  @Get()
  @Render('dashboard/index')
  async index(@Req() req: Request) {
    const [supplierCount, purchaseOrderCount] = await Promise.all([
      this.suppliersService.count(),
      this.purchaseOrdersService.count(),
    ]);

    return {
      title: 'Dashboard',
      supplierCount,
      purchaseOrderCount,
      sessionUserName: req.session.userName,
    };
  }
}
