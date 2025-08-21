import { expect, test } from 'vitest';
import request from 'supertest';
import { server } from '../../app.ts';
import { fakerPT_BR as faker } from "@faker-js/faker"

test('POST /users', async () => {
    await server.ready()

    const response = await request(server.server)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 6 }),
            role: 'USER'
        });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId');
});

test('POST /users - should return 400 for invalid email', async () => {
    await server.ready()

    const response = await request(server.server)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send({
            name: faker.person.fullName(),
            email: 'invalid-email',
            password: faker.internet.password({ length: 8 }),
            role: 'USER'
        });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
});

test('POST /users - should return 400 for short password', async () => {
    await server.ready()

    const response = await request(server.server)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: '123',
            role: 'USER'
        });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
});