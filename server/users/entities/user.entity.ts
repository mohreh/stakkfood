import { Expose } from 'class-transformer';
import { IsPhoneNumber, IsString } from 'class-validator';
import { CoreEntity } from 'server/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Entity() // we don't want user password and hashing, instead use custom auth method with phone number, maybe googleauth in future
export class User extends CoreEntity {
  @Column('varchar', { unique: true })
  @IsPhoneNumber('IR')
  @IsString()
  @Expose()
  phoneNumber: string;

  @Column({ nullable: true })
  @Expose()
  name: string;
}