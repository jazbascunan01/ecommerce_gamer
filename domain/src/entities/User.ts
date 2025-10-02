export type UserRole = 'client' | 'admin';

export class User {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public passwordHash: string,
        public role: UserRole,
        public createdAt: Date
    ) {
        if (!['client', 'admin'].includes(role)) {
            throw new Error(`Invalid role: ${role}`);
        }
    }
}