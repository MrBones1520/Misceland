package misceland

import grails.rest.RestfulController
import grails.util.Environment

class ProductosController extends RestfulController<Producto>{

    ProductoService productoService
    int defaultMax = Environment.current == Environment.PRODUCTION ? Producto.count : 100

    ProductosController(){
        super(Producto)
    }

    def index(Integer max){
        int maxium = Math.min(max ?: defaultMax, defaultMax)
        respond(productoService.list([max: maxium]))
    }

}
