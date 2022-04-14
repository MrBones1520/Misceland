package misceland

import java.time.LocalDate

class BootStrap {

    def init = { servletContext ->
        new Company(
                name: 'Coca cola',
                mail: 'aldodanielsb@gmail.com',
                web: 'www.google.com',
                contact: 'dasd'
        ).save()

        new Employee(
                username: 'root',
                password: 'r',
                isAdmin: true,
                user: new Person(
                        firstName: "root",
                        lastName: 'root',
                        mob: LocalDate.now(),
                        personalEmail: "dsadas@email.com",
                        gender: 'masculino'
                )
        ).save()
    }

    def destroy = {
    }
}
