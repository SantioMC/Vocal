package me.santio.vocal.common

import io.socket.client.IO
import io.socket.client.Socket
import me.santio.vocal.common.Vocal.getSocket
import me.santio.vocal.common.models.socket.movement.EntityLocation

class VocalWebSocket(private val url: String, private val token: String?) {

    private var socket: Socket? = null

    fun connect(): VocalWebSocket {
        val options =
            IO.Options.builder()
                .setTransports(arrayOf("websocket"))
                .setPath("/ws/")
                .setAuth(mapOf("token" to token, "id" to Vocal.uniqueId))
                .build()

        socket = IO.socket("$url/server", options).connect()

        socket?.once("connect") {
            println("Connected to socket")
        }

        socket?.once("connect_error") {
            try {
                println("Failed to connect to socket: ${Vocal.gson.toJson(it[0])}")
            } catch(e: Exception) {
                println("Failed to connect to socket")
            }
        }

        socket?.once("connect_timeout") {
            println("Timed out while connecting to socket")
        }

        return this
    }

    /**
     * Sends a [EntityLocation] to the backend, used for 3D positional audio. This requires you to
     * already have called [getSocket] to properly authenticate.
     * @param data The [EntityLocation] to send.
     * @see getSocket
     */
    fun sendMovement(data: EntityLocation) {
        socket?.emit("movement", Vocal.gson.toJson(data))
    }

    /**
     * Closes the socket connection.
     */
    fun close() {
        socket?.close()
    }
}

