package misceland

import com.github.javafaker.Faker
import grails.util.Environment
import groovy.util.logging.Slf4j

@Slf4j
class BootStrap {

    def init = {
        if (Environment.current in [Environment.TEST, Environment.DEVELOPMENT])
            create_fake_data()
    }

    def destroy = {
    }

    private create_fake_data(){
        log.info("Create fake data")

        Faker faker = new Faker(new Locale("es-MX"))
        Random r = new Random()
        def categorias = [] as List<Categoria>
        def productos = [] as List<Producto>
        10.times {
            categorias.add(new Categoria(nombre: faker.commerce().department(),impuesto: r.nextInt(100)))
        }
        Categoria.withNewTransaction {
            Categoria.saveAll(categorias)
        }
        100.times {
            productos.add(new Producto(
                    codigo: faker.code().gtin13(),
                    nombre: faker.commerce().productName(),
                    categoria: categorias.get(r.nextInt(categorias.size())),
                    contenido: faker.food().ingredient(),
                    precio: faker.commerce().price(),
                    descripcion: faker.rickAndMorty().character())
            )
        }
        Producto.withNewTransaction {
            Producto.saveAll(productos)
        }
    }

}
