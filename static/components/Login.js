export default {
    template:`
    <div>
        <div class="row border">
            <div class="col-10 fs-2 border">
                    Hospital Management System
            </div>
            <div class="col-2 border">
                    <router-link class="btn btn-warning" to="/register">Register</router-link>
            </div>
        </div>
        <div class="row border">
            <div class="col" style="height:750px">
                <div class="border mx-auto mt-5" style="height:370px;width:300px">
                    <div>
                        <h2 class="text-center">Login Form</h2>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="email" v-model="formData.email">
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" v-model="formData.password">
                        </div>
                        <div class="text-center mt-5">
                            <button class="btn btn-primary" @click="loginUser">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`,
    data: function() {
        return {
            formData: {
                email: "",
                password: ""
            }
        }
    },
    methods: {
        loginUser: function() {
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.formData)
            })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('auth_token', data["auth-token"])
                
                if (data.role == "doctor") {
                    this.$router.push('/doctorDashboard')
                }else if (data.role == "patient"){
                    this.$router.push('/patientDashboard')
                }else {
                    this.$router.push('/adminDashboard')
                }
                    
            })
        }
    }
}