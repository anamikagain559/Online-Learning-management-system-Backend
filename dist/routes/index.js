"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const reviews_route_1 = require("../modules/reviews/reviews.route");
const course_route_1 = require("../modules/course/course.route");
const payment_route_1 = require("../modules/payments/payment.route");
const otp_route_1 = require("../modules/otp/otp.route");
const message_route_1 = require("../modules/message/message.route");
const enrollment_route_1 = require("../modules/enrollment/enrollment.route");
const category_route_1 = require("../modules/category/category.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/categories",
        route: category_route_1.CategoryRoutes
    },
    {
        path: "/courses",
        route: course_route_1.CourseRoutes
    }, {
        path: "/otp",
        route: otp_route_1.OtpRoutes
    },
    {
        path: "/payments",
        route: payment_route_1.paymentsRoutes
    },
    {
        path: "/reviews",
        route: reviews_route_1.reviewsRoutes
    },
    {
        path: "/messages",
        route: message_route_1.MessageRoutes
    },
    {
        path: "/enrollments",
        route: enrollment_route_1.EnrollmentRoutes
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
// router.use("/user", UserRoutes)
// router.use("/tour", TourRoutes)
// router.use("/division", DivisionRoutes)
// router.use("/booking", BookingRoutes)
// router.use("/user", UserRoutes)
