import type { FastifyRequest } from "fastify";

export function getUserFromRequest(request: FastifyRequest) {
    const user = request.user

    if (!user) {
        throw new Error('Invalid authentication')
    }

    return user
}