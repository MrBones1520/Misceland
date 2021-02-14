package misceland

import groovy.transform.ToString
import org.grails.datastore.gorm.GormEntity
import java.time.LocalDate
import grails.gorm.async.*

@ToString
class Producto implements GormEntity<Producto>, AsyncEntity<Producto>{

    String codigo
    String nombre
    String contenido
    String descripcion
    Categoria categoria
    BigDecimal precio

    LocalDate dateCreated
    LocalDate lastUpdated

    static mapping = {
        version false
        id name: 'codigo', unique: true, generator: 'assigned'
        categoria fetch: 'join'
    }

    static constraints = {
        descripcion nullable: true, blank: true
    }

}
