export default {
    template: `
    <div>
        <!-- ---------Navbar--------- -->
        <div class="row border">
            <div class="col-10 fs-2 border">
                    Hospital Management System
            </div>
            <div class="col-2 border">
                    <button class="btn btn-primary" @click="logoutUser">Logout</button>
            </div>
        </div>
        <!-- ------------------------ -->

        <!-- ---------------Body------------ -->
        <div class="row border">

            <!-- ------Left column--------- -->
            <div class="col-8 border" style="height:750px">
                Welcome {{userData.username}}
            </div>
            <!-- -------------------------- -->

            <!-- -------Right column------- -->
            <div class="col-4" style="height:750px">

            <!-- ------------toggle buttons------------ -->
                <div class="mt-2">
                    <button class="btn btn-primary" @click="toggleSearchBox">Search Users</button>
                    <button class="btn btn-primary" @click="toggleDoctorForm">Add Doctor</button>
                </div>
            <!-- -------------------------------------- -->

                <div v-show="toggleSearch">
                    <div class="mb-3">
                        <label for="userSearch" class="form-label">Search Users</label>
                        <input type="text" class="form-control" id="userSearch" v-model="search.text">
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="radioVal" id="doctorSpecialization" v-model="search.radioVal" value="doctor">
                        <label class="form-check-label" for="doctorSpecialization">
                            Search doctors by specialization
                        </label>
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="radioVal" id="allDoctors" v-model="search.radioVal" value="doctor">
                        <label class="form-check-label" for="allDoctors">
                            Search all doctors
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="radioVal" id="allPatients" v-model="search.radioVal" value="patient">
                        <label class="form-check-label" for="allPatients">
                            Search all patients
                        </label>
                    </div>
                    
                    <div class="text-center mt-5">
                        <button class="btn btn-primary" @click="searchUsers">Search</button>
                    </div>

                    <div v-if="returnedUserArray">
                        <div v-for="user in returnedUserArray">

                            <div v-if="user.doctorID" class="card" style="width: 18rem;">
                                <div class="card-body">
                                    <h5 class="card-title">{{user.username}}</h5>
                                    <p>Name: <strong>{{user.name}}</strong></p>
                                    <p>ID: {{user.doctorID}} &nbsp; email: {{user.email}}</p>
                                    <h6> <span class="badge text-bg-secondary">{{user.dept_name}}</span></h6>
                                    <button class="btn btn-primary" @click="showEditForm(user)">
                                        Modify info
                                    </button>
                                </div>
                            </div>

                            <div v-else class="card" style="width: 18rem;">
                                <div class="card-body">
                                    <h5 class="card-title">{{user.username}}</h5>
                                    <p>Name: <strong>{{user.name}}</strong></p>
                                    <p>ID: {{user.patientID}} &nbsp; email: {{user.email}}</p>
                                    <p>age: {{user.age}}</p>
                                </div>
                            </div>

                            <div v-if="editingDoctorId === user.doctorID" class="card mt-2 p-3 border">

                                <h5>Edit Doctor</h5>

                                <div class="mb-3">
                                    <label>Email</label>
                                    <input type="email" class="form-control" v-model="editDoctorForm.email">
                                </div>

                                <div class="mb-3">
                                    <label>Doctor ID</label>
                                    <input type="text" class="form-control" v-model="editDoctorForm.doctorID" disabled>
                                </div>

                                <div class="mb-3">
                                    <label>Username</label>
                                    <input type="text" class="form-control" v-model="editDoctorForm.username">
                                </div>

                                <div class="mb-3">
                                    <label>Specialization</label>
                                    <input type="text" class="form-control" v-model="editDoctorForm.spec">
                                </div>

                                <button class="btn btn-success" @click="updateDoctor">Update</button>
                            </div>

                        </div>
                    </div>
                </div>

                <div v-show="toggleDoctor">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" v-model="addDoctor.email">
                    </div>
                    <div class="mb-3">
                        <label for="doctorID" class="form-label">Doctor ID</label>
                        <input type="doctorID" class="form-control" id="doctorID" v-model="addDoctor.doctorID">
                    </div>
                    <div class="mb-3">
                        <label for="username" class="form-label">Username</label>
                        <input type="username" class="form-control" id="username" v-model="addDoctor.username">
                    </div>
                    <div class="mb-3">
                        <label for="spec" class="form-label">Specialization</label>
                        <input type="spec" class="form-control" id="spec" v-model="addDoctor.spec">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" v-model="addDoctor.password">
                    </div>
                    <div class="text-center mt-5">
                        <button class="btn btn-primary" @click="addDoctorToDB">Add</button>
                    </div>
                </div>
                <div class="text-center">{{returnedDoctorMessage}}</div>

                
            </div>
        </div>
    </div>
`,
    data: function() {
        return {
            userData: "",
            search: {
                "text": "",
                "radioVal": null
            },
            returnedSearchData: {
                "username": "",
            },
            addDoctor: {
                "email": "",
                "username": "",
                "doctorID": "",
                "password": "",
                "spec": ""
            },
            returnedDoctorMessage: "",
            returnedUserArray: null,
            returnedUser: "",
            toggleSearch: false,
            toggleDoctor: false,
            
            editingDoctorId: null,
            editDoctorForm: {
                email: "",
                username: "",
                doctorID: "",
                spec: ""
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
        searchUsers: function() {
            fetch("/api/searchUsers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.search)
            })
            .then(response => response.json())
            .then(data => {
                    this.returnedUserArray = data;
                    this.search.text = "";
                    console.log(this.returnedUserArray[0].username);
                
            })
        },
        addDoctorToDB: function() {
            fetch("/api/addDoctor", {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.addDoctor)
            })
            .then(response => response.json())
            .then(data => this.returnedDoctorMessage = data.message)
        },
        toggleSearchBox: function() {
            this.toggleSearch = !this.toggleSearch
        },
        toggleDoctorForm: function() {
            this.toggleDoctor = !this.toggleDoctor
        },
        showEditForm(user) {
            if (this.editingDoctorId === user.doctorID) {
                this.editingDoctorId = null   // collapse if clicked again
            } else {
                this.editingDoctorId = user.doctorID

                // Pre-fill with existing values
                this.editDoctorForm.email = user.email
                this.editDoctorForm.username = user.username
                this.editDoctorForm.doctorID = user.doctorID
                this.editDoctorForm.spec = user.dept_name
            }
        },
        updateDoctor() {
            fetch("/api/updateDoctor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.editDoctorForm)
            })
            .then(r => r.json())
            .then(data => {
                alert(data.message)
                this.editingDoctorId = null
                this.searchUsers()  // refresh search results
            })
        }


    },
    mounted() {
        fetch('/api/home', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.userData = data)
    }
}