import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../../database/client'
import { users } from '../../database/schema'
import { hash } from 'argon2'
import { checkRequestJwt } from '../../pre-handlers/check-request-jwt'
import { checkUserRole } from '../../pre-handlers/check-user-role'

export const createUser: FastifyPluginAsyncZod = async (server) => {
    server.post('/users', {
        schema: {
            tags: ['users'],
            summary: 'Create a new user',
            body: z.object({
                name: z.string().min(1),
                email: z.email(),
                password: z.string().min(6),
                role: z.enum(['ADMIN', 'USER']).optional().default('USER'),
            }),
            response: {
                201: z.object({ userId: z.uuid() }).describe('Usuário criado com sucesso!'),
                400: z.object({ message: z.string() }).describe('Erro ao criar usuário'),
            },
        },
    }, async (request, reply) => {
        const { name, email, password, role } = request.body

        try {
            const hashPassword = await hash(password)

            const result = await db
                .insert(users)
                .values({ name: name, email: email, password: hashPassword, role: role })
                .returning()

            return reply.status(201).send({ userId: result[0].id })
        } catch (error: any) {
            return reply.status(400).send({ message: 'Failed to create user' })
        }
    })
}