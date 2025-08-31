import { db } from "../../src/database/client"
import { enrollments } from "../../src/database/schema"
import { makeCourse } from "./make-course"
import { makeUser } from "./make-user"

export async function makeEnrollment(userId?: string, courseId?: string) {
    let finalUserId = userId
    let finalCourseId = courseId

    if (!finalUserId) {
        const { user } = await makeUser()
        finalUserId = user.id
    }

    if (!finalCourseId) {
        const course = await makeCourse()
        finalCourseId = course.id
    }

    const result = await db.insert(enrollments).values({
        userId: finalUserId,
        courseId: finalCourseId,
    }).returning()

    return result[0]
}
