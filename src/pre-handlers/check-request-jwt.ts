import { FastifyReply, FastifyRequest } from "fastify";
import jwt from 'jsonwebtoken'

type JwtPayload = {
    sub: string
    role: 'ADMIN' | 'USER'
}

export async function checkRequestJwt(request: FastifyRequest, reply: FastifyReply) {
    const token = request.headers.authorization?.replace('Bearer ', '')

    if (!token) {
        return reply.status(401).send()
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be set.')
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
        request.user = payload
    } catch (error) {
        return reply.status(401).send()
    }
}
