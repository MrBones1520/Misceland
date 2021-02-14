FROM openjdk:8-alpine3.9

WORKDIR /app

ADD ./build/server*.jar /app/app.jar

ENTRYPOINT ["java", "-jar", "/app/app.jar"]