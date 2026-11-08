import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  // Create a demo admin from .env when the app starts for the first time.
  async onModuleInit() {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');
    const name = this.config.get<string>('ADMIN_NAME', 'Administrator');

    if (!email || !password) {
      console.warn('ADMIN_EMAIL / ADMIN_PASSWORD belum diatur di .env');
      return;
    }

    const existing = await this.userRepository.findOne({ where: { email } });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userRepository.save(
        this.userRepository.create({ name, email, password: hashedPassword }),
      );
      console.log(`Demo admin created: ${email}`);
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return null;

    const passwordMatches = await bcrypt.compare(password, user.password);
    return passwordMatches ? user : null;
  }
}
