import { Body, Controller, Get, Param, Post, Query, Render, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SuppliersService } from './suppliers.service';

@Controller('suppliers')
@UseGuards(AuthGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @Render('suppliers/index')
  async index(@Query('search') search = '') {
    return { title: 'Supplier', suppliers: await this.suppliersService.findAll(search), search };
  }

  @Get('new')
  @Render('suppliers/create')
  createPage() {
    return { title: 'Tambah Supplier' };
  }

  @Post()
  async create(@Body() body: CreateSupplierDto, @Res() res: Response) {
    await this.suppliersService.create(body);
    return res.redirect('/suppliers');
  }

  @Get(':id/edit')
  @Render('suppliers/edit')
  async editPage(@Param('id') id: string) {
    return { title: 'Edit Supplier', supplier: await this.suppliersService.findOne(Number(id)) };
  }

  @Post(':id/update')
  async update(@Param('id') id: string, @Body() body: CreateSupplierDto, @Res() res: Response) {
    await this.suppliersService.update(Number(id), body);
    return res.redirect('/suppliers');
  }

  @Post(':id/delete')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.suppliersService.remove(Number(id));
    return res.redirect('/suppliers');
  }

  @Get(':id')
  @Render('suppliers/show')
  async show(@Param('id') id: string) {
    return { title: 'Detail Supplier', supplier: await this.suppliersService.findOne(Number(id)) };
  }
}
