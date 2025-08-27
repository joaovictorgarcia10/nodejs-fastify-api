import type { FastifyRequest, FastifyReply } from 'fastify'
import { getUserFromRequest } from './get-user-from-request'

export function checkUserRole(role: 'ADMIN' | 'USER') {
    return async function (request: FastifyRequest, reply: FastifyReply) {
        const user = getUserFromRequest(request)

        if (user.role !== role) {
            return reply.status(401).send()
        }
    }
}