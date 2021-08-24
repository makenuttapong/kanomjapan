import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from '../firebase/firebase_app';

Vue.use(VueRouter)

const routes = [
    {
        path: '*',
        redirect: '/error'
    },
    {
        path: '/error',
        name: 'error',
        component: () => import('../views/error.vue')
    },
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/signup.vue')
    },
    {
        path: '/forget',
        name: 'forget',
        component: () => import('../views/forget.vue')
    },
    {
        path: '/reset-password/:action',
        name: 'reset',
        component: () => import('../views/resetPassword.vue')
    },
    {
        path: '/',
        name: 'all',
        component: () => import('../views/home.vue'),
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('../views/firstPage.vue'),
            },
            {
                path: '/products',
                name: 'products',
                component: () => import('../views/productList.vue'),
            },
            {
                path: '/product-detail/:id',
                name: 'productDetail',
                component: () => import('../views/productListDetail.vue'),
            },
            {
                path: '/reviews',
                name: 'reviews',
                component: () => import('../views/reviews.vue'),
            },
            {
                path: '/reviews-detail/:id',
                name: 'reviewsDetail',
                component: () => import('../views/reviewsDetail.vue'),
            },
            {
                path: '/profile',
                name: 'profile',
                component: () => import('../views/customer/customerProfile.vue'),
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: '/user-order',
                name: 'user-order',
                component: () => import('../views/customer/orderlist.vue'),
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: '/user-order/:id',
                name: 'user-order-detail',
                component: () => import('../views/customer/orderlistDetail.vue'),
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: '/about_me',
                name: 'about_me',
                component: () => import('../views/about_me.vue'),
            },
            {
                path: '/helper',
                name: 'helper',
                component: () => import('../views/helper.vue'),
            },
            {
                path: '/checkout',
                name: 'checkout',
                component: () => import('../views/customer/checkout.vue'),
            },
            {
                path: '/confirm-order/:id',
                name: 'confirm-order',
                component: () => import('../views/customer/confirm_order.vue'),
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: '/rating/:id',
                name: 'rating',
                component: () => import('../views/customer/ratingPage.vue'),
                meta: {
                    requiresAuth: true,
                }
            },
        ]
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/admin.vue'),
        meta: {
            requiresAuth: true,
            role: 'admin'
        },
        children: [
            {
                path: '/',
                redirect: '/admin/dashboard'
            },
            {
                path: '/admin/dashboard',
                name: 'dashboard',
                component: () => import('../views/admin/dashboard.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/order',
                name: 'order',
                component: () => import('../views/admin/order.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/order/:id',
                name: 'orderDetail',
                component: () => import('../views/admin/orderDetail.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/product',
                name: 'product',
                component: () => import('../views/admin/product.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/product/:id',
                name: 'productDetail',
                component: () => import('../views/admin/productDetail.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/review-product',
                name: 'review-product',
                component: () => import('../views/admin/reviewProduct.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/review-product/:id',
                name: 'review-productDetail',
                component: () => import('../views/admin/reviewProductDetail.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/customer',
                name: 'customer',
                component: () => import('../views/admin/customer.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/customer/:id',
                name: 'customerDetail',
                component: () => import('../views/admin/customerDetail.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/profile',
                name: 'adminProfile',
                component: () => import('../views/admin/adminProfile.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/shipping',
                name: 'shipping',
                component: () => import('../views/admin/shipping.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/setting',
                name: 'setting',
                component: () => import('../views/admin/setting.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/comments',
                name: 'comments',
                component: () => import('../views/admin/comments.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/income',
                name: 'income',
                component: () => import('../views/admin/income.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/income-list',
                name: 'income-list',
                component: () => import('../views/admin/incomeList.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/best-sale',
                name: 'best-sale',
                component: () => import('../views/admin/bestSale.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/last-order',
                name: 'last-order',
                component: () => import('../views/admin/lastOrder.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/best-delivery',
                name: 'best-delivery',
                component: () => import('../views/admin/expressDelivery.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: '/admin/top-rate',
                name: 'top-rate',
                component: () => import('../views/admin/topRating.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            }
            ,
            {
                path: '/admin/lineNotify',
                name: 'LineNotify',
                component: () => import('../views/admin/lineNotify.vue'),
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            }


        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const currentUser = firebase.auth().currentUser
    if (requiresAuth && !currentUser) {
        next('home');
    }
    else if (requiresAuth && currentUser) {
        currentUser.getIdTokenResult()
            .then((idTokenResult) => {
                // console.log(idTokenResult.claims);
                if (to.meta.role) {
                    // Confirm the user is an Admin.

                    if (to.meta.role == idTokenResult.claims.role) {
                        next()
                    } else {
                        next('*')
                    }
                }
                else {
                    next()
                }

            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        next();
    }
})

export default router