import prisma from "../src/config/prisma.js";
import { hashPassword } from "../src/utils/hash.js";

async function main() {
    const adminPassword = await hashPassword("admin123");
    const userPassword = await hashPassword("user123");

    await prisma.user.createMany({
        data: [
        {
            name: "Admin",
            email: "admin@mail.com",
            password: adminPassword,
            role: "ADMIN",
        },
        {
            name: "User",
            email: "user@mail.com",
            password: userPassword,
            role: "USER",
        },
        ],
    });

    console.log("Seed admin & user berhasil");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
