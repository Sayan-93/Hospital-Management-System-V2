import Home from './components/Home.js'
import Footer from './components/Footer.js'
import Login from './components/Login.js'
import Register from './components/Register.js'
import AdminDashboard from './components/AdminDashboard.js'
import DoctorDashboard from './components/DoctorDashboard.js'
import PatientDashboard from './components/PatientDashboard.js'

const routes = [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/adminDashboard', component: AdminDashboard},
    {path: '/doctorDashboard', component: DoctorDashboard},
    {path: '/patientDashboard', component: PatientDashboard}
]

const router = new VueRouter({
    routes
})

const app = new Vue({
    el: '#app',
    router,
    template:`
    <div class="container">
        <router-view></router-view>
        <foot></foot>
    </div>
    `,
    data: {
        section: 'Frontend'
    },
    components: {
        'foot': Footer,
    }
})