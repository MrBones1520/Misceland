package misceland

import grails.rest.Resource

@Resource
class Person {

    String firstName
    String lastName

    Date mob
    String personalEmail

    String gender

    static mapping = {
        version false
        gender inList: ['masculino', 'femenino']
        personalEmail email: true
        lastName blank: true
    }

}
