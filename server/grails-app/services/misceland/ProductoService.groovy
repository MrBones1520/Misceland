package misceland

class ProductoService {

    Producto get(Serializable id){
        Producto.get(id)
    }

    List<Producto> list(def params){
        Producto.list(params)
    }

    int getCount(){
        Producto.count
    }

}
