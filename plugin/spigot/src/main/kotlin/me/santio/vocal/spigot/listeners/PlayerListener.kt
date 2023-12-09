package me.santio.vocal.spigot.listeners

import me.santio.vocal.spigot.VocalSpigot
import me.santio.vocal.spigot.tracking.MovementTask
import org.bukkit.event.EventHandler
import org.bukkit.event.Listener
import org.bukkit.event.player.PlayerJoinEvent
import org.bukkit.event.player.PlayerQuitEvent
import java.util.UUID

class PlayerListener(private val plugin: VocalSpigot): Listener {

    private val tasks = mutableMapOf<UUID, MovementTask>()

    @EventHandler
    private fun onJoin(event: PlayerJoinEvent) {
        val player = event.player
        val task = MovementTask(plugin, player)
        task.task = player.server.scheduler.runTaskLaterAsynchronously(
            plugin,
            task,
            20
        )

        tasks[player.uniqueId] = task
    }

    @EventHandler
    private fun onQuit(event: PlayerQuitEvent) {
        val player = event.player
        tasks[player.uniqueId]?.task?.cancel()
        tasks.remove(player.uniqueId)
    }

}