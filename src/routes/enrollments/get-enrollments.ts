import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { eq, asc, ilike, and, sql, type SQL } from 'drizzle-orm'
import z from 'zod'
import { enrollments, courses } from '../../database/schema'
import { db } from '../../database/client'
import { checkRequestJwt } from '../../pre-handlers/check-request-jwt'
import { getUserFromRequest } from '../../pre-handlers/get-user-from-request'

export const getEnrollmentsRoute: FastifyPluginAsyncZod = async (server) => {
    server.get('/enrollments', {
        preHandler: [checkRequestJwt],
        schema: {
            tags: ['enrollments'],
            summary: 'Get user enrollments',
            querystring: z.object({
                search: z.string().optional(),
                orderBy: z.enum(['createdAt', 'title']).optional().default('createdAt'),
                page: z.coerce.number().optional().default(1),
            }),
            response: {
                200: z.object({
                    enrollments: z.array(
                        z.object({
                            id: z.uuid(),
                            createdAt: z.date(),
                            course: z.object({
                                id: z.uuid(),
                                title: z.string(),
                                description: z.string().nullable(),
                            }).nullable()
                        })
                    ),
                    total: z.number(),
                })
            }
        }
    }, async (request, reply) => {
        const user = getUserFromRequest(request)
        const { search, orderBy, page } = request.query

        const conditions: SQL[] = [eq(enrollments.userId, user.sub)]

        if (search) {
            conditions.push(ilike(courses.title, `%${search}%`))
        }

        const orderByField = orderBy === 'title' ? courses.title : enrollments.createdAt

        const [result, total] = await Promise.all([
            db
                .select({
                    id: enrollments.id,
                    createdAt: enrollments.createdAt,
                    course: {
                        id: courses.id,
                        title: courses.title,
                        description: courses.description,
                    }
                })
                .from(enrollments)
                .leftJoin(courses, eq(courses.id, enrollments.courseId))
                .where(and(...conditions))
                .groupBy(enrollments.id, enrollments.createdAt, courses.id, courses.title, courses.description)
                .orderBy(asc(orderByField))
                .offset((page - 1) * 2)
                .limit(2),
            db
                .select({ count: sql<number>`count(*)` })
                .from(enrollments)
                .leftJoin(courses, eq(courses.id, enrollments.courseId))
                .where(and(...conditions))
                .then(result => Number(result[0]?.count) || 0)
        ])

        return reply.send({ enrollments: result, total })
    })
}