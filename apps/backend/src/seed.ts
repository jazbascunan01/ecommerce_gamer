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
    const passwordHash = await bcrypt.hash('password123', 10);
    const userData = {
        id: 'user-test-1',
        name: 'Test User',
        email: 'testuser@example.com',
        passwordHash: passwordHash,
        role: 'CUSTOMER',
    };

    const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData,
    });
    console.log(`Created/updated user with email: ${user.email}`);

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