package me.santio.vocal.common.models.rest.verify

import me.santio.vocal.common.models.rest.BaseResponse

data class VerifyResponse(
    val token: TokenData
): BaseResponse()