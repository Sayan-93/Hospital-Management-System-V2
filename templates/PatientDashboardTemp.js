export default {
    template: `
    <div>
        <div class="row border">
            <div class="col-10 fs-2 border">
                    Hospital Management System
            </div>
            <div class="col-2 border">
                    <button class="btn btn-primary" @click="logoutUser">Logout</button>
            </div>
        </div>
        
        <div class="row border">
            <div class="col" style="height:750px">
                <div class="card p-3 my-3 shadow-sm text-center">
                    <h3>Hello, {{ userData.username }}</h3>
                    <p>Name: {{ userData.name }}</p>
                    <p>Email: {{ userData.email }}</p>
                    <p>Patient ID: {{ userData.patient_id }}</p>
                    <p>Age: {{ userData.age }}</p>
                </div>
                <div class="text-center">
                    <button class="btn btn-primary mt-3" @click="toggleEditForm">
                        Update info
                    </button>


                    <div v-if="showEditForm" class="card p-3 mx-auto mt-2 text-start" style="width:400px;">
                        <h4>Edit Patient Info</h4>

                        <div class="mb-3">
                            <label>Email</label>
                            <input type="email" class="form-control" v-model="editForm.email">
                        </div>

                        <div class="mb-3">
                            <label>Name</label>
                            <input type="text" class="form-control" v-model="editForm.name">
                        </div>

                        <div class="mb-3">
                            <label>Username</label>
                            <input type="text" class="form-control" v-model="editForm.username">
                        </div>

                        <div class="mb-3">
                            <label>Age</label>
                            <input type="number" class="form-control" v-model="editForm.age">
                        </div>

                        <button class="btn btn-success" @click="updatePatient">Save Changes</button>

                        <p class="mt-3">{{ updateMessage }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div> 
`,
    data: function() {
        return {
            userData: "",
            showEditForm: false,
            updateMessage: "",
            editForm: {
                email: "",
                username: "",
                name: "",
                age: "",
                patient_id: ""
            }
        }
    },
    methods: {
        logoutUser: function() {
            localStorage.removeItem("auth_token")
            fetch("/api/logout", {
                method: "GET",

            })
            .then(response => response.json())
            .then(data => this.$router.push("/"))
        },
        toggleEditForm() {
            this.showEditForm = !this.showEditForm;

            if (this.showEditForm) {
                // pre-fill the form
                this.editForm.email = this.userData.email;
                this.editForm.username = this.userData.username;
                this.editForm.name = this.userData.name;
                this.editForm.age = this.userData.age;
                this.editForm.patient_id = this.userData.patient_id;
            }
        },
        updatePatient() {
            fetch("/api/updatePatient", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.editForm)
            })
            .then(r => r.json())
            .then(data => {
                this.updateMessage = data.message;
                this.showEditForm = false;

                // refresh info
                this.fetchUserData();
            });
        },
        fetchUserData() {
            fetch('/api/home', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => this.userData = data)
        },
    },
    mounted() {
        this.fetchUserData();
    }
}