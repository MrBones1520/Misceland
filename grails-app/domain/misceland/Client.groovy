package misceland

import grails.rest.Resource

@Resource
class Client {

    Person personInfo

    def hasOne = [sales: Sale]

    static mapping = {
        version false
        gender inList: ['masculino', 'femenino']
        personalEmail email: true
    }

}
