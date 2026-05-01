import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
    INSTRUCTOR = "INSTRUCTOR",
    USER = "USER",
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
}

// Auth providers
export interface IAuthProvider {
    provider: string;  // "Google", "Credential"
    providerId: string;
}

// Main user interface
export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    bio?: string;
    travelInterests?: string[];
    address?: string;
    isDeleted?: boolean;
    isActive?: IsActive;
    isVerified?: boolean;
    role: Role;
    auths: IAuthProvider[];

}
