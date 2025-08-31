import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../database/client'
import { enrollments, courses } from '../../database/schema'
import z from 'zod'
import { checkRequestJwt } from '../../pre-handlers/check-request-jwt'
import { getUserFromRequest } from '../../pre-handlers/get-user-from-request'
import { eq, and } from 'drizzle-orm'

export const createEnrollmentRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/enrollments', {
        preHandler: [checkRequestJwt],
        schema: {
            tags: ['enrollments'],
            summary: 'Create a new enrollment',
            body: z.object({
                courseId: z.uuid('ID do curso deve ser um UUID válido'),
            }),
            response: {
                201: z.object({ enrollmentId: z.uuid() }).describe('Matrícula criada com sucesso!'),
                400: z.object({ message: z.string() }).describe('Erro ao criar matrícula'),
                404: z.object({ message: z.string() }).describe('Curso não encontrado'),
                500: z.object({ message: z.string() }).describe('Usuário já matriculado neste curso'),
            }
        },
    }, async (request, reply) => {
        const user = getUserFromRequest(request)
        const { courseId } = request.body

        try {
            const course = await db
                .select()
                .from(courses)
                .where(eq(courses.id, courseId))
                .limit(1)

            if (course.length === 0) {
                return reply.status(404).send({ message: 'Course not found' })
            }

            const existingEnrollment = await db
                .select()
                .from(enrollments)
                .where(and(
                    eq(enrollments.userId, user.sub),
                    eq(enrollments.courseId, courseId)
                ))
                .limit(1)

            if (existingEnrollment.length > 0) {
                return reply.status(500).send({ message: 'User already enrolled in this course' })
            }

            const result = await db
                .insert(enrollments)
                .values({ userId: user.sub, courseId })
                .returning()

            return reply.status(201).send({ enrollmentId: result[0].id })
        } catch (error) {
            return reply.status(400).send({ message: 'Failed to create enrollment' })
        }
    })
}