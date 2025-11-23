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
                <div class="border mx-auto mt-5" style="height:400px;width:300px">
                    Welcome {{userData.username}}
                </div>
            </div>
        </div>
    </div>
`,
    data: function() {
        return {
            userData: "",
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