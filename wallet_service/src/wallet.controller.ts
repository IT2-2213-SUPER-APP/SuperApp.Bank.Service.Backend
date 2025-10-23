import { 
  Controller, 
  Get, 
  Post, 
  Put,
  Param, 
  Body,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async create(@Body() createWalletDto: CreateWalletDto) {
    return await this.walletService.createWallet(createWalletDto);
  }

  @Get('/:userId')
  async getWallets(
    @Param('userId') userId: number,
  ) {
    const resBody = await this.walletService.getWallets(userId);
    return { walletArray: resBody };
  }

  @Put() 
  async transaction(
    @Req() req: Request,
  ) {
    await this.walletService.doTransaction(
      req.body.from_card,
      req.body.to_card,
      req.body.amount
    );
  }
}
