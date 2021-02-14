package misceland

class CategoriasController {

    def index(){
        respond(Categoria.list())
    }
}
