import { expect, test } from 'vitest';
import request from 'supertest';
import { server } from '../../app.ts';
import { fakerPT_BR as faker } from "@faker-js/faker"
import { makeCourse } from '../../../tests/factories/make-course.ts';


test('GET /courses/:id', async () => {
    await server.ready()

    const course = await makeCourse(faker.lorem.words(4));

    const response = await request(server.server)
        .get(`/courses/${course.id}`)
        .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
        course: {
            id: course.id,
            title: course.title,
            description: course.description ?? null
        }
    });
});

test('return 404 for non existing courses', async () => {
    await server.ready()

    const response = await request(server.server)
        .get(`/courses/CBA2E131-C83C-471A-9DAC-4F4A84B55476`)

    expect(response.status).toEqual(404)
})