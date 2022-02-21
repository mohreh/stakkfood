import { BeforeInsert, Column, Entity } from 'typeorm';
import { IsPhoneNumber, IsString } from 'class-validator';
import { CoreEntity } from 'server/common/entities/core.entity';

@Entity()
export class AuthCode extends CoreEntity {
  @Column()
  @IsString()
  pin: string;

  @Column({ unique: true })
  @IsPhoneNumber('IR')
  receptor: string;

  @Column({
    type: Date,
  })
  expireOn: Date;

  @BeforeInsert()
  setExpireDate() {
    this.expireOn = new Date(Date.now() + 30 * 1000);
  }
}
