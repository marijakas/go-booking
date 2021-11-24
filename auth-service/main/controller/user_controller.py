from flask_restplus import Resource

from ..service.user_service import get_all_registered_users, get_all_admins, get_all_guides, delete_user

from ..util.dto import UserDto

api = UserDto.api
_user = UserDto.user


@api.route('/registered-users')
class RegisteredUserList(Resource):
    @api.doc('list_of_registered_users')
    @api.marshal_list_with(_user)
    def get(self):
        return get_all_registered_users()


@api.route('/guides')
class GuidesList(Resource):
    @api.doc('list_of_all_guides')
    @api.marshal_list_with(_user)
    def get(self):
        return get_all_guides()


@api.route('/admins')
class AdminssList(Resource):
    @api.doc('list_of_all_admins')
    @api.marshal_list_with(_user)
    def get(self):
        return get_all_admins()


@api.route('/<id>')
@api.param('id', 'The User identifier')
@api.response(404, 'User not found.')
class User(Resource):
    @api.doc('delete user')
    def delete(self, id):
        return delete_user(id)