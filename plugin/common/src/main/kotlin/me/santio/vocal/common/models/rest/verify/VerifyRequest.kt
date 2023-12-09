package me.santio.vocal.common.models.rest.verify

import java.util.UUID

data class VerifyRequest(
    val code: String,
    val uuid: UUID,
    val username: String
)