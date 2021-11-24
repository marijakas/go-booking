import os

from flask_restplus import Api
from flask import Blueprint
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager

from main import create_app, db

from main.controller.user_controller import api as user_ns
from main.controller.auth_controller import api as auth_ns
from main.model.user import User


from werkzeug.security import generate_password_hash


blueprint = Blueprint('api', __name__)

api = Api(blueprint,
          title='USER MICROSERVICE API',
          version='1.0',
          description='an api for user microservice'
        )

api.add_namespace(user_ns, path='/users')
api.add_namespace(auth_ns, path='/auth')

app = create_app(os.getenv('BOILERPLATE_ENV') or 'dev')
app.register_blueprint(blueprint)

app.app_context().push()

manager = Manager(app)

migrate = Migrate(app, db)

manager.add_command('db', MigrateCommand)

@manager.command
def run():
    app.run()

if __name__ == '__main__':
    try:
        print("usao")
        db.session.add(User(username='manager', email='adminpera@gmail.com', first_name="Pera", last_name="Peric", role="ROLE_ADMIN", password=generate_password_hash('123456')))
        db.session.add(User(username='worker', email='vodicmika@gmail.com', first_name="Mika", last_name="Mikic", role="ROLE_GUIDE", password=generate_password_hash('123456')))
        db.session.commit()
    except:
        print(" i ovde")
        pass
    run()
