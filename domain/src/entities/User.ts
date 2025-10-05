export type UserRole = 'CUSTOMER' | 'ADMIN';

export class User {
    constructor(
        public id: string | undefined, // El ID puede no existir al crear un nuevo usuario
        public name: string,
        public email: string,
        public passwordHash: string,
        public role: UserRole,
        public createdAt: Date = new Date() // Si no se provee, se usa la fecha actual
    ) {

    }
}