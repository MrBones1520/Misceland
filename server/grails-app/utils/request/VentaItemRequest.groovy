package request

import exception.ProductoIncomplete

import java.time.LocalDateTime

class VentaItemRequest {

    String codigo

    int cantidad

    LocalDateTime fechaCompra

    VentaItemRequest(def args){
        this.codigo = args.get("codigo", null)
        this.cantidad = args.cantidad.toInteger()
        this.fechaCompra = args.get("fechaCompra", LocalDateTime.now())
        if(!this.codigo)
            throw new ProductoIncomplete("Item Venta not found by Codigo")
    }

}
