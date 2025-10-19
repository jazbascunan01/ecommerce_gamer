import { User } from "@domain/entities/User";
import { IUserFinder } from "@domain/services/IPersistence";
import prisma from "../prisma-client";
import { UniqueEntityID } from "@domain/core/UniqueEntityID";
import { User as PrismaUser } from "@prisma/client";

const mapToDomain = (userData: PrismaUser): User => {
    try {
        return User.create({
            name: userData.name,
            email: userData.email,
            passwordHash: userData.passwordHash,
            role: userData.role as any,
            createdAt: userData.createdAt
        }, new UniqueEntityID(userData.id));
    } catch (error: any) {
        console.error(`Data integrity issue for user ${userData.id}: ${error.message}`);
        throw new Error(`Failed to map database data to User entity for user ID ${userData.id}.`);
    }
};

export class PrismaUserRepository implements IUserFinder {
    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        return mapToDomain(user);
    }

    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        return mapToDomain(user);
    }
}