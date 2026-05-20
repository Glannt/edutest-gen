# Stage 1: Build
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy gradle wrapper and configuration files
COPY gradle/ /app/gradle/
COPY gradlew /app/
COPY build.gradle /app/
COPY settings.gradle /app/

# Grant execution permissions and resolve dependencies
RUN chmod +x gradlew
RUN ./gradlew dependencies --no-daemon || true

# Copy source code and build package
COPY src/ /app/src/
RUN ./gradlew bootJar -x test --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Setup environment variables defaults
ENV SERVER_PORT=8080

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
