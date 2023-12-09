package me.santio.vocal.spigot.commands

import me.santio.vocal.spigot.VocalSpigot
import org.bukkit.entity.Player

abstract class VocalCommand(val name: String, val description: String = "") {

    abstract fun execute(plugin: VocalSpigot, sender: Player, label: String, args: Array<out String>)
    open fun tabComplete(position: Int, args: Array<out String>): MutableList<String> = mutableListOf()

}