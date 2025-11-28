export default {
  template: `
  <div>
    <div class="row border">
      <div class="col-10 fs-2 border">Hospital Management System</div>
      <div class="col-2 border">
        <button class="btn btn-primary" @click="logoutUser">Logout</button>
      </div>
    </div>

    <div class="row border">
      <div class="col" style="min-height:750px">
        <div class="card p-3 my-3 shadow-sm">
          <h3 class="text-center">Hello, {{ userData.username }}</h3>
          <div class="text-center mb-3">
            <p>Name: {{ userData.name }}</p>
            <p>Email: {{ userData.email }}</p>
            <p>Patient ID: {{ userData.patient_id }}</p>
            <p>Age: {{ userData.age }}</p>
          </div>

          <!-- SEARCH PANEL -->
          <div class="row mb-3">
            <div class="col-md-4">
              <input v-model="searchQuery" @keyup.enter="searchDoctors" placeholder="Search doctors by name or specialization" class="form-control" />
            </div>
            <div class="col-md-2">
              <select v-model="searchBy" class="form-control">
                <option value="name">Name</option>
                <option value="specialization">Specialization</option>
              </select>
            </div>
            <div class="col-md-2">
              <button class="btn btn-primary" @click="searchDoctors">Search doctors</button>
            </div>
            <div class="col-md-4 text-end">
              <button class="btn btn-secondary" @click="fetchAppointments">Refresh appointments</button>
            </div>
          </div>

          <!-- DOCTOR RESULTS -->
          <div v-if="doctors.length">
            <h5>Search results</h5>
            <div class="row">
              <div class="col-md-4 mb-3" v-for="doc in doctors" :key="doc.doctor_id">
                <div class="card p-2 h-100">
                  <h6>{{ doc.name }}</h6>
                  <p class="mb-0"><strong>Specialization:</strong> {{ doc.dept_name }}</p>
                  <p class="mb-0"><strong>Username:</strong> {{ doc.username }}</p>
                  <p class="mb-0"><strong>Email:</strong> {{ doc.email }}</p>
                  <div class="mt-2">
                    <button class="btn btn-sm btn-success" @click="openBookingForm(doc)">Book</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr/>

          <!-- BOOKING FORM (appears in a modal-ish card) -->
          <div v-if="showBooking" class="card p-3 mx-auto my-3" style="max-width:520px;">
            <h5>Book appointment with Dr. {{ bookingDoctor.name }}</h5>

            <div class="mb-2">
              <label>Date</label>
              <input type="date" v-model="bookingForm.date" class="form-control" />
            </div>

            <div class="mb-2">
              <label>Time</label>
              <input type="time" v-model="bookingForm.time" class="form-control" />
            </div>

            <div class="mb-2">
              <label>Notes (optional)</label>
              <textarea v-model="bookingForm.details" class="form-control" rows="2"></textarea>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-primary" @click="submitBooking" :disabled="bookingLoading">
                {{ bookingMode === 'book' ? 'Book' : 'Save changes' }}
              </button>
              <button class="btn btn-secondary" @click="closeBookingForm">Cancel</button>
              <button v-if="bookingMode === 'reschedule'" class="btn btn-danger ms-auto" @click="cancelAppointment(bookingForm.appointment_id)">Cancel Appointment</button>
            </div>

            <p class="mt-2 text-success" v-if="bookingMessage">{{ bookingMessage }}</p>
            <p class="mt-2 text-danger" v-if="bookingError">{{ bookingError }}</p>
          </div>

          <hr/>

          <!-- UPCOMING APPOINTMENTS -->
          <div class="mb-3">
            <h5>Upcoming appointments</h5>
            <div v-if="upcoming.length === 0">No upcoming appointments.</div>
            <div v-for="ap in upcoming" :key="ap.id" class="card p-2 mb-2">
              <div class="d-flex justify-content-between">
                <div>
                  <strong>Dr. {{ ap.doctor_name }}</strong>
                  <div><small>Specialization: {{ ap.doctor_dept }}</small></div>
                  <div><small>Date: {{ ap.date }} | Time: {{ ap.time }}</small></div>
                  <div><small>Status: {{ ap.appointment_status }}</small></div>
                </div>
                <div class="text-end">
                  <button class="btn btn-sm btn-outline-primary mb-1" @click="openReschedule(ap)">Reschedule</button>
                  <button class="btn btn-sm btn-outline-danger" @click="cancelAppointment(ap.id)">Cancel</button>
                </div>
              </div>
            </div>
          </div>

          <!-- PAST APPOINTMENTS -->
          <div class="mb-3">
            <h5>Past appointments</h5>
            <div v-if="past.length === 0">No past appointments.</div>
            <div v-for="ap in past" :key="ap.id" class="card p-2 mb-2">
              <div class="d-flex justify-content-between">
                <div>
                  <strong>Dr. {{ ap.doctor_name }}</strong>
                  <div><small>Date: {{ ap.date }} | Time: {{ ap.time }}</small></div>
                  <div><small>Status: {{ ap.appointment_status }}</small></div>
                </div>
                <div class="text-end">
                  <button class="btn btn-sm btn-outline-info" @click="viewPrescription(ap.id)">View Prescription</button>
                </div>
              </div>
            </div>
          </div>

          <!-- EDIT PATIENT INFO (existing) -->
          <div class="text-center mt-3">
            <button class="btn btn-primary mt-3" @click="toggleEditForm">Update info</button>
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
  </div>
  `,
  data() {
    return {
      userData: {},
      showEditForm: false,
      updateMessage: "",
      editForm: {
        email: "",
        username: "",
        name: "",
        age: "",
        patient_id: ""
      },

      // search
      searchQuery: "",
      searchBy: "name", // name or specialization
      doctors: [],

      // booking
      showBooking: false,
      bookingDoctor: null,
      bookingForm: {
        doctor_id: "",
        date: "",
        time: "",
        details: "",
        appointment_id: null // used for reschedule
      },
      bookingMode: "book", // or 'reschedule'
      bookingMessage: "",
      bookingError: "",
      bookingLoading: false,

      // appointments
      upcoming: [],
      past: []
    };
  },
  methods: {
    logoutUser() {
      localStorage.removeItem("auth_token");
      fetch("/api/logout", { method: "GET" })
        .then(() => this.$router.push("/"));
    },

    toggleEditForm() {
      this.showEditForm = !this.showEditForm;
      if (this.showEditForm) {
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
        .then(data => {
          this.userData = data;
          // prefill edit form patient_id
          this.editForm.patient_id = data.patient_id || "";
          // fetch appointments
          this.fetchAppointments();
        });
    },

    // ---- SEARCH DOCTORS ----
    searchDoctors() {
      const payload = {
        search: this.searchQuery || "",
        by: this.searchBy
      };
      fetch("/api/searchDoctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        },
        body: JSON.stringify(payload)
      })
        .then(r => r.json())
        .then(arr => {
          this.doctors = arr;
        })
        .catch(err => {
          console.error("search error", err);
        });
    },

    // open booking modal
    openBookingForm(doc) {
      this.bookingDoctor = doc;
      this.showBooking = true;
      this.bookingMode = "book";
      this.bookingForm = {
        doctor_id: doc.doctor_id,
        date: "",
        time: "",
        details: "",
        appointment_id: null
      };
      this.bookingMessage = "";
      this.bookingError = "";
    },

    closeBookingForm() {
      this.showBooking = false;
      this.bookingDoctor = null;
      this.bookingMessage = "";
      this.bookingError = "";
      this.bookingLoading = false;
    },

    submitBooking() {
      this.bookingMessage = "";
      this.bookingError = "";

      if (!this.bookingForm.date || !this.bookingForm.time) {
        this.bookingError = "Please choose both date and time.";
        return;
      }

      this.bookingLoading = true;
      const endpoint = this.bookingMode === "book" ? "/api/bookAppointment" : "/api/rescheduleAppointment";
      const payload = Object.assign({}, this.bookingForm, { patient_id: this.userData.patient_id });

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        },
        body: JSON.stringify(payload)
      })
        .then(r => r.json())
        .then(resp => {
          this.bookingLoading = false;
          if (resp.error) {
            this.bookingError = resp.error;
          } else {
            this.bookingMessage = resp.message || "Success";
            this.fetchAppointments();
            setTimeout(() => {
              this.closeBookingForm();
            }, 900);
          }
        })
        .catch(err => {
          this.bookingLoading = false;
          console.error(err);
          this.bookingError = "Server error. Try again.";
        });
    },

    // opens booking form pre-filled for reschedule
    openReschedule(appt) {
      // populate booking form for reschedule
      this.bookingMode = "reschedule";
      this.bookingDoctor = {
        doctor_id: appt.doctor_id_str,
        name: appt.doctor_name
      };
      this.showBooking = true;
      this.bookingForm = {
        appointment_id: appt.id,
        doctor_id: appt.doctor_id_str,
        date: appt.date,
        time: appt.time,
        details: appt.details || ""
      };
      this.bookingMessage = "";
      this.bookingError = "";
    },

    // cancel appointment by id
    cancelAppointment(appointmentId) {
      if (!confirm("Are you sure you want to cancel this appointment?")) return;
      fetch("/api/cancelAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        },
        body: JSON.stringify({ appointment_id: appointmentId, patient_id: this.userData.patient_id })
      })
        .then(r => r.json())
        .then(resp => {
          if (resp.error) alert(resp.error);
          else {
            this.fetchAppointments();
            alert(resp.message || "Cancelled");
            // close booking form if it was open for that appt
            if (this.bookingForm.appointment_id === appointmentId) this.closeBookingForm();
          }
        })
        .catch(err => console.error(err));
    },

    // fetch upcoming + past appointments
    fetchAppointments() {
      fetch("/api/getAppointments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
      })
        .then(r => r.json())
        .then(data => {
          // expected: data.upcoming, data.past arrays
          this.upcoming = data.upcoming || [];
          this.past = data.past || [];
        })
        .catch(err => console.error(err));
    },

    viewPrescription(appointmentId) {
      fetch(`/api/getPrescription?appointment_id=${appointmentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
      })
        .then(r => r.json())
        .then(data => {
          if (data.error) {
            alert(data.error);
          } else {
            // show prescription details in an alert for now (or replace with modal)
            const text = `Diagnosis: ${data.diagnosis || 'N/A'}\nPrescription: ${data.prescription || 'N/A'}`;
            alert(text);
          }
        })
        .catch(err => console.error(err));
    }
  },

  mounted() {
    this.fetchUserData();
  }
};
