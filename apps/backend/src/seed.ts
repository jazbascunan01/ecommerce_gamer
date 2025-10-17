import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    const productsData = [
        {
            id: 'product-1',
            name: 'Teclado Mecánico RGB',
            description: 'Teclado mecánico con switches rojos, retroiluminación RGB personalizable y layout en español.',
            price: 89.99,
            stock: 15,
            imageUrl: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=1935&auto=format&fit=crop',        },
        {
            id: 'product-2',
            name: 'Mouse Gamer Pro',
            description: 'Mouse ergonómico con sensor óptico de 16,000 DPI y 6 botones programables.',
            price: 49.99,
            stock: 30,
            imageUrl: 'https://images.unsplash.com/photo-1694175640153-00c83f4a36ef?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2080',        },

        {
            id: 'product-3',
            name: 'Monitor Ultrawide 144Hz',
            description: 'Monitor curvo de 34 pulgadas, resolución 3440x1440 y 144Hz de tasa de refresco.',
            price: 450.50,
            stock: 10,
            imageUrl: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=1964&auto=format&fit=crop",
        },
    ];

    for (const p of productsData) {
        const product = await prisma.product.upsert({
            where: { id: p.id },
            update: p,
            create: p,
        });
        console.log(`Created/updated product with id: ${product.id}`);
    }

    console.log('Seeding users...');
    const passwordHash = await bcrypt.hash('password123', 10);


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