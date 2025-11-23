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
            <div class="col-8 border" style="height:750px">
                Welcome {{userData.username}}
            </div>
            <div class="col-4" style="height:750px">
                <div class="mb-3">
                    <label for="userSearch" class="form-label">Search Users</label>
                    <input type="text" class="form-control" id="userSearch" v-model="search.text">
                </div>
                <div class="text-center mt-5">
                    <button class="btn btn-primary" @click="searchUsers">Search</button>
                </div>
                <div>{{returnedSearchData.username}}</div>
            </div>
        </div>
    </div>
`,
    data: function() {
        return {
            userData: "",
            search: {
                "text": "",
            },
            returnedSearchData: {
                "username": "",
            },
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
            .then(data => this.returnedSearchData.username = data.username)
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