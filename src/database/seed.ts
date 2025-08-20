import { db } from "./client"
import { courses, enrollments, users } from "./schema"
import { fakerPT_BR as faker } from "@faker-js/faker"
import { hash } from "argon2"

async function seed() {
    try {
        const hashPassword = await hash("123456");

        // Seed users
        const usersInsert = await db.insert(users).values([
            { name: faker.person.fullName(), email: faker.internet.email(), role: 'USER', password: hashPassword },
            { name: faker.person.fullName(), email: faker.internet.email(), role: 'USER', password: hashPassword },
            { name: faker.person.fullName(), email: faker.internet.email(), role: 'USER', password: hashPassword },
            { name: faker.person.fullName(), email: faker.internet.email(), role: 'USER', password: hashPassword },
            { name: faker.person.fullName(), email: faker.internet.email(), role: 'USER', password: hashPassword },
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

    } catch (error) {
        console.error("Seed Error:", error);
    }
}

seed()