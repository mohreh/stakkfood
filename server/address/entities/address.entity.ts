import { IsLatitude, IsLongitude, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Expose } from 'class-transformer';
import { CoreEntity } from 'server/common/entities/core.entity';
import { User } from 'server/users/entities/user.entity';

@Entity()
export class Address extends CoreEntity {
  @Column()
  @IsString()
  @Expose()
  description: string;

  @Column()
  @IsLongitude()
  @Expose()
  longitude: number;

  @Column()
  @IsLatitude()
  @Expose()
  latitude: number;

  @ManyToOne((_type) => User, (user) => user.id, { nullable: true })
  @JoinColumn()
  user: User;
}
