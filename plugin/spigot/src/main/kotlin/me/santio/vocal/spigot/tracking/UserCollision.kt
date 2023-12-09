package me.santio.vocal.spigot.tracking

import org.bukkit.Location
import org.bukkit.entity.Player

/**
 * Handles checking if a user is close enough to another use, and gets their
 * relative location, it also handles deciding if events should even be sent
 * to the backend to prevent unnecessary updates.
 */
object UserCollision {

    /**
     * A more efficient way of checking if a player is within a certain distance
     * @param player The player to check
     * @param distance The distance to check
     * @return If the player is within the distance
     */
    private fun Player.isWithin(player: Player, distance: Double): Boolean {
        return location.distanceSquared(player.location) <= distance * distance
    }

    /**
     * Gets all the players that are within 20 blocks of the player, the cut-off point
     * is going to be a little lower than this, but we do this to ensure we're not having
     * weird cut-offs when people are talking / just out of range.
     * @param player The player to check
     * @return A set of players that are within 20 blocks of the player
     */
    fun getNearby(player: Player): Set<Player> {
        return player.world.players.filter {
            it != player && it.isWithin(player, 20.0)
        }.toSet()
    }

    fun Location.toCoordinates(): Array<Double> {
        return arrayOf(x, y, z)
    }

}