import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import {Express} from 'express';

module.exports = {
  data: {
    name: 'ping',
    description: 'Test',
    type: 1,
  },
  exe: async (interaction: ChatInputCommandInteraction, app: Express) => {
    return interaction.reply({
      content: `**Pong**`
    })
  }
}