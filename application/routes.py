from flask import current_app as app, request, jsonify, render_template
from .database import db
from .models import Doctor
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
    print(user.roles[0].name)
    return {
        "username": user.username,
        "auth-token": user.get_auth_token()
    }


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
    
@app.route('/api/register', methods=['POST'])
def register_user():
    if request.is_json:
        credentials = request.get_json()
        if not app.security.datastore.find_user(email=credentials["email"]):
            app.security.datastore.create_user(email=credentials["email"],
                                            username=credentials["username"],
                                            password=generate_password_hash(credentials["password"]),
                                            roles=['patient'])
            db.session.commit()

            return jsonify({
                'message': "user successfully created."
            }), 201
        
        return jsonify({
            'message': "user already exists."
        }), 400
    

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
        if radio_val == 'doctor':
            for user in users:
                arr.append({
                    "email": user.email,
                    "username": user.username,
                    "doctorID": user.doctor_id

                })

        else:
            for user in users:
                arr.append({
                    "email": user.email,
                    "username": user.username,
                    "patientID": user.patient_id

                })
        return jsonify(arr)
    else:
        user = app.security.datastore.find_user(username=username)
        arr = []
        arr.append({
            "email": user.email,
            "username": user.username,
            "doctorID": user.doctor_id
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
                                           password=doc_info["password"],
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