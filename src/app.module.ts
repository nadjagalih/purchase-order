import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { User } from './auth/user.entity';
import { Supplier } from './suppliers/supplier.entity';
import { PurchaseOrder } from './purchase-orders/purchase-order.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', '127.0.0.1'),
        port: Number(config.get<string>('DB_PORT', '3306')),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_DATABASE', 'nestjs_product_management'),
        entities: [User, Supplier, PurchaseOrder],
        synchronize: true,
        retryAttempts: 5,
      }),
    }),
    AuthModule,
    SuppliersModule,
    PurchaseOrdersModule,
    DashboardModule,
  ],
})
export class AppModule {}
