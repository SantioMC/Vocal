package me.santio.vocal.common.models.socket.movement

import java.util.UUID

data class NearbyEntity(
    val player: UUID,
    val relPos: Array<Double>
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as NearbyEntity

        if (player != other.player) return false
        if (!relPos.contentEquals(other.relPos)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = player.hashCode()
        result = 31 * result + relPos.contentHashCode()
        return result
    }
}
