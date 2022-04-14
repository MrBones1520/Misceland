import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import misceland.Article
import spock.lang.Specification

@Integration
@Rollback
class ArticleSpec extends Specification{

    void setup(){
        new Article(name: 'Gansito')
    }

    void "test Sale"(){
        given:
        setup()

        expect:
        Article.count == 1
    }

}
