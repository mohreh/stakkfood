import { Expose } from 'class-transformer';
import { IsObject, IsString } from 'class-validator';
import { Column, Entity, OneToOne } from 'typeorm';
import { CoreEntity } from 'server/common/entities/core.entity';
import { User } from 'server/users/entities/user.entity';

@Entity()
export class Restaurant extends CoreEntity {
  @Column()
  @IsString()
  @Expose()
  name: string;

  @Column()
  @OneToOne((_type) => User, (user) => user.id, { nullable: false })
  @Expose()
  owner: User;
}
