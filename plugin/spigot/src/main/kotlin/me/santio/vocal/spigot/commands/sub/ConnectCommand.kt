package me.santio.vocal.spigot.commands.sub

import me.santio.vocal.common.VocalCallback
import me.santio.vocal.common.models.rest.link.LinkRequest
import me.santio.vocal.common.models.rest.link.LinkResponse
import me.santio.vocal.common.models.rest.verify.VerifyRequest
import me.santio.vocal.common.models.rest.verify.VerifyResponse
import me.santio.vocal.spigot.VocalSpigot
import me.santio.vocal.spigot.commands.VocalCommand
import me.santio.vocal.spigot.helper.color
import me.santio.vocal.spigot.helper.sendMessage
import org.bukkit.entity.Player

object ConnectCommand: VocalCommand("connect", "Get a link to instantly connect to Voice Chat") {
    override fun execute(plugin: VocalSpigot, sender: Player, label: String, args: Array<out String>) {
        plugin.rest.requestLink(
            LinkRequest(
            sender.uniqueId,
            sender.name
        )
        ).enqueue(VocalCallback<LinkResponse> { err, it ->

            if (err != null || it?.error == true)
                return@VocalCallback sender.sendMessage("<red>${err?.message ?: it?.message ?: "Unknown error"}".color())

            sender.sendMessage("<prefix> <gray>Click on <green><u><click:open_url:\"${it!!.link}\">connect now</click></u><gray> to connect to voice chat!".color())

        })
    }
}