package misceland

import grails.rest.Resource
import org.grails.datastore.gorm.GormEntity

@Resource
class Article implements GormEntity<Article> {

    String name
    String content
    String description
    Company company

    double price

    def hasMany = [sales: Sale]

    static constraints = {
        description blank: true
    }

    static mapping = {
        version false
        batchSize 50
    }

}
