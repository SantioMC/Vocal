plugins {
    kotlin("jvm") version "1.9.21"
    java
    `java-library`
    id("com.github.johnrengelman.shadow") version "8.0.0"
}

group = "me.santio"
version = "1.0"

allprojects {
    apply(plugin = "java")

    repositories {
        mavenCentral()
        mavenLocal()
    }

    java {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

subprojects {
    apply(plugin = "kotlin")
    apply(plugin = "java-library")
}

kotlin {
    jvmToolchain(8)
}

dependencies {
    implementation(project(":spigot"))
}