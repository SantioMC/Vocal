package me.santio.vocal.common.models.rest.verify

data class TokenData(
    val token: String,
    val room: String,
    val identity: String
)