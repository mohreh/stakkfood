import { Exclude, Expose } from 'class-transformer';
import {
  BeforeInsert,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { idGenerator } from '../nanoid';

export class CoreEntity {
  @PrimaryColumn('varchar')
  @Expose()
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  setId() {
    this.id = idGenerator();
  }
}
