package me.santio.vocal.common

import me.santio.vocal.common.models.rest.BaseResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class VocalCallback<T>(val callback: (BaseResponse?, T?) -> Unit) : Callback<T> {
    override fun onResponse(call: Call<T>, response: Response<T>) {
        if (!response.isSuccessful || response.body() == null) {
            val body = response.errorBody() ?:
                throw RuntimeException("Response was not successful, but error body was null.")

            callback(Vocal.gson.fromJson(body.string(), BaseResponse::class.java), null)
            return
        }

        callback(null, response.body())
    }

    override fun onFailure(call: Call<T>, t: Throwable) {
        t.printStackTrace()
        callback(null, null)
    }
}