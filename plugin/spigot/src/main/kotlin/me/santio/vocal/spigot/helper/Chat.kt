package me.santio.vocal.spigot.helper

import me.santio.vocal.spigot.audience
import net.kyori.adventure.text.Component
import net.kyori.adventure.text.format.TextColor
import net.kyori.adventure.text.minimessage.MiniMessage
import net.kyori.adventure.text.minimessage.tag.resolver.Placeholder
import net.kyori.adventure.text.minimessage.tag.resolver.TagResolver
import org.bukkit.entity.Player

internal val DEFAULT_TAGS = arrayOf(
    Placeholder.styling("primary", TextColor.fromHexString("#5782d9")!!),
    Placeholder.parsed("sep", "<dark_gray>|<gray>"),
    Placeholder.parsed("prefix", "<primary>Vocal <sep>")
)
internal val format = MiniMessage.builder().build()

internal fun String.color(vararg tags: TagResolver) = format.deserialize(this, *DEFAULT_TAGS, *tags)
internal fun Player.sendMessage(component: Component) = audience.player(this).sendMessage(component)