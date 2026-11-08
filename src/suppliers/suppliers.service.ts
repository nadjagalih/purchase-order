import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Supplier } from './supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  findAll(search = '') {
    return this.supplierRepository.find({
      where: search ? { name: Like(`%${search}%`) } : {},
      relations: { purchaseOrders: true },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: { purchaseOrders: true },
    });
    if (!supplier) throw new NotFoundException('Supplier tidak ditemukan.');
    return supplier;
  }

  create(data: CreateSupplierDto) {
    return this.supplierRepository.save(this.supplierRepository.create(data));
  }

  async update(id: number, data: CreateSupplierDto) {
    const supplier = await this.findOne(id);
    Object.assign(supplier, data);
    return this.supplierRepository.save(supplier);
  }

  async remove(id: number) {
    const supplier = await this.findOne(id);
    await this.supplierRepository.remove(supplier);
  }

  count() {
    return this.supplierRepository.count();
  }
}
