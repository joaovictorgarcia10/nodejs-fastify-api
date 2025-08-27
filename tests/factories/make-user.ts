import { db } from "../../src/database/client";
import { users } from "../../src/database/schema";
import { fakerPT_BR as faker } from "@faker-js/faker"
import jwt from 'jsonwebtoken'
import { hash } from "argon2";

export async function makeUser(role?: 'ADMIN' | 'USER') {
    const passwordBeforeHash = '123456'
    const passwordHash = await hash(passwordBeforeHash)

    const result = await db.insert(users).values({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: passwordHash,
        role,
    }).returning()

    return {
        user: result[0],
        passwordBeforeHash,
    }
}

export async function makeAuthenticatedUser(role: 'ADMIN' | 'USER') {
    const { user } = await makeUser(role)

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is required.')
    }

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET)

    return { user, token }
}