import { Entity } from "../core/Entity";
import { UniqueEntityID } from "../core/UniqueEntityID";

export type UserRole = 'CUSTOMER' | 'ADMIN';

interface UserProps {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
}

export class User extends Entity<UserProps> {
    private constructor(props: UserProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: UserProps, id?: UniqueEntityID): User {
        const user = new User({
            ...props,
            createdAt: props.createdAt ?? new Date()
        }, id);
        return user;
    }

    get name(): string { return this.props.name; }
    get email(): string { return this.props.email; }
    get passwordHash(): string { return this.props.passwordHash; }
    get role(): UserRole { return this.props.role; }
    get createdAt(): Date { return this.props.createdAt; }
    get id(): UniqueEntityID { return this._id; }

    toJSON() {
        return {
            id: this.id.toString(),
            name: this.name,
            email: this.email,
            role: this.role,
            createdAt: this.createdAt,
        };
    }
}