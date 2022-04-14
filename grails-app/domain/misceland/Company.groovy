package misceland

import org.grails.datastore.gorm.GormEntity
import grails.rest.Resource

@Resource
class Company implements GormEntity<Company> {

    String name
    String mail
    String web
    String contact

    def hasMany = [articles: Article]

    static mapping = {
        version false
        mail email: true
    }

}
