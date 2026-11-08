import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Supplier } from '../suppliers/supplier.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { PurchaseOrder, PurchaseOrderStatus } from './purchase-order.entity';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  findAll(search = '', status = '') {
    const query = this.purchaseOrderRepository
      .createQueryBuilder('purchaseOrder')
      .leftJoinAndSelect('purchaseOrder.supplier', 'supplier')
      .orderBy('purchaseOrder.id', 'DESC');

    if (search) {
      query.andWhere(
        new Brackets((where) => {
          where.where('purchaseOrder.orderNumber LIKE :search', { search: `%${search}%` })
            .orWhere('supplier.name LIKE :search', { search: `%${search}%` });
        }),
      );
    }
    if (status && Object.values(PurchaseOrderStatus).includes(status as PurchaseOrderStatus)) {
      query.andWhere('purchaseOrder.status = :status', { status });
    }
    return query.getMany();
  }

  async findOne(id: number) {
    const purchaseOrder = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: { supplier: true },
    });
    if (!purchaseOrder) throw new NotFoundException('Purchase order tidak ditemukan.');
    return purchaseOrder;
  }

  private async getSupplier(id: number) {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier yang dipilih tidak ditemukan.');
    return supplier;
  }

  async create(data: CreatePurchaseOrderDto) {
    const supplier = await this.getSupplier(data.supplierId);
    return this.purchaseOrderRepository.save(this.purchaseOrderRepository.create({
      orderNumber: data.orderNumber,
      orderDate: data.orderDate,
      totalAmount: String(data.totalAmount),
      status: data.status,
      supplier,
    }));
  }

  async update(id: number, data: CreatePurchaseOrderDto) {
    const purchaseOrder = await this.findOne(id);
    purchaseOrder.orderNumber = data.orderNumber;
    purchaseOrder.orderDate = data.orderDate;
    purchaseOrder.totalAmount = String(data.totalAmount);
    purchaseOrder.status = data.status;
    purchaseOrder.supplier = await this.getSupplier(data.supplierId);
    return this.purchaseOrderRepository.save(purchaseOrder);
  }

  async remove(id: number) {
    await this.purchaseOrderRepository.remove(await this.findOne(id));
  }

  count() {
    return this.purchaseOrderRepository.count();
  }

  getSuppliers() {
    return this.supplierRepository.find({ order: { name: 'ASC' } });
  }
}
