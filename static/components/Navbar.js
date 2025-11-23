export default {
    template:`
    <div class="row border">
        <div class="col-10 fs-2 border">
                Hospital Management System
        </div>
        <div v-if="token" class="col-2 border">
                <button class="btn btn-primary" @click="logoutUser">Logout</button>
        </div>
        <div v-else class="col-2 border">
                <router-link class="btn btn-primary" to="/login">Login</router-link>
                <router-link class="btn btn-warning" to="/register">Register</router-link>
        </div>
        
    </div>
`,
    data: function() {
        return {
            "token": localStorage.getItem("auth_token")
        }
},
    methods: {
        logoutUser: function() {
            localStorage.removeItem("auth_token")
            this.token = null
            fetch("/api/logout", {
                method: "GET",

            })
            .then(response => response.json())
            .then(data => this.$router.push("/"))
        }
    }
}