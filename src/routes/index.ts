import { Router } from "express"
import { AuthRoutes } from "../modules/auth/auth.route"
import { UserRoutes } from "../modules/user/user.route"

import { reviewsRoutes } from "../modules/reviews/reviews.route"
import { CourseRoutes } from "../modules/course/course.route";
import { paymentsRoutes } from "../modules/payments/payment.route";
import { OtpRoutes } from "../modules/otp/otp.route"
import { MessageRoutes } from "../modules/message/message.route";
import { EnrollmentRoutes } from "../modules/enrollment/enrollment.route";
import { CategoryRoutes } from "../modules/category/category.route";
export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/categories",
        route: CategoryRoutes
    },
    {
        path: "/courses",
        route: CourseRoutes
    }, {
        path: "/otp",
        route: OtpRoutes
    },

    {
        path: "/payments",
        route: paymentsRoutes
    },
    {
        path: "/reviews",
        route: reviewsRoutes
    },
    {
        path: "/messages",
        route: MessageRoutes
    },
    {
        path: "/enrollments",
        route: EnrollmentRoutes
    },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

// router.use("/user", UserRoutes)
// router.use("/tour", TourRoutes)
// router.use("/division", DivisionRoutes)
// router.use("/booking", BookingRoutes)
// router.use("/user", UserRoutes)