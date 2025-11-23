from flask import current_app as app, request, jsonify, render_template
from .database import db
#from .models import Transaction
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

    user = app.security.datastore.find_user(username=username)

    return jsonify({
        "username": user.username
    })