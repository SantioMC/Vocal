package me.santio.vocal.common.models.rest

open class BaseResponse {
    lateinit var message: String
    var error: Boolean = false
}
