import { expect, test } from 'vitest';
import request from 'supertest';
import { server } from '../../app.ts';
import { fakerPT_BR as faker } from "@faker-js/faker"


test('POST /courses', async () => {
    await server.ready()

    const response = await request(server.server)
        .post('/courses')
        .set('Content-Type', 'application/json')
        .send({
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
        });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('courseId');
});