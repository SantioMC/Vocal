package me.santio.vocal.spigot

import me.santio.vocal.common.Vocal
import me.santio.vocal.common.VocalRestService
import me.santio.vocal.common.VocalWebSocket
import me.santio.vocal.spigot.commands.VocalMainCommand
import me.santio.vocal.spigot.commands.sub.ConnectCommand
import me.santio.vocal.spigot.commands.sub.LinkCommand
import me.santio.vocal.spigot.listeners.PlayerListener
import net.kyori.adventure.platform.bukkit.BukkitAudiences
import org.bukkit.Bukkit
import org.bukkit.plugin.java.JavaPlugin

internal lateinit var audience: BukkitAudiences
    private set

class VocalSpigot: JavaPlugin() {

    lateinit var rest: VocalRestService
    lateinit var socket: VocalWebSocket

    override fun onEnable() {
        saveDefaultConfig()
        audience = BukkitAudiences.create(this)

        // Get the service for contacting the backend rest api
        rest = Vocal.getRestfulAPI(
            config.getString("api-url") ?: "http://localhost:3000",
            config.getString("app-token")
        )

        // Get the socket for sending data to and from the backend
        socket = Vocal.getSocket(
            config.getString("socket") ?: "ws://localhost:3001",
            config.getString("app-token")
        )

        // Register the listeners
        Bukkit.getPluginManager().registerEvents(PlayerListener(this), this)

        val command = VocalMainCommand(this)
        getCommand("vocal")?.setExecutor(command)
        command.register(LinkCommand, ConnectCommand)
    }

    override fun onDisable() {
        audience.close()
        socket.close()
    }


}