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
        <div class="card p-3 text-center my-3 shadow-sm">
          <h3>Dr. {{ userData.username }}</h3>
          <p>Name: {{ userData.name }}</p>
          <p>Email: {{ userData.email }}</p>
          <p>Doctor ID: {{ userData.doctor_id }}</p>
          <p>Department: {{ userData.department }}</p>
        </div>

        <!-- Appointments -->
        <div class="row">
          <div class="col-md-6">
            <h5>Upcoming appointments</h5>
            <div v-if="appointments.upcoming.length === 0" class="mb-2">No upcoming appointments.</div>
            <div v-for="ap in appointments.upcoming" :key="ap.id" class="card p-2 mb-2">
              <div class="d-flex justify-content-between">
                <div>
                  <strong>{{ ap.patient_name }}</strong> <small>({{ ap.patient_id_str }})</small>
                  <div><small>Date: {{ ap.date }} | Time: {{ ap.time }}</small></div>
                  <div><small>Notes: {{ ap.details }}</small></div>
                </div>
                <div class="text-end">
                  <button class="btn btn-sm btn-success mb-1" @click="openCompleteForm(ap)">Complete</button>
                  <button class="btn btn-sm btn-danger" @click="cancelAppointment(ap.id)">Cancel</button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <h5>Past appointments</h5>
            <div v-if="appointments.past.length === 0" class="mb-2">No past appointments.</div>
            <div v-for="ap in appointments.past" :key="ap.id" class="card p-2 mb-2">
              <div>
                <strong>{{ ap.patient_name }}</strong> <small>({{ ap.patient_id_str }})</small>
                <div><small>Date: {{ ap.date }} | Time: {{ ap.time }}</small></div>
                <div><small>Status: {{ ap.appointment_status }}</small></div>
                <div class="mt-2">
                  <button class="btn btn-sm btn-outline-primary" @click="openCompleteForm(ap, true)">Add / Edit Treatment</button>
                  <button class="btn btn-sm btn-outline-info" @click="viewTreatment(ap)">View Treatment</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr/>

        <!-- Complete/Edit Treatment form (appears when doctor clicks Complete) -->
        <div v-if="showTreatmentForm" class="card p-3 mx-auto my-3" style="max-width:640px;">
          <h5>Treatment for {{ treatmentForm.patient_name }} — {{ treatmentForm.date }} {{ treatmentForm.time }}</h5>

          <div class="mb-2">
            <label>Diagnosis</label>
            <textarea v-model="treatmentForm.diagnosis" class="form-control" rows="3"></textarea>
          </div>

          <div class="mb-2">
            <label>Prescription</label>
            <textarea v-model="treatmentForm.prescription" class="form-control" rows="3"></textarea>
          </div>

          <div class="d-flex gap-2">
            <button class="btn btn-success" @click="submitTreatment" :disabled="treatmentLoading">Save & Mark Completed</button>
            <button class="btn btn-secondary" @click="closeTreatmentForm">Cancel</button>
          </div>
          <p class="mt-2 text-success" v-if="treatmentMessage">{{ treatmentMessage }}</p>
          <p class="mt-2 text-danger" v-if="treatmentError">{{ treatmentError }}</p>
        </div>

        <hr/>

        <!-- Patients list -->
        <div class="row">
          <div class="col-md-12">
            <h5>My patients</h5>
            <div v-if="patients.length === 0">No patients assigned yet.</div>
            <div class="row">
              <div class="col-md-3 mb-2" v-for="p in patients" :key="p.patient_id_str">
                <div class="card p-2 h-100">
                  <div><strong>{{ p.name }}</strong></div>
                  <div><small>{{ p.patient_id_str }}</small></div>
                  <div><small>Age: {{ p.age }}</small></div>
                  <div class="mt-2">
                    <button class="btn btn-sm btn-info" @click="fetchPatientRecords(p.patient_id_str)">View Records</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Patient records modal-ish -->
        <div v-if="showRecords" class="card p-3 mx-auto my-3" style="max-width:720px;">
          <h5>Records for {{ recordsPatientName }} ({{ recordsPatientId }})</h5>
          <div v-if="patientRecords.length === 0">No records found.</div>
          <div v-for="r in patientRecords" :key="r.appointment_id" class="card p-2 mb-2">
            <div><strong>Date:</strong> {{ r.date }} | <strong>Time:</strong> {{ r.time }}</div>
            <div><strong>Diagnosis:</strong> <div>{{ r.diagnosis }}</div></div>
            <div><strong>Prescription:</strong> <div>{{ r.prescription }}</div></div>
          </div>
          <div class="text-end">
            <button class="btn btn-secondary" @click="closeRecords">Close</button>
          </div>
        </div>

        <!-- Edit doctor info (existing) -->
        <div class="text-center mt-3">
          <button class="btn btn-primary mt-3" @click="toggleEditForm">Update info</button>
          <div v-if="showEditForm" class="card p-3 mx-auto mt-2 text-start" style="width:400px;">
            <h4>Edit Doctor Info</h4>
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
              <label>Department</label>
              <input type="text" class="form-control" v-model="editForm.department">
            </div>
            <button class="btn btn-success" @click="updateDoctor">Save Changes</button>
            <p class="mt-3">{{ updateMessage }}</p>
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
      editForm: {
        email: "",
        name: "",
        username: "",
        department: "",
        doctor_id: ""
      },

      appointments: { upcoming: [], past: [] },

      // treatment form
      showTreatmentForm: false,
      treatmentForm: {
        appointment_id: null,
        patient_name: "",
        patient_id_str: "",
        date: "",
        time: "",
        diagnosis: "",
        prescription: ""
      },
      treatmentLoading: false,
      treatmentMessage: "",
      treatmentError: "",

      patients: [],

      // patient records
      showRecords: false,
      patientRecords: [],
      recordsPatientName: "",
      recordsPatientId: ""
    };
  },

  methods: {
    logoutUser() {
      localStorage.removeItem("auth_token");
      fetch("/api/logout", { method: "GET" }).then(() => this.$router.push("/"));
    },

    toggleEditForm() {
      this.showEditForm = !this.showEditForm;
      if (this.showEditForm) {
        this.editForm.email = this.userData.email;
        this.editForm.name = this.userData.name;
        this.editForm.username = this.userData.name;
        this.editForm.department = this.userData.department;
        this.editForm.doctor_id = this.userData.doctor_id;
      }
    },

    updateDoctor() {
      fetch("/api/updateDoctorInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        },
        body: JSON.stringify(this.editForm)
      })
        .then(r => r.json())
        .then(data => {
          this.showEditForm = false;
          this.fetchUserData();
        });
    },

    fetchUserData() {
      fetch("/api/home", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
      })
        .then(r => r.json())
        .then(data => {
          this.userData = data;
          this.fetchAppointments();
          this.fetchPatients();
        });
    },

    fetchAppointments() {
      fetch("/api/doctor/appointments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
      })
        .then(r => r.json())
        .then(data => {
          this.appointments.upcoming = data.upcoming || [];
          this.appointments.past = data.past || [];
        })
        .catch(err => console.error(err));
    },

    openCompleteForm(appt, editOnly=false) {
      this.showTreatmentForm = true;
      this.treatmentForm.appointment_id = appt.id;
      this.treatmentForm.patient_name = appt.patient_name;
      this.treatmentForm.patient_id_str = appt.patient_id_str;
      this.treatmentForm.date = appt.date;
      this.treatmentForm.time = appt.time;
      this.treatmentForm.diagnosis = "";
      this.treatmentForm.prescription = "";
      this.treatmentMessage = "";
      this.treatmentError = "";

      // If there is existing treatment for this appointment, fetch it to pre-fill
      fetch(`/api/doctor/fetchTreatment?appointment_id=${appt.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
      })
        .then(r => r.json())
        .then(resp => {
          if (!resp.error && resp.treatment) {
            this.treatmentForm.diagnosis = resp.treatment.diagnosis || "";
            this.treatmentForm.prescription = resp.treatment.prescription || "";
          }
        })
        .catch(err => {/* ignore fetch failure; form can be filled manually */});
    },

    closeTreatmentForm() {
      this.showTreatmentForm = false;
      this.treatmentForm = {
        appointment_id: null,
        patient_name: "",
        patient_id_str: "",
        date: "",
        time: "",
        diagnosis: "",
        prescription: ""
      };
    },

    submitTreatment() {
      if (!this.treatmentForm.appointment_id) return;
      this.treatmentLoading = true;
      fetch("/api/doctor/completeAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        },
        body: JSON.stringify({
          appointment_id: this.treatmentForm.appointment_id,
          diagnosis: this.treatmentForm.diagnosis,
          prescription: this.treatmentForm.prescription
        })
      })
        .then(r => r.json())
        .then(resp => {
          this.treatmentLoading = false;
          if (resp.error) {
            this.treatmentError = resp.error;
          } else {
            this.treatmentMessage = resp.message || "Saved";
            this.fetchAppointments();
            // optionally refresh patients
            this.fetchPatients();
            setTimeout(() => this.closeTreatmentForm(), 800);
          }
        })
        .catch(err => {
          this.treatmentLoading = false;
          this.treatmentError = "Server error";
        });
    },

    // Cancel appointment (doctor)
    cancelAppointment(apptId) {
      if (!confirm("Cancel this appointment?")) return;
      fetch("/api/doctor/cancelAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        },
        body: JSON.stringify({ appointment_id: apptId })
      })
        .then(r => r.json())
        .then(resp => {
          if (resp.error) alert(resp.error);
          else {
            alert(resp.message || "Canceled");
            this.fetchAppointments();
            this.fetchPatients();
          }
        })
        .catch(err => console.error(err));
    },

    // Patients
    fetchPatients() {
      fetch("/api/doctor/patients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
      })
        .then(r => r.json())
        .then(data => {
          this.patients = data.patients || [];
        })
        .catch(err => console.error(err));
    },

    fetchPatientRecords(patientId) {
      this.showRecords = true;
      this.patientRecords = [];
      this.recordsPatientId = patientId;
      // find patient name locally from patients list
      const p = this.patients.find(x => x.patient_id_str === patientId);
      this.recordsPatientName = p ? p.name : "";

      fetch(`/api/doctor/patientRecords?patient_id=${patientId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
      })
        .then(r => r.json())
        .then(resp => {
          if (resp.error) {
            alert(resp.error);
            this.showRecords = false;
          } else {
            this.patientRecords = resp.records || [];
          }
        })
        .catch(err => {
          console.error(err);
          this.showRecords = false;
        });
    },

    closeRecords() {
      this.showRecords = false;
      this.patientRecords = [];
      this.recordsPatientName = "";
      this.recordsPatientId = "";
    },

    // view treatment for a past appointment (fetch treatment by appointment)
    viewTreatment(appt) {
      fetch(`/api/doctor/fetchTreatment?appointment_id=${appt.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
      })
        .then(r => r.json())
        .then(resp => {
          if (resp.error) {
            alert(resp.error);
          } else {
            const t = resp.treatment;
            if (!t) {
              alert("No treatment recorded for this appointment.");
            } else {
              alert(`Diagnosis:\n${t.diagnosis || 'N/A'}\n\nPrescription:\n${t.prescription || 'N/A'}`);
            }
          }
        })
        .catch(err => console.error(err));
    }
  },

  mounted() {
    this.fetchUserData();
  }
};
