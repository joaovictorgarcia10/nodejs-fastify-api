import { test, expect } from 'vitest'
import request from 'supertest'
import { makeAuthenticatedUser } from '../../../tests/factories/make-user'
import { makeCourse } from '../../../tests/factories/make-course'
import { server } from '../../app'
import { db } from '../../database/client'
import { enrollments } from '../../database/schema'
import { faker } from '@faker-js/faker'
import { makeEnrollment } from '../../../tests/factories/make-enrollment'


test('get user enrollments', async () => {
    await server.ready()

    const { token, user } = await makeAuthenticatedUser('USER')
    const course1 = await makeCourse(faker.lorem.words(5))
    const course2 = await makeCourse(faker.lorem.words(5))

    // Create enrollments
    await makeEnrollment(user.id, course1.id)
    await makeEnrollment(user.id, course2.id)

    const response = await request(server.server)
        .get('/enrollments')
        .set('Authorization', token)

    expect(response.status).toEqual(200)
    expect(response.body.enrollments).toHaveLength(2)
    expect(response.body.enrollments[0]).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        course: {
            id: expect.any(String),
            title: expect.any(String),
            description: null,
        }
    })
    expect(response.body.total).toEqual(2)
})

test('get enrollments with search filter', async () => {
    await server.ready()

    const { token, user } = await makeAuthenticatedUser('USER')
    const course1 = await makeCourse('JavaScript' + faker.lorem.words(5))
    const course2 = await makeCourse('Python Basics' + faker.lorem.words(5))

    // Create enrollments
    await db.insert(enrollments).values([
        { userId: user.id, courseId: course1.id },
        { userId: user.id, courseId: course2.id },
    ])

    const response = await request(server.server)
        .get('/enrollments?search=JavaScript')
        .set('Authorization', token)

    expect(response.status).toEqual(200)
    expect(response.body.enrollments).toHaveLength(1)
    expect(response.body.enrollments[0].course.title).toContain('JavaScript')
})

test('get enrollments with pagination', async () => {
    await server.ready()

    const { token, user } = await makeAuthenticatedUser('USER')
    const course = await makeCourse()

    // Create enrollment
    await db.insert(enrollments).values({
        userId: user.id,
        courseId: course.id,
    })

    const response = await request(server.server)
        .get('/enrollments?page=1')
        .set('Authorization', token)

    expect(response.status).toEqual(200)
    expect(response.body.enrollments).toHaveLength(1)
    expect(response.body.total).toEqual(1)
})


test('should not get enrollments without authentication', async () => {
    await server.ready()

    const response = await request(server.server)
        .get('/enrollments')

    expect(response.status).toEqual(401)
})