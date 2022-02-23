import { Expose } from 'class-transformer';
import { IsEnum, IsPhoneNumber, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from 'server/common/entities/core.entity';
import { Role } from 'server/auth/enum/role.enum';

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
}
