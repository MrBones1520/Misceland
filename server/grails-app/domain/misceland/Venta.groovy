package misceland

import msutil.Constant
import org.grails.datastore.gorm.GormEntity
import request.VentaItemRequest

import java.time.LocalDate

class Venta implements GormEntity<Venta>{

    String codigo
    String nombre
    String contenido
    String descripcion
    String categoriaNombre
    int categoriaImpuesto
    BigDecimal precio
    int cantidad
    BigDecimal subtotal
    LocalDate fechaCompra

    Venta(Producto producto, VentaItemRequest item){
        this.codigo = producto.codigo
        this.nombre = producto.nombre
        this.categoriaNombre = producto.categoria.nombre
        this.contenido = producto.contenido
        this.descripcion = producto.descripcion
        this.precio = producto.precio
        this.cantidad = item.cantidad
        this.subtotal = producto.precio * item.cantidad
        this.fechaCompra = item.fechaCompra
        this.categoriaImpuesto = producto.categoria.impuesto
    }

    Venta(def args) {
        this.codigo = args[1]
        this.nombre = args[2]
        this.categoriaNombre = args[3].toString().intern()
        this.contenido = args[4]
        this.descripcion = args[5]
        this.precio = args[6].toString().toBigDecimal()
        this.cantidad = args[7].toString().toInteger()
        this.subtotal = args[8].toString().toBigDecimal()
        this.fechaCompra = LocalDate.parse(args[10].toString().replaceAll("/","-"), Constant.formatter)
        this.categoriaImpuesto = args[11].toString().toInteger()
    }

    static mapping = {
        version false
    }

}
