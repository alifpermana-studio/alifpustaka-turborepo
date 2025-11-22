// types/next-auth.d.ts
import { JsonValue } from '@prisma/client/runtime/library';
import NextAuth from 'next-auth';
import {
  Role,
  RoleStatus,
  Status,
  UserRole,
  UserRoleChangeReq,
  UserStatus,
  UserStatusChangeReq,
} from '@prisma/client';
import { number } from 'framer-motion';

declare module 'next-auth' {
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    fname?: string | null;
    lname?: string | null;
    email?: string | null;
    username: string;
    emailVerified?: Date | null;
    phone?: string | null;
    password?: string | null;
    image?: string | null;
    userRole: UserRole;
    userStatus: UserStatus;
    social?: Social | null;
    address?: Address | null;
    createdAt?: string | null;
    bio?: string | null;
    expires?: number | null;
  }

  interface JWT {
    id: string;
    fname?: string | null;
    lname?: string | null;
    email?: string | null;
    username?: string | null;
    emailVerified?: Date | null;
    phone?: string | null;
    image?: string | null;
    userRole: UserRole;
    userStatus: UserStatus;
    bio?: string | null;
    social?: Social | null;
    address?: Address | null;
    expires?: number | null;
  }

  interface Social {
    facebook?: string | null;
    x?: string | null;
    linkedin?: string | null;
    github?: string | null;
    instagram?: string | null;
    tiktok?: string | null;
  }

  interface Address {
    country?: string | null;
    city?: string | null;
    province?: string | null;
    taxId?: string | null;
    postCode?: string | null;
  }

  interface UserFilter {
    sort: string | null;
    order: string | null;
    search: string | null;
    max: number;
    skip: number;
  }

  interface FormDataType extends User {
    roleReq: UserRoleType;
    statusReq: UserStatusType;
  }

  interface UserRoleType {
    reqUserRole: UserRole;
    reqMsg: string | null;
  }

  interface UserStatusType {
    reqUserStatus: UserStatus;
    reqMsg: string | null;
  }

  interface userOnAdminType extends User {
    roleReq: userRoleOnAdmin[];
    actionedRoleReq: actionedRoleReq[];
    statusReq: userStatusOnAdmin[];
    actionedStatusReq: actionedStatusReq[];
  }
  /* 
  interface userStatusOnAdmin {
    id: string;
  } */

  interface userRoleOnAdmin {
    id: string;
    reqUserRole: UserRole;
    reqById: string;
    reqMsg: string;
    resUserRole: UserRole;
    resById: string;
    resMsg: string;
    status: Status;
    updatedAt: DateTime;
  }

  interface userStatusOnAdmin {
    id: string;
    reqUserStatus: UserStatus;
    reqById: string;
    reqMsg: string;
    resUserStatus: UserStatus;
    resById: string;
    resMsg: string;
    status: Status;
    updatedAt: DateTime;
  }
}
