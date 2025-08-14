import { db } from "./client"
import { courses, enrollments, users } from "./schema"
import { fakerPT_BR as faker } from "@faker-js/faker"

async function seed() {
    try {
        console.log("Iniciando seed do banco de dados...");

        // Test database connection first
        console.log("Testando conexão com o banco...");

        // Add a simple connection test
        await db.select().from(users).limit(1);
        console.log("Conexão com o banco estabelecida!");

        // Clear existing data (optional)
        console.log("Limpando dados existentes...");
        await db.delete(enrollments);
        await db.delete(courses);
        await db.delete(users);

        // Seed users
        const usersInsert = await db.insert(users).values([
            { name: faker.person.fullName(), email: faker.internet.email() },
            { name: faker.person.fullName(), email: faker.internet.email() },
            { name: faker.person.fullName(), email: faker.internet.email() },
            { name: faker.person.fullName(), email: faker.internet.email() },
            { name: faker.person.fullName(), email: faker.internet.email() },
        ]).returning()

        console.log(`${usersInsert.length} usuários criados`);

        // Seed courses
        const coursesInsert = await db.insert(courses).values([
            { title: faker.lorem.sentence(), description: faker.lorem.paragraph() },
            { title: faker.lorem.sentence(), description: faker.lorem.paragraph() },
        ]).returning()

        console.log(`${coursesInsert.length} cursos criados`);

        // Seed enrollments
        const enrollmentsInsert = await db.insert(enrollments).values([
            { userId: usersInsert[0].id, courseId: coursesInsert[0].id },
            { userId: usersInsert[1].id, courseId: coursesInsert[0].id },
            { userId: usersInsert[2].id, courseId: coursesInsert[1].id },
        ]).returning()

        console.log(`${enrollmentsInsert.length} matrículas criadas`);
        console.log("Seed concluído!");

        process.exit(0);
    } catch (error) {
        console.error("Erro durante o seed:", error);
        process.exit(1);
    }
}

seed()