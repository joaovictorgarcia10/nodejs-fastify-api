
import { test, expect } from 'vitest'
import request from 'supertest'
import { server } from '../../app'
import { makeAuthenticatedUser } from '../../../tests/factories/make-user'
import { makeCourse } from '../../../tests/factories/make-course'

test('get course by id', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser('USER')
    const course = await makeCourse()

    const response = await request(server.server)
        .get(`/courses/${course.id}`)
        .set('Authorization', token)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
        course: {
            id: expect.any(String),
            title: expect.any(String),
            description: null,
        }
    })
})

test('return 404 for non existing courses', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser('USER')

    const response = await request(server.server)
        .get(`/courses/CBA2E131-C83C-471A-9DAC-4F4A84B55476`)
        .set('Authorization', token)

    expect(response.status).toEqual(404)
})
