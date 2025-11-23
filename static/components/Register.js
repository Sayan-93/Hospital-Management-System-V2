export default {
    template:`
    <div>
        <div class="row border">
            <div class="col-10 fs-2 border">
                    Hospital Management System
            </div>
            <div class="col-2 border">
                        <router-link class="btn btn-primary" to="/login">Login</router-link>
                </div>
        </div>
        <div class="row border">
            <div class="col" style="height:750px">
                <div class="border mx-auto mt-5" style="height:400px;width:300px">
                    <div>
                        <h2 class="text-center">Register Form</h2>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="email" v-model="formData.email">
                        </div>
                        <div class="mb-3">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" class="form-control" id="username" v-model="formData.username">
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" v-model="formData.password">
                        </div>
                        <div class="text-center mt-4">
                            <button class="btn btn-primary" @click="registerUser">Register</button>
                        </div>
                        <p class="text-center">{{message}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
`,
    data: function() {
        return {
            formData: {
                "email": "",
                "username": "",
                "password": "",

            },
            message: "",
        }
    },
    methods: {
        registerUser: function() {
            fetch('/api/register', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.formData)
            })
            .then(response => response.json())
            .then(data => this.message = data.message)
        }
    }
}