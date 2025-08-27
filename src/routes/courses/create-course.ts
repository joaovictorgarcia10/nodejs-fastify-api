import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../database/client.ts'
import { courses } from '../../database/schema.ts'
import z from 'zod'
import { checkRequestJwt } from '../../pre-handlers/check-request-jwt.ts'
import { checkUserRole } from '../../pre-handlers/check-user-role.ts'
import { getUserFromRequest } from '../../pre-handlers/get-user-from-request.ts'

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/courses', {
        preHandler: [
            checkRequestJwt,
            checkUserRole('ADMIN')
        ],
        schema: {
            tags: ['courses'],
            summary: 'Create a course',
            body: z.object({
                title: z.string().min(5, 'Título precisa ter 5 caracteres'),
                description: z.string().min(10, 'Descrição precisa ter 10 caracteres'),
            }),
            response: {
                201: z.object({ courseId: z.uuid() }).describe('Curso criado com sucesso!'),
                400: z.object({ message: z.string() }).describe('Erro ao criar curso'),
            }
        },
    }, async (request, reply) => {
        const user = getUserFromRequest(request)
        const { title, description } = request.body

        try {
            const result = await db
                .insert(courses)
                .values({ title: title, description: description })
                .returning()

            return reply.status(201).send({ courseId: result[0].id })
        } catch (error) {
            return reply.status(400).send({ message: 'Failed to create course' })
        }
    })

}
