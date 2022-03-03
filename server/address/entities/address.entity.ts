import { IsLatitude, IsLongitude, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from 'server/common/entities/core.entity';

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
}
