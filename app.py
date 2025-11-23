from flask import Flask
from application.database import db
from application.models import User,Role,Department
#from application.resources import api
from application.config import LocalDevelopmentConfig
from flask_security import Security, SQLAlchemyUserDatastore
from flask_security import hash_password
from werkzeug.security import generate_password_hash

def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    #api.init_app(app)
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    app.app_context().push()
    return app

app = create_app()

with app.app_context():
    db.create_all()

    app.security.datastore.find_or_create_role(name='admin', description='superuser of app')
    app.security.datastore.find_or_create_role(name='doctor', description='Doctor')
    app.security.datastore.find_or_create_role(name='patient', description='Patient')

    db.session.commit()

    if not app.security.datastore.find_user(email='admin@admin.com'):
        app.security.datastore.create_user(email='admin@admin.com',
                                           username='admin',
                                           password=generate_password_hash('1234'),
                                           roles=['admin'])
        
    
    departments = Department.query.all()
    if not departments:
        departments = [
            Department(name="Cardiology"),
            Department(name="Neurology"),
            Department(name="Oncology"),
            Department(name="Pediatrics")
        ]
        db.session.add_all(departments)

    db.session.commit()

from application.routes import *

if __name__ == '__main__':
    app.run()