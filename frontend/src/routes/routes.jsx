// Users
import Register from '@pages/user/Register';
import Login from '@pages/user/Login';
import Logout from '@pages/user/Logout';

// Bills
import BillForm from '@pages/bill/BillForm';
import PaymentForm from '../pages/payment/PaymentForm';

// Category
import CategoryForm from '@pages/category/CategoryForm';

const routes = [
    // Geral
    {
        path: '/',
        auth: null,
        element: <h1>Em dev</h1>
    },
    // Users
    {
        path: '/register',
        auth: false,
        element: <Register /> },
    {
        path: '/login',
        auth: false,
        element: <Login />
    },
    {
        path: '/logout',
        auth: true,
        element: <Logout /> 
    },
    // Bills
    { 
        path: '/bill/form', 
        auth: true, 
        element: <BillForm /> 
    },
    { 
        path: '/bill/form/:id',
        auth: true,
        element: <BillForm />
    },
    {
        path: '/payment/form',
        auth: true,
        element: <PaymentForm />
    },

    // Category
    {
        path: 'category/form',
        auth: true,
        element: <CategoryForm />
    },
    {
        path: 'category/form/:id',
        auth: true,
        element: <CategoryForm />
    },
];

export default routes;