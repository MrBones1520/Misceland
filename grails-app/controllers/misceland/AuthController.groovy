package misceland

import grails.artefact.Controller

class AuthController implements Controller{

    def login(){
        Employee employee = Employee.findWhere([username: params.username, password: params.password])
        employee ? "/accessSuccess" : "/accessFailed"
    }

    def logout(){
        session.invalidate()
    }
}
