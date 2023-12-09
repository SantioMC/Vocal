package me.santio.vocal.common.models.rest.link

import java.util.UUID

data class LinkRequest(
    val uuid: UUID,
    val username: String
)