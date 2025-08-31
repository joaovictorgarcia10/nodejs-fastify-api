import fastify from 'fastify'
import { fastifySwagger } from '@fastify/swagger'
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { createCourseRoute } from './routes/courses/create-course.ts'
import { getCourseByIdRoute } from './routes/courses/get-course-by-id.ts'
import { getCoursesRoute } from './routes/courses/get-courses.ts'
import { createEnrollmentRoute } from './routes/enrollments/create-enrollment.ts'
import { getEnrollmentsRoute } from './routes/enrollments/get-enrollments.ts'
import scalarAPIReference from '@scalar/fastify-api-reference'
import { createUser } from './routes/user/create-user.ts'
import { authenticate } from './routes/user/login.ts'

const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
}).withTypeProvider<ZodTypeProvider>()

if (process.env.NODE_ENV === 'development') {
    server.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'Desafio Node.js',
                version: '1.0.0',
            }
        },
        transform: jsonSchemaTransform,
    })

    server.register(scalarAPIReference, {
        routePrefix: '/docs',
    })
}

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(createCourseRoute)
server.register(getCourseByIdRoute)
server.register(getCoursesRoute)

server.register(createEnrollmentRoute)
server.register(getEnrollmentsRoute)

server.register(createUser)
server.register(authenticate)


export { server }