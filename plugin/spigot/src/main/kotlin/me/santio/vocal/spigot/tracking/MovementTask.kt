package me.santio.vocal.spigot.tracking

import me.santio.vocal.common.models.socket.movement.EntityLocation
import me.santio.vocal.common.models.socket.movement.NearbyEntity
import me.santio.vocal.spigot.VocalSpigot
import me.santio.vocal.spigot.tracking.UserCollision.toCoordinates
import org.bukkit.entity.Player
import org.bukkit.scheduler.BukkitTask
import org.bukkit.util.Vector

class MovementTask(
    private val plugin: VocalSpigot,
    private val player: Player
): Runnable {

    private var lastPos: Vector = player.location.toVector()
    private var isNearby = false

    lateinit var task: BukkitTask

    override fun run() {
        if (!player.isOnline) return task.cancel()

        val nearby = UserCollision.getNearby(player)
        if (nearby.isEmpty()) {
            if (isNearby) {
                isNearby = false

                plugin.socket.sendMovement(
                    EntityLocation(
                        player.uniqueId,
                        emptyList()
                    )
                )

            }

            return reschedule(10)
        } else if (!isNearby) isNearby = true

        val playerCords = player.location.toCoordinates()
        if (!moved) return reschedule(1)

        val data = EntityLocation(
            player.uniqueId,
            nearby.map {
                val location = it.location.toCoordinates()
                NearbyEntity(
                    it.uniqueId,
                    arrayOf(
                        (location[0] - playerCords[0]).toLossy(),
                        (location[1] - playerCords[1]).toLossy(),
                        (location[2] - playerCords[2]).toLossy()
                    )
                )
            }
        )

        lastPos = player.location.toVector()
        plugin.socket.sendMovement(data)

        reschedule(1)
    }

    private fun reschedule(delay: Long) {
        task = player.server.scheduler.runTaskLaterAsynchronously(
            plugin,
            this,
            delay
        )
    }

    private val moved: Boolean
        get() {
            return player.location.toVector().distanceSquared(lastPos) > 0.25 * 0.25
        }

    private fun Double.toLossy(): Double {
        return String.format("%.2f", this).toDouble()
    }

}