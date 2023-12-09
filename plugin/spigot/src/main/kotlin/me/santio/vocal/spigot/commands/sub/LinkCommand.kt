package me.santio.vocal.spigot.commands.sub

import me.santio.vocal.common.VocalCallback
import me.santio.vocal.common.models.rest.verify.VerifyRequest
import me.santio.vocal.common.models.rest.verify.VerifyResponse
import me.santio.vocal.spigot.VocalSpigot
import me.santio.vocal.spigot.commands.VocalCommand
import me.santio.vocal.spigot.helper.color
import me.santio.vocal.spigot.helper.sendMessage
import org.bukkit.entity.Player

object LinkCommand: VocalCommand("link", "Link your minecraft account to the website") {
    override fun execute(plugin: VocalSpigot, sender: Player, label: String, args: Array<out String>) {
        if (args.isEmpty())
            return sender.sendMessage("<gray>Usage: <red>/$label link <code>".color())

        val code = args[0]

        plugin.rest.verifyUser(
            VerifyRequest(
            code,
            sender.uniqueId,
            sender.name
        )
        ).enqueue(VocalCallback<VerifyResponse> { err, it ->

            if (err != null || it?.error == true)
                return@VocalCallback sender.sendMessage("<red>${err?.message ?: it?.message ?: "Unknown error"}".color())

            sender.sendMessage("<prefix> <gray>${it!!.message}".color())

        })
    }
}