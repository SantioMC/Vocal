package me.santio.vocal.common.models.rest.link

import me.santio.vocal.common.models.rest.BaseResponse

data class LinkResponse(
    val link: String,
    val path: String,
    val code: String
): BaseResponse()