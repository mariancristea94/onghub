import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Organization } from 'src/modules/organization/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', name: 'cognito_id' })
  cognitoId: string;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @Column({ type: 'varchar', name: 'phone' })
  phone: string;

  /* ROLE will be handled differently, depending who is creating the user

    1. Creating a new organization will also create the admin (with role Admin)
    2. Creating a new user by the ONG Admin will create employee

  */
  @Column({ type: 'enum', enum: Role, name: 'role' })
  role: Role;

  @Column({
    type: 'enum',
    enum: UserStatus,
    name: 'status',
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Exclude()
  @Column({ type: 'integer', nullable: true, name: 'organization_id' })
  organizationId: number;

  @ManyToOne((type) => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}