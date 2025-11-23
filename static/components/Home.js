export default {
    template:`
    <div>
        <div class="row border">
            <div class="col-10 fs-2 border">
                    Hospital Management System
            </div>
            <div class="col-2 border">
                    <router-link class="btn btn-primary" to="/login">Login</router-link>
                    <router-link class="btn btn-warning" to="/register">Register</router-link>
            </div>
        </div>
        <div class="row border">
            <div class="col" style="height:750px">
                <div class="border mx-auto mt-5" style="height:400px;width:300px">
                    Home page
                </div>
            </div>
        </div>
    </div>
`
}