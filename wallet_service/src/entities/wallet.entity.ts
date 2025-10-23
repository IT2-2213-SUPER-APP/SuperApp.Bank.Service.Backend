import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn()
    wallet_id: number;

    @Column({ type: 'varchar', length: 19 })
    wallet_number: string;

    @Column({ type: 'int' })
    budget: number;

    @Column({ type: 'varchar', length: 5 })
    validity_period: string;

    @Column({ type: 'int' })
    cvv: number;

    @Column({ type: 'int' })
    user_id: number;
}
