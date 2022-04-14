package misceland

import grails.rest.Resource
import org.grails.datastore.gorm.GormEntity

@Resource
class Employee implements GormEntity<Employee>, Serializable{

    private static final long serialVersionUID = 1

    String username
    String password
    Person personInfo
    boolean isAdmin

    def hasMany = [sales: Sale]

    static constraints = {
        password blank: false, password: true
        username blank: false, unique: true
    }

    static mapping = {
        version false
    }

}
