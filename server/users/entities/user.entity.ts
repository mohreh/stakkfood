import { Expose } from 'class-transformer';
import { IsPhoneNumber, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from 'server/common/entities/core.entity';

@Entity()
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
