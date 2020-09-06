import { compare, hash } from "bcryptjs";
import { Field, ID, ObjectType, Root } from "type-graphql";
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { v4 } from "uuid";

import { Permission } from "~/entity/role/permission.entity";
import { Role } from "~/entity/role/role.entity";

export interface ICreateUser {
  email: string;
  createdIP?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

const inet = process.env.NODE_ENV === "test" ? "text" : "inet";

@ObjectType()
@Entity("users")
export class User {
  static async create({ id, email, firstName, lastName, password, createdIP = "0.0.0.0" }: ICreateUser) {
    const user = new User(id);
    user.email = email.toLowerCase();
    user.firstName = firstName;
    user.lastName = lastName;
    user.createdIP = createdIP;
    if (password) await user.setPassword(password);
    return user;
  }

  private constructor(id?: string) {
    this.id = id ?? v4();
    this.tokenVersion = 0;
    this.isEmailConfirmed = false;
  }

  @Field(() => ID)
  @PrimaryColumn("uuid")
  id: string;

  @Field()
  @Column("text", { unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName?: string;

  @Field()
  @Column("boolean")
  isEmailConfirmed: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Column(inet, { nullable: true })
  lastLoginIP: string;

  @Column(inet, { nullable: true })
  createdIP: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column("int")
  tokenVersion: number;

  @ManyToMany(() => Role)
  @JoinTable({ name: "user_roles" })
  roles: Role[];

  @ManyToMany(() => Permission)
  @JoinTable({ name: "user_permissions" })
  permissions: Permission[];

  @Field()
  isActive(@Root() user: User): boolean {
    return user.isEmailConfirmed && !!user.password;
  }

  @Field(() => String!, { nullable: true })
  name(@Root() { firstName, lastName }: User): string | null {
    const name = [];
    if (firstName) name.push(firstName);
    if (lastName) name.push(lastName);
    return name.join(" ") || null;
  }

  async setPassword(password: string) {
    this.password = await hash(password, 12);
  }

  async verify(password: string) {
    if (!this.password) throw new Error("user must create password");
    if (!this.isActive(this)) throw new Error("user is not active");
    if (!(await compare(password, this.password))) throw new Error("invalid password");
  }
}