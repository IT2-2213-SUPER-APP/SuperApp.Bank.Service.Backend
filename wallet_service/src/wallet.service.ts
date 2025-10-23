import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private readonly walletRepository: Repository<Wallet>
  ) {}
  
  async createWallet(createWalletDto: CreateWalletDto) {
    const wallet: Wallet = new Wallet();
    const date = new Date();
    const formatted = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
    });
    const cvv = Math.floor(Math.random() * 900) + 100;
    wallet.wallet_number = crypto.randomUUID().replaceAll('-', '').slice(0, 19);
    wallet.budget = 1000; // set 0 after development
    wallet.cvv = cvv;
    wallet.validity_period = formatted;
    wallet.user_id = createWalletDto.user_id;
    return this.walletRepository.save(wallet);
  }

  async getWallets(userId: number) {
    return this.walletRepository.findBy({ user_id: userId });
  }

  async removeWallet(walletId: number) {
    this.walletRepository.delete(walletId);
  }

  async doTransaction(
    fromCardNumber: string,
    toCardNumber: string, 
    amount: number
  ) {
    try {
      const fromWallet = await this.walletRepository.findOneBy({ wallet_number: fromCardNumber });
      const toWallet = await this.walletRepository.findOneBy({ wallet_number: toCardNumber });
      if (fromWallet && toWallet) {
        fromWallet.budget -= amount;
        toWallet.budget += amount;
      } else {
        throw new Error('Wallet not found');
      }
      await this.walletRepository.save(fromWallet);
      await this.walletRepository.save(toWallet);
    } catch (e) {
      console.log(e);
    }
  }
}
