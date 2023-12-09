package me.santio.vocal.common

import com.google.gson.Gson
import me.santio.vocal.common.interceptors.AuthInterceptor
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.*


/**
 * Vocal entry point for the API, providing useful methods for interacting with the backend.
 */
object Vocal {

    val uniqueId: String = UUID.randomUUID().toString().substring(0, 8)
    internal val gson = Gson()

    private lateinit var socket: VocalWebSocket

    /**
     * Builds a [VocalRestService], used for interacting with the Backend REST API.
     * @param url The base URL of the backend.
     * @param token The token to use for authentication.
     * @return A [VocalRestService] instance.
     */
    fun getRestfulAPI(url: String, token: String?): VocalRestService {
        val client = OkHttpClient.Builder()
        if (token != null) client.addInterceptor(AuthInterceptor(token))

        val retrofit = Retrofit.Builder()
            .client(client.build())
            .baseUrl(url)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()

        return retrofit.create(VocalRestService::class.java)
    }

    /**
     * Builds a [VocalWebSocket] if there isn't one already, used for sending movement
     * data to the backend for 3D positional audio, and receiving data relating to players.
     * @param url The base URL of the backend.
     * @param token The token to use for authentication.
     * @return The existing [VocalWebSocket] instance, or a new one.
     */
    fun getSocket(url: String, token: String?): VocalWebSocket {
        if (!::socket.isInitialized) {
            socket = VocalWebSocket(url, token).connect()
        }

        return socket
    }

}