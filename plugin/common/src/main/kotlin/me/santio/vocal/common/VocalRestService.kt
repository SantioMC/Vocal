package me.santio.vocal.common

import me.santio.vocal.common.models.rest.link.LinkRequest
import me.santio.vocal.common.models.rest.link.LinkResponse
import me.santio.vocal.common.models.rest.verify.VerifyRequest
import me.santio.vocal.common.models.rest.verify.VerifyResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface VocalRestService {

    @POST("verify")
    fun verifyUser(@Body request: VerifyRequest): Call<VerifyResponse>

	@POST("request_link")
	fun requestLink(@Body request: LinkRequest): Call<LinkResponse>

}