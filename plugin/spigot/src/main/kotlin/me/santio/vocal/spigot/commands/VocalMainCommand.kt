package me.santio.vocal.spigot.commands

import me.santio.vocal.spigot.VocalSpigot
import me.santio.vocal.spigot.audience
import me.santio.vocal.spigot.helper.color
import me.santio.vocal.spigot.helper.sendMessage
import net.kyori.adventure.text.minimessage.MiniMessage
import net.md_5.bungee.api.chat.BaseComponent
import net.md_5.bungee.api.chat.ClickEvent
import net.md_5.bungee.api.chat.TextComponent
import org.bukkit.command.Command
import org.bukkit.command.CommandExecutor
import org.bukkit.command.CommandSender
import org.bukkit.command.TabCompleter
import org.bukkit.entity.Player

class VocalMainCommand(private val plugin: VocalSpigot) : CommandExecutor, TabCompleter {

    private val commands = mutableListOf<VocalCommand>()

    override fun onCommand(sender: CommandSender, command: Command, label: String, args: Array<out String>): Boolean {
        if (sender !is Player) {
            sender.sendMessage("Sorry! This command can only be executed by players.")
            return true
        }

        if (args.isEmpty()) {
            sender.sendMessage("<primary>Vocal <sep> Server Voice Chat v${plugin.description.version}".color())
            sender.sendMessage("<gray>Use, <primary><u><click:run_command:vocal connect>/vocal connect</click></u></primary> to learn more".color())

            return true
        }

        if (args[0].equals("help", true)) {
            sender.sendMessage("")
            sender.sendMessage("<gray>Commands for <primary>Vocal<gray>:".color())
            commands.forEach {
                sender.sendMessage("<dark_gray>- <primary><click:suggest_command:/$label ${it.name}>/$label ${it.name}</click><gray> ${it.description}".color())
            }
            sender.sendMessage("")
            return true
        }

        val subcommand = commands.find { it.name.equals(args[0], true) } ?: run {
            sender.sendMessage("<gray>Unknown command <red>'${args[0]}<red>'<gray>.".color())
            return true
        }

        subcommand.execute(plugin, sender, label, args.drop(1).toTypedArray())
        return true
    }

    fun register(vararg command: VocalCommand) {
        commands.addAll(command)
    }

    override fun onTabComplete(
        sender: CommandSender,
        command: Command,
        label: String,
        args: Array<out String>
    ): MutableList<String> {
        val position = args.size - 1

        val arguments = if (position <= 0) {
            commands.map { it.name }.plus("help")
        } else {
            val subcommand = commands.find { it.name == args[0] } ?: return mutableListOf()
            subcommand.tabComplete(position, args)
        }

        return arguments
            .filter { it.startsWith(args[0], true) }
            .toMutableList()
    }
}