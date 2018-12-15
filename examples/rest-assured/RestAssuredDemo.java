import static io.restassured.RestAssured.given;
import org.testng.annotations.Test;

public class RestAssuredDemo {

    @Test
    public void makeSureThatGoogleIsUp() {
        given()//
            .when()//
                .get("http://www.google.com")//
            .then()//
                .statusCode(200);
    }

}
