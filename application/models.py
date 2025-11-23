from .database import db
from flask_security import UserMixin, RoleMixin

# Assumes you have a 'roles_users' table for Many-to-Many, 
# or we keep your One-to-Many if you strictly want 1 role per user.
# I have cleaned up the syntax below.

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    active = db.Column(db.Boolean(), nullable=False)

    roles = db.relationship('Role', backref='bearer', secondary='users_roles')
    

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255))

class usersRoles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))


class Doctor(db.Model): # Inherit from User, not db.Model
    # We point the ID to the User table
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    dept_id = db.Column(db.String, db.ForeignKey('department.id'))

    appointments = db.relationship('Appointment', backref='doctor')


    
class Patient(db.Model): # Inherit from User, not db.Model
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    age = db.Column(db.Integer)
    
    appointments = db.relationship('Appointment', backref='patient')

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'))
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    appointment_status = db.Column(db.String, nullable=False)

    date = db.Column(db.String)
    time = db.Column(db.String)

    details = db.Column(db.String(255))

class Treatment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.String, db.ForeignKey('appointment.id'))
    diagnosis = db.Column(db.String)
    prescription = db.Column(db.String)


class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    doctor = db.relationship('Doctor', backref='department')


'''
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    fs_uniquifier = db.Column(db.String, unique=True , nullable=False)
    active = db.Column(db.Boolean, nullable=False)
    roles = db.relationship('Role', backref='bearer', secondary='users_roles')
    trans = db.relationship('Transaction', backref='bearer')

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)

class UsersRoles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))
'''