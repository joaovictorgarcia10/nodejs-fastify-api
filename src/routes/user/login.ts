import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../../database/client'
import { users } from '../../database/schema'
import { verify } from 'argon2'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

export const authenticate: FastifyPluginAsyncZod = async (server) => {
    server.post('/login', {
        schema: {
            tags: ['authentication'],
            summary: 'Authenticate user',
            body: z.object({
                email: z.email(),
                password: z.string().min(1),
            }),
            response: {
                200: z.object({ token: z.string() }).describe('Login realizado com sucesso!'),
                400: z.object({ message: z.string() }).describe('Credenciais inválidas'),
            },
        },
    }, async (request, reply) => {
        const { email, password } = request.body

        try {
            const result = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1)

            if (result.length === 0) {
                return reply.status(400).send({ message: 'Invalid credentials' })
            }

            const user = result[0]
            const isPasswordValid = await verify(user.password, password)

            if (!isPasswordValid) {
                return reply.status(400).send({ message: 'Invalid credentials' })
            }

            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET must be set.')
            }

            const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET)
            return reply.status(200).send({ token })
        } catch (error) {
            return reply.status(400).send({ message: 'Invalid credentials' })
        }
    })
}