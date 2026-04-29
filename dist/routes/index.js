"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const reviews_route_1 = require("../modules/reviews/reviews.route");
const travelPlan_route_1 = require("../modules/travelPlan/travelPlan.route");
const payment_route_1 = require("../modules/payments/payment.route");
const otp_route_1 = require("../modules/otp/otp.route");
const message_route_1 = require("../modules/message/message.route");
const buddyRequest_route_1 = require("../modules/buddyRequest/buddyRequest.route");
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
        path: "/travel-plans",
        route: travelPlan_route_1.TravelPlanRoutes
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
        path: "/buddy-requests",
        route: buddyRequest_route_1.BuddyRequestRoutes
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
