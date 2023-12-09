package me.santio.vocal.common.interceptors

import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor(private val bearer: String): Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response = chain.run {
        proceed(
            request()
                .newBuilder()
                .addHeader("Content-Type", "application/json")
                .addHeader("Accept", "application/json")
                .addHeader("User-Agent", "Vocal/RestService")
                .addHeader("Authorization", "Bearer $bearer")
                .build()
        )
    }
}