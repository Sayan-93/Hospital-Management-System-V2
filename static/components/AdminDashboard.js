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
                    <p v-for="user in returnedUserArray">
                        {{user.username}}
                    </p>
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
                    this.returnedUserArray = data
                    console.log(this.returnedUserArray[0].username)
                
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