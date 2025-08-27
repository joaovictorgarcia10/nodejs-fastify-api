import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { ilike, asc, type SQL, and, eq, count } from 'drizzle-orm'
import z from 'zod'
import { courses, enrollments } from '../../database/schema'
import { db } from '../../database/client'
import { checkRequestJwt } from '../../pre-handlers/check-request-jwt'

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
    server.get('/courses', {
        preHandler: [checkRequestJwt],
        schema: {
            tags: ['courses'],
            summary: 'Get all courses',
            querystring: z.object({
                search: z.string().optional(),
                orderBy: z.enum(['id', 'title']).optional().default('id'),
                page: z.coerce.number().optional().default(1),
            }),
            response: {
                200: z.object({
                    courses: z.array(
                        z.object({
                            id: z.uuid(),
                            title: z.string(),
                            description: z.string().nullable(),
                            enrollments: z.number(),
                        })
                    ),
                    total: z.number(),
                })
            }
        }
    }, async (request, reply) => {
        const { search, orderBy, page } = request.query

        const conditions: SQL[] = []

        if (search) {
            conditions.push(ilike(courses.title, `%${search}%`))
        }

        const [result, total] = await Promise.all([
            db
                .select({
                    id: courses.id,
                    title: courses.title,
                    description: courses.description,
                    enrollments: count(enrollments.id),
                })
                .from(courses)
                .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
                .orderBy(asc(courses[orderBy]))
                .offset((page - 1) * 2)
                .limit(2)
                .where(and(...conditions))
                .groupBy(courses.id),
            db.$count(courses, and(...conditions))
        ])

        return reply.send({ courses: result, total })
    })
}