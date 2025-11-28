from flask import current_app as app, request, jsonify, render_template
from .database import db
from .models import Doctor, Patient
from flask_security import hash_password,verify_password,auth_required,roles_required,roles_accepted,current_user,login_user,logout_user
from werkzeug.security import generate_password_hash, check_password_hash

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/api/home', methods=['GET'])
@auth_required('token')
@roles_accepted('admin','doctor','patient')
def dashboard():
    user = current_user
    role = user.roles[0].name
    print(user.roles[0].name)

    if role == "doctor":
        doc = Doctor.query.filter_by(doctor_id=user.doctor_id).first()
        return jsonify({
            "email": user.email,
            "username": user.username,
            "doctor_id": user.doctor_id,
            "name": doc.name,
            "department": doc.dept_name if doc else None,
            "role": "doctor",
            "authToken": user.get_auth_token()
        })
    elif role == "patient":
        pat = Patient.query.filter_by(patient_id=user.patient_id).first()
        return jsonify({
            "email": user.email,
            "username": user.username,
            "patient_id": user.patient_id,
            "name": pat.name if pat else None,
            "age": pat.age if pat else None,
            "role": "patient",
            "authToken": user.get_auth_token()
        })
    return jsonify({
        "email": user.email,
        "username": user.username,
        "role": "admin",
        "authToken": user.get_auth_token()
    })


@app.route('/api/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body["email"]
    password = body["password"]

    if not email:
        return{
            "message": "email is required"
        }
    
    user = app.security.datastore.find_user(email = email)

    if user:
        if check_password_hash(user.password, password):
            '''
            if current_user:          # this is not correct. Figure out how to access session in Flask-Security
                return jsonify({
                    "message": "User already logged in"
                }), 400
            '''
            login_user(user)
            return jsonify({
                "id": user.id,
                "username": user.username,
                "role": user.roles[0].name,
                "auth-token": user.get_auth_token()
            })
        else:
            return jsonify({
                "message": "Incorrect password"
            }), 400
    else:
        return jsonify({
            "message": "User not found"
        })
    
@app.route('/api/logout', methods=['GET'])
def logout():
    logout_user()
    return jsonify({
        "message": "User removed from session and localStorage"
    }), 200

# Generate a new patient id
def generate_patient_id():
    last_patient = Patient.query.order_by(Patient.id.desc()).first()
    if not last_patient:
        return "PAT1"
    last_num = int(last_patient.patient_id.replace("PAT", ""))
    return f"PAT{last_num + 1}"


@app.route('/api/register', methods=['POST'])
def register_user():
    if request.is_json:
        credentials = request.get_json()

        # check if user exists
        if app.security.datastore.find_user(email=credentials["email"]):
            return jsonify({'message': "user already exists."}), 400

        # generate new patient id
        new_patient_id = generate_patient_id()

        # create user with patient role + patient_id
        user = app.security.datastore.create_user(
            email=credentials["email"],
            username=credentials["username"],
            password=generate_password_hash(credentials["password"]),
            roles=['patient'],
            patient_id=new_patient_id
        )

        # also create entry in Patient table
        patient = Patient(
            patient_id=new_patient_id,
            name=credentials["name"],
            age=credentials.get("age", None)   # optional age field
        )

        db.session.add(patient)
        db.session.commit()

        return jsonify({
            'message': "patient successfully registered.",
            'patient_id': new_patient_id
        }), 201

    

@app.route("/api/searchUsers", methods=["POST"])
@auth_required("token")
@roles_required("admin")
def search_users():
    search_items = request.get_json()
    username = search_items["text"]
    radio_val = search_items["radioVal"]

    if radio_val:
        role = app.security.datastore.find_role(radio_val)
        users = role.bearer  # list of User objects
        arr = []
        if radio_val == 'doctor' and (not username):
            for user in users:
                doctor = Doctor.query.filter_by(doctor_id=user.doctor_id).first()
                arr.append({
                    "email": user.email,
                    "username": user.username,
                    "doctorID": user.doctor_id,
                    "dept_name": doctor.dept_name,
                    "name": doctor.name

                })

        elif radio_val == 'doctor' and username:  #username contains department name here
            department = username
            doctors = Doctor.query.filter_by(dept_name=department).all()
            for doctor in doctors:
                user_info = app.security.datastore.find_user(doctor_id=doctor.doctor_id)
                arr.append({
                    "email": user_info.email,
                    "username": user_info.username,
                    "doctorID": user_info.doctor_id,
                    "dept_name": doctor.dept_name,
                    "name": doctor.name

                })
            
        else:
            for user in users:
                patient = Patient.query.filter_by(patient_id=user.patient_id).first()
                arr.append({
                    "email": user.email,
                    "username": user.username,
                    "patientID": user.patient_id,
                    "name": patient.name,
                    "age": patient.age

                })
        return jsonify(arr)
    else:
        user = app.security.datastore.find_user(username=username)
        doctor = Doctor.query.filter_by(doctor_id=user.doctor_id).first()
        arr = []
        arr.append({
            "email": user.email,
            "username": user.username,
            "doctorID": user.doctor_id,
            "dept_name": doctor.dept_name,
            "name": doctor.name
        })

        return jsonify(arr)
    


@app.route("/api/addDoctor", methods=["POST"])
@auth_required("token")
@roles_required("admin")
def add_doctor():
    doc_info = request.get_json()

    if not app.security.datastore.find_user(email = doc_info["email"]):
        app.security.datastore.create_user(email = doc_info["email"],
                                           username=doc_info["username"],
                                           doctor_id=doc_info["doctorID"],
                                           password=generate_password_hash(doc_info["password"]),
                                           roles=["doctor"])
        
        doctor = Doctor(doctor_id=doc_info["doctorID"],
                        name=doc_info["username"],
                        dept_name=doc_info["spec"])
    
        db.session.add(doctor)
        db.session.commit()

        return {
            "message": "Doctor successfully added"
        }
    else:
        return {
            "message": "Doctor is already added"
        }
    
@app.route("/api/updateDoctor", methods=["POST"])
@auth_required("token")
@roles_required("admin")
def update_doctor():
    data = request.get_json()

    doctorID = data.get("doctorID")

    # update User table
    user = app.security.datastore.find_user(doctor_id=doctorID)
    if not user:
        return {"message": "Doctor not found"}, 404

    # update only modified fields
    user.email = data.get("email", user.email)
    user.username = data.get("username", user.username)

    # update Doctor table
    doctor = Doctor.query.filter_by(doctor_id=doctorID).first()
    if doctor:
        doctor.name = data.get("username", doctor.name)
        doctor.dept_name = data.get("spec", doctor.dept_name)

    db.session.commit()

    return {"message": "Doctor information updated successfully"}

@app.route("/api/updateDoctorInfo", methods=["POST"])
@auth_required("token")
@roles_required("doctor")
def update_doctor_info():
    data = request.get_json()
    doctor_id = data.get("doctor_id")

    # Update User table
    user = app.security.datastore.find_user(doctor_id=doctor_id)
    if not user:
        return {"message": "Doctor not found"}, 404

    user.email = data.get("email", user.email)
    user.username = data.get("username", user.username)

    # Update Doctor table
    doctor = Doctor.query.filter_by(doctor_id=doctor_id).first()
    if doctor:
        doctor.name = data.get("name", doctor.name)
        doctor.dept_name = data.get("department", doctor.dept_name)

    db.session.commit()

    return {"message": "Patient information updated successfully"}


# ---------- Doctor-specific endpoints ----------
from flask import current_app as app, request, jsonify
from .database import db
from .models import Doctor, Patient, Appointment, Treatment
from flask_security import auth_required, roles_required, current_user
from datetime import datetime

# Get appointments for logged-in doctor (upcoming + past)
@app.route("/api/doctor/appointments", methods=["GET"])
@auth_required("token")
@roles_required("doctor")
def doctor_appointments():
    user = current_user
    # find doctor record using user's doctor_id
    doctor = Doctor.query.filter_by(doctor_id=user.doctor_id).first()
    if not doctor:
        return jsonify({"error": "Doctor record not found"}), 404

    # fetch appointments for this doctor, most-recent first
    appts = Appointment.query.filter_by(doctor_id=doctor.id).order_by(Appointment.date.desc(), Appointment.time.desc()).all()

    upcoming = []
    past = []
    today = datetime.utcnow().date()

    for a in appts:
        patient = Patient.query.get(a.patient_id)
        entry = {
            "id": a.id,
            "patient_name": patient.name if patient else None,
            "patient_id_str": patient.patient_id if patient else None,
            "date": a.date,
            "time": a.time,
            "appointment_status": a.appointment_status,
            "details": a.details
        }

        # parse date for classification (default to past if parse fails)
        try:
            d_obj = datetime.strptime(a.date, "%Y-%m-%d").date()
        except Exception:
            d_obj = None

        if a.appointment_status == "canceled":
            past.append(entry)
        elif d_obj and d_obj >= today and a.appointment_status in ("scheduled", "rescheduled"):
            upcoming.append(entry)
        else:
            past.append(entry)

    return jsonify({"upcoming": upcoming, "past": past}), 200


# Complete appointment: doctor writes diagnosis & prescription and marks completed
@app.route("/api/doctor/completeAppointment", methods=["POST"])
@auth_required("token")
@roles_required("doctor")
def complete_appointment():
    req = request.get_json() or {}
    appointment_id = req.get("appointment_id")
    diagnosis = req.get("diagnosis", "")
    prescription = req.get("prescription", "")

    if not appointment_id:
        return jsonify({"error": "appointment_id required"}), 400

    user = current_user
    doctor = Doctor.query.filter_by(doctor_id=user.doctor_id).first()
    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404

    appt = Appointment.query.get(appointment_id)
    if not appt or appt.doctor_id != doctor.id:
        return jsonify({"error": "Appointment not found or unauthorized"}), 404

    # Create or update Treatment record tied to appointment
    treat = Treatment.query.filter_by(appointment_id=appt.id).first()
    if treat:
        treat.diagnosis = diagnosis
        treat.prescription = prescription
    else:
        treat = Treatment(appointment_id=appt.id, diagnosis=diagnosis, prescription=prescription)
        db.session.add(treat)

    appt.appointment_status = "completed"
    db.session.commit()

    return jsonify({"message": "Appointment completed and treatment saved"}), 200


# Doctor cancels an appointment
@app.route("/api/doctor/cancelAppointment", methods=["POST"])
@auth_required("token")
@roles_required("doctor")
def doctor_cancel_appointment():
    data = request.get_json() or {}
    appointment_id = data.get("appointment_id")
    if not appointment_id:
        return jsonify({"error": "appointment_id required"}), 400

    user = current_user
    doctor = Doctor.query.filter_by(doctor_id=user.doctor_id).first()
    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404

    appt = Appointment.query.get(appointment_id)
    if not appt or appt.doctor_id != doctor.id:
        return jsonify({"error": "Appointment not found or unauthorized"}), 404

    appt.appointment_status = "canceled"
    db.session.commit()
    return jsonify({"message": "Appointment canceled"}), 200


# Get list of patients assigned to this doctor (distinct patients who have appointments)
@app.route("/api/doctor/patients", methods=["GET"])
@auth_required("token")
@roles_required("doctor")
def doctor_patients():
    user = current_user
    doctor = Doctor.query.filter_by(doctor_id=user.doctor_id).first()
    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404

    # find distinct patient ids from appointments for this doctor
    patient_ids = db.session.query(Appointment.patient_id).filter_by(doctor_id=doctor.id).distinct().all()
    # patient_ids is list of tuples like [(3,), (4,), ...]
    ids = [pid[0] for pid in patient_ids if pid[0] is not None]
    patients = Patient.query.filter(Patient.id.in_(ids)).all()

    out = []
    for p in patients:
        out.append({
            "patient_id_str": p.patient_id,
            "name": p.name,
            "age": p.age
        })
    return jsonify({"patients": out}), 200


# Get all diagnosis + prescription records for a patient (only for this doctor)
@app.route("/api/doctor/patientRecords", methods=["GET"])
@auth_required("token")
@roles_required("doctor")
def doctor_patient_records():
    patient_id_str = request.args.get("patient_id")
    if not patient_id_str:
        return jsonify({"error": "patient_id required"}), 400

    user = current_user
    doctor = Doctor.query.filter_by(doctor_id=user.doctor_id).first()
    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404

    patient = Patient.query.filter_by(patient_id=patient_id_str).first()
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    # Find appointment IDs for this doctor & patient
    appts = Appointment.query.filter_by(doctor_id=doctor.id, patient_id=patient.id).all()
    appt_ids = [a.id for a in appts]
    if not appt_ids:
        return jsonify({"records": []}), 200

    # Get treatments whose appointment_id in appt_ids
    treats = Treatment.query.filter(Treatment.appointment_id.in_(appt_ids)).order_by(Treatment.id.desc()).all()
    records = []
    for t in treats:
        appt = Appointment.query.get(t.appointment_id)
        records.append({
            "appointment_id": t.appointment_id,
            "date": appt.date if appt else None,
            "time": appt.time if appt else None,
            "diagnosis": t.diagnosis,
            "prescription": t.prescription
        })

    return jsonify({"records": records}), 200



########################################################################
########################################################################

################### Patient dashboard routes #######################
@app.route("/api/updatePatient", methods=["POST"])
@auth_required("token")
@roles_required("patient")
def update_patient():
    data = request.get_json()
    patient_id = data.get("patient_id")

    # Update User table
    user = app.security.datastore.find_user(patient_id=patient_id)
    if not user:
        return {"message": "Patient not found"}, 404

    user.email = data.get("email", user.email)
    user.username = data.get("username", user.username)

    # Update Patient table
    patient = Patient.query.filter_by(patient_id=patient_id).first()
    if patient:
        patient.name = data.get("name", patient.name)
        patient.age = data.get("age", patient.age)

    db.session.commit()

    return {"message": "Patient information updated successfully"}


from flask import current_app as app, request, jsonify
from .database import db
from .models import Doctor, Patient, Appointment, Treatment
from flask_security import auth_required, roles_required, current_user
from datetime import datetime

# ----- Search doctors (name or specialization) -----
@app.route("/api/searchDoctors", methods=["POST"])
@auth_required("token")
@roles_required("patient")
def search_doctors():
    data = request.get_json() or {}
    q = (data.get("search") or "").strip()
    by = data.get("by", "name")

    results = []
    if by == "specialization":
        # match by department name (case-insensitive)
        doctors = Doctor.query.filter(Doctor.dept_name.ilike(f"%{q}%")).all() if q else Doctor.query.all()
    else:
        # match by doctor name or username in users table
        # search Doctor.name first, then user linked by doctor_id
        doctors = []
        if q:
            doctors += Doctor.query.filter(Doctor.name.ilike(f"%{q}%")).all()
            # find users whose username matches
            User = app.security.datastore.user_model
            users = User.query.filter(
                getattr(app.security.datastore.user_model, 'username').ilike(f"%{q}%")
            ).all()
            for u in users:
                if u.doctor_id:
                    d = Doctor.query.filter_by(doctor_id=u.doctor_id).first()
                    if d and d not in doctors:
                        doctors.append(d)
        else:
            doctors = Doctor.query.all()

    for d in doctors:
        user = app.security.datastore.find_user(doctor_id=d.doctor_id)
        results.append({
            "doctor_id": d.doctor_id,
            "name": d.name,
            "dept_name": d.dept_name,
            "username": user.username if user else None,
            "email": user.email if user else None
        })

    return jsonify(results), 200

# ----- Helper: check availability (no other scheduled appointment for same doctor/date/time) -----
def is_doctor_available(doctor_obj, date_str, time_str, exclude_appointment_id=None):
    # simple collision check: same date and time
    appt_q = Appointment.query.filter_by(doctor_id=doctor_obj.id, date=date_str, time=time_str)
    if exclude_appointment_id:
        appt_q = appt_q.filter(Appointment.id != exclude_appointment_id)
    # consider scheduled/rescheduled as blocking; ignore canceled
    appt_q = appt_q.filter(Appointment.appointment_status != 'canceled')
    return appt_q.first() is None

# ----- Book appointment -----
@app.route("/api/bookAppointment", methods=["POST"])
@auth_required("token")
@roles_required("patient")
def book_appointment():
    data = request.get_json() or {}
    patient_id_str = data.get("patient_id")
    doctor_id_str = data.get("doctor_id")
    date_str = data.get("date")
    time_str = data.get("time")
    details = data.get("details", "")

    if not (patient_id_str and doctor_id_str and date_str and time_str):
        return jsonify({"error": "Missing fields: patient_id, doctor_id, date, time required"}), 400

    # find patient and doctor records
    patient = Patient.query.filter_by(patient_id=patient_id_str).first()
    doctor = Doctor.query.filter_by(doctor_id=doctor_id_str).first()
    if not patient or not doctor:
        return jsonify({"error": "Doctor or patient not found"}), 404

    # check availability
    if not is_doctor_available(doctor, date_str, time_str):
        return jsonify({"error": "The doctor is not available at the selected date/time."}), 409

    # create appointment. Appointment.doctor_id / patient_id are integer foreign keys to their .id
    appt = Appointment(
        doctor_id=doctor.id,
        patient_id=patient.id,
        appointment_status="scheduled",
        date=date_str,
        time=time_str,
        details=details
    )
    db.session.add(appt)
    db.session.commit()

    return jsonify({"message": "Appointment booked successfully", "appointment_id": appt.id}), 201

# ----- Get appointments (for current user). Returns upcoming and past based on date comparison -----
@app.route("/api/getAppointments", methods=["GET"])
@auth_required("token")
@roles_required("patient")
def get_appointments():
    # current_user has user.patient_id - find Patient row
    user = current_user
    patient = Patient.query.filter_by(patient_id=user.patient_id).first()
    if not patient:
        return jsonify({"upcoming": [], "past": []})

    today = datetime.utcnow().date()

    appts = Appointment.query.filter_by(patient_id=patient.id).order_by(Appointment.date.desc(), Appointment.time.desc()).all()
    upcoming = []
    past = []
    for a in appts:
        # convert to date object for comparison. Expect date stored as 'YYYY-MM-DD'
        try:
            d_obj = datetime.strptime(a.date, "%Y-%m-%d").date()
        except Exception:
            d_obj = None

        doctor = Doctor.query.get(a.doctor_id)
        entry = {
            "id": a.id,
            "doctor_name": doctor.name if doctor else None,
            "doctor_dept": doctor.dept_name if doctor else None,
            "doctor_id_str": doctor.doctor_id if doctor else None,
            "date": a.date,
            "time": a.time,
            "appointment_status": a.appointment_status,
            "details": a.details
        }

        if a.appointment_status == "canceled":
            # treat canceled as past for listing.
            past.append(entry)
        elif d_obj and d_obj >= today and a.appointment_status in ("scheduled", "rescheduled"):
            upcoming.append(entry)
        else:
            # any completed/rescheduled in past counted as past
            past.append(entry)

    return jsonify({"upcoming": upcoming, "past": past}), 200

# ----- Reschedule appointment -----
@app.route("/api/rescheduleAppointment", methods=["POST"])
@auth_required("token")
@roles_required("patient")
def reschedule_appointment():
    data = request.get_json() or {}
    appointment_id = data.get("appointment_id")
    patient_id_str = data.get("patient_id")
    new_date = data.get("date")
    new_time = data.get("time")

    if not (appointment_id and patient_id_str and new_date and new_time):
        return jsonify({"error": "Missing fields"}), 400

    user = current_user
    # verify patient owns appointment
    patient = Patient.query.filter_by(patient_id=patient_id_str).first()
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    appt = Appointment.query.get(appointment_id)
    if not appt or appt.patient_id != patient.id:
        return jsonify({"error": "Appointment not found or unauthorized"}), 404

    doctor = Doctor.query.get(appt.doctor_id)
    if not doctor:
        return jsonify({"error": "Doctor record not found"}), 404

    # check availability excluding this appointment id
    if not is_doctor_available(doctor, new_date, new_time, exclude_appointment_id=appointment_id):
        return jsonify({"error": "Doctor is not available at the selected new date/time."}), 409

    appt.date = new_date
    appt.time = new_time
    appt.appointment_status = "rescheduled"
    # optionally update details
    if "details" in data:
        appt.details = data.get("details")

    db.session.commit()
    return jsonify({"message": "Appointment rescheduled successfully", "appointment_id": appt.id}), 200

# ----- Cancel appointment -----
@app.route("/api/cancelAppointment", methods=["POST"])
@auth_required("token")
@roles_required("patient")
def cancel_appointment():
    data = request.get_json() or {}
    appointment_id = data.get("appointment_id")
    patient_id_str = data.get("patient_id")
    if not (appointment_id and patient_id_str):
        return jsonify({"error": "Missing fields"}), 400

    patient = Patient.query.filter_by(patient_id=patient_id_str).first()
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    appt = Appointment.query.get(appointment_id)
    if not appt or appt.patient_id != patient.id:
        return jsonify({"error": "Appointment not found or unauthorized"}), 404

    appt.appointment_status = "canceled"
    db.session.commit()
    return jsonify({"message": "Appointment canceled successfully"}), 200

# ----- Get prescription for appointment (if exists) -----
@app.route("/api/getPrescription", methods=["GET"])
@auth_required("token")
@roles_required("patient")
def get_prescription():
    appointment_id = request.args.get("appointment_id")
    if not appointment_id:
        return jsonify({"error": "appointment_id required"}), 400
    appt = Appointment.query.get(appointment_id)
    if not appt:
        return jsonify({"error": "Appointment not found"}), 404

    # find treatment(s) linked to this appointment
    treat = Treatment.query.filter_by(appointment_id=appt.id).first()
    if not treat:
        return jsonify({"diagnosis": None, "prescription": None}), 200

    return jsonify({"diagnosis": treat.diagnosis, "prescription": treat.prescription}), 200
