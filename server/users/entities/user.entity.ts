import { Expose } from 'class-transformer';
import { IsEnum, IsPhoneNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CoreEntity } from 'server/common/entities/core.entity';
import { Role } from 'server/auth/enum/role.enum';
import { Address } from 'server/address/entities/address.entity';

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

  @Column({ type: 'enum', enum: Role, default: Role.Client })
  @IsEnum(Role)
  @Expose()
  role: Role;

  @OneToMany((_type) => Address, (address) => address.user)
  addresses: Address[];

  @OneToOne((_type) => Address, (address) => address.id)
  @JoinColumn()
  defaultAddress: Address;
}
