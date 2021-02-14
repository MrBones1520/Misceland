package misceland;

import org.grails.datastore.gorm.GormEntity;

class Categoria implements GormEntity<Categoria> {

    String nombre
    int impuesto

    String toString(){ "${nombre} - %${impuesto}" }

    static mapping = {
        version false
        nombre unique: true
    }

    static constraints = {
        impuesto range: (0..100)
    }
}
