import { IsLatitude, IsLongitude, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from 'server/common/entities/core.entity';
import { User } from 'server/users/entities/user.entity';

@Entity()
export class Address extends CoreEntity {
  @Column()
  @IsString()
  description: string;

  @Column()
  @IsLongitude()
  longitude: number;

  @Column()
  @IsLatitude()
  latitude: number;

  @ManyToOne((_type) => User, (user) => user.id, { nullable: true })
  @JoinColumn()
  user: User;
}
