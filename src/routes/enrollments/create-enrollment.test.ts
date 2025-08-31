import { test, expect } from 'vitest'
import request from 'supertest'
import { makeAuthenticatedUser } from '../../../tests/factories/make-user'
import { makeCourse } from '../../../tests/factories/make-course'
import { server } from '../../app'

test('create an enrollment', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser('USER')
    const course = await makeCourse()

    const response = await request(server.server)
        .post('/enrollments')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({
            courseId: course.id,
        })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({ enrollmentId: expect.any(String) })
})

test('should not create enrollment for non-existent course', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser('USER')

    const response = await request(server.server)
        .post('/enrollments')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({
            courseId: '123e4567-e89b-12d3-a456-426614174000', // Random UUID
        })

    expect(response.status).toEqual(404)
    expect(response.body).toEqual({ message: 'Course not found' })
})

test('should not create duplicate enrollment', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser('USER')
    const course = await makeCourse()

    // First enrollment
    await request(server.server)
        .post('/enrollments')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({
            courseId: course.id,
        })

    // Second enrollment (should fail)
    const response = await request(server.server)
        .post('/enrollments')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({
            courseId: course.id,
        })

    expect(response.status).toEqual(500)
    expect(response.body).toEqual({ message: 'User already enrolled in this course' })
})

test('should not create enrollment without authentication', async () => {
    await server.ready()

    const course = await makeCourse()

    const response = await request(server.server)
        .post('/enrollments')
        .set('Content-Type', 'application/json')
        .send({
            courseId: course.id,
        })

    expect(response.status).toEqual(401)
})