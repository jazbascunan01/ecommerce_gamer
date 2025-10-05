import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    // --- Seed Products ---
    const productsData = [
        {
            id: 'product-1',
            name: 'Teclado Mecánico RGB',
            description: 'Teclado mecánico con switches rojos, retroiluminación RGB personalizable y layout en español.',
            price: 89.99,
            stock: 10,
        },
        {
            id: 'product-2',
            name: 'Mouse Gamer Pro',
            description: 'Mouse ergonómico con sensor óptico de 16,000 DPI y 6 botones programables.',
            price: 49.99,
            stock: 5,
        },
        {
            id: 'product-3',
            name: 'Monitor Ultrawide 144Hz',
            description: 'Monitor curvo de 34 pulgadas, resolución 3440x1440 y 144Hz de tasa de refresco.',
            price: 450.00,
            stock: 3,
        },
    ];

    for (const p of productsData) {
        const product = await prisma.product.upsert({
            where: { id: p.id },
            update: {},
            create: p,
        });
        console.log(`Created/updated product with id: ${product.id}`);
    }

    // --- Seed Users ---
    console.log('Seeding users...');
    const passwordHash = await bcrypt.hash('password123', 10); // Same password for both


    const usersData = [
        {
            id: 'user-customer-1',
            name: 'Test Customer',
            email: 'customer@example.com',
            passwordHash: passwordHash,
            role: 'CUSTOMER',
        },
        {
            id: 'user-admin-1',
            name: 'Test Admin',
            email: 'admin@example.com',
            passwordHash: passwordHash,
            role: 'ADMIN',
        }
    ];

    for (const u of usersData) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                // Si quieres asegurarte de que el rol y la contraseña estén siempre actualizados
                role: u.role,
                passwordHash: u.passwordHash,
            },
            create: u,
        });
        console.log(`Created/updated user with email: ${user.email} (Role: ${user.role})`);
    }

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });