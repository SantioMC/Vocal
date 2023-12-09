group = "me.santio.vocal.spigot"
version = rootProject.version

plugins {
    id("net.minecrell.plugin-yml.bukkit") version "0.6.0"
}

repositories {
    maven("https://hub.spigotmc.org/nexus/content/repositories/snapshots/")
}

dependencies {
    library(kotlin("stdlib"))
    implementation(project(":common"))
    compileOnly("org.spigotmc:spigot-api:1.20.2-R0.1-SNAPSHOT")
    implementation("net.kyori:adventure-platform-bukkit:4.3.1")
    implementation("net.kyori:adventure-text-minimessage:4.14.0")
}

bukkit {
    name = rootProject.name
    version = rootProject.version.toString()
    description = rootProject.description
    website = "https://github.com/SantioMC/Vocal"
    author = "Santio71"
    main = "me.santio.vocal.spigot.VocalSpigot"
    apiVersion = "1.13"

    commands {
        register("vocal") {
            description = "All commands related to Vocal"
            aliases = listOf("vc", "voice")
        }
    }
}