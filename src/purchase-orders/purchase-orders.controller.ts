import { Body, Controller, Get, Param, Post, Query, Render, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { PurchaseOrderStatus } from './purchase-order.entity';
import { PurchaseOrdersService } from './purchase-orders.service';

@Controller('purchase-orders')
@UseGuards(AuthGuard)
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get()
  @Render('purchase-orders/index')
  async index(@Query('search') search = '', @Query('status') status = '') {
    return {
      title: 'Purchase Order',
      purchaseOrders: await this.purchaseOrdersService.findAll(search, status),
      search,
      status,
      statuses: Object.values(PurchaseOrderStatus),
    };
  }

  @Get('new')
  @Render('purchase-orders/create')
  async createPage() {
    return { title: 'Tambah Purchase Order', suppliers: await this.purchaseOrdersService.getSuppliers(), statuses: Object.values(PurchaseOrderStatus) };
  }

  @Post()
  async create(@Body() body: CreatePurchaseOrderDto, @Res() res: Response) {
    await this.purchaseOrdersService.create(body);
    return res.redirect('/purchase-orders');
  }

  @Get(':id/edit')
  @Render('purchase-orders/edit')
  async editPage(@Param('id') id: string) {
    return { title: 'Edit Purchase Order', purchaseOrder: await this.purchaseOrdersService.findOne(Number(id)), suppliers: await this.purchaseOrdersService.getSuppliers(), statuses: Object.values(PurchaseOrderStatus) };
  }

  @Post(':id/update')
  async update(@Param('id') id: string, @Body() body: CreatePurchaseOrderDto, @Res() res: Response) {
    await this.purchaseOrdersService.update(Number(id), body);
    return res.redirect('/purchase-orders');
  }

  @Post(':id/delete')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.purchaseOrdersService.remove(Number(id));
    return res.redirect('/purchase-orders');
  }

  @Get(':id')
  @Render('purchase-orders/show')
  async show(@Param('id') id: string) {
    return { title: 'Detail Purchase Order', purchaseOrder: await this.purchaseOrdersService.findOne(Number(id)) };
  }
}
