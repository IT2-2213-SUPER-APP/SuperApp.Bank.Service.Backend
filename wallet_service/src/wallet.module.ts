import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: '123456789',
      username: 'admin',
      entities: [Wallet],
      database: 'mydb',
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Wallet])
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
