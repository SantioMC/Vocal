package me.santio.vocal.common.models.socket.movement

import me.santio.vocal.common.Vocal
import java.util.*

data class EntityLocation(
    val player: UUID,
    val nearby: List<NearbyEntity>,
    val server: String = Vocal.uniqueId
)