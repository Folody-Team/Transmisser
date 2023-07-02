import { InteractionType, InteractionResponseType, verifyKey } from 'discord-interactions';
import { Client as DiscordClient, IntentsBitField } from 'discord.js';
import express, { Request, Response } from 'express';
import crypto from 'node:crypto';
import nacl from 'tweetnacl';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';

export class Client extends DiscordClient {
  public app = express()

  /**
   * @private
   */
  private PORT = process.env.PORT || 3000;
  private reqOption = {}
  private commands = {
    data: [] as any[],
    main: new Map<string, any>()
  }

  /**
   * 
   * @param token 
   */
  constructor() {
    super({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
      ]
    })

    this.once('installed', () => {
      {
        this.on('interactionCreate', (interaction) => {
          if (interaction.isChatInputCommand()) {
            this.commands.main.get(interaction.commandName)(interaction, this.app)
          }
        })
      }
    })
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );
    this.app.listen(this.PORT, () => console.log('Listening on port', this.PORT));


  }



  /**
   * Verify request discord api.
   * @param key 
   * @returns 
   */
  private verify(req: Request, res: Response) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');
    const body = JSON.stringify(req.body);
    /**
     *  this line is the verification key
     */
    const isValidRequest = nacl.sign.detached.verify(
      Buffer.from(String(timestamp) + body),
      Buffer.from(String(signature), 'hex'),
      Buffer.from(process.env.PUBLIC_KEY as any, 'hex'),
    );

    // check valid request  => pass
    if (!isValidRequest) {
      // 401 when key does not verify => block.
      res.status(401).send('Bad request signature');
      return false;
    } else {
      return true
    }

  }

  /**
   * 
   * @param endpoint 
   * @param options 
   * @returns 
   */
  public async request(endpoint: string, options: any) {
    const url = 'https://discord.com/api/v10/' + endpoint;
    // Stringify payloads
    if (options.body) options.body = JSON.stringify(options.body);
    // Use node-fetch to make requests
    // Assign the reqOption before send a request
    Object.assign(this.reqOption, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent': `Discord-${crypto.randomBytes(20).toString('hex')} (https://discord.com/, 1.0.0)`,
        'Accept-Encoding': 'gzip, *;q=0'
      },
      ...options

    })

    const res = await fetch(url, this.reqOption);
    // throw API errors
    if (!res.ok) {
      const data = await res.json();
      console.log(res.status);
      throw new Error(JSON.stringify(data));
    }
    // return original response
    return res;

  }

  /**
   * 
   * @param commands 
   */
  private async install(commands: any) {
    const endpoint = `applications/${process.env.APP_ID}/commands`;

    try {
      await this.request(endpoint, { method: 'PUT', body: commands });
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * 
   * @param dir 
   */
  public async handlerCommand(dir: string) {
    const dirPath = path.join(__dirname, dir);
    const filenames = fs.readdirSync(dirPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    const pointer = {} as { l: number; r: number };
    const commands = this.commands;
    Object.assign(pointer, { l: 0, r: filenames.length - 1 });

    /**
     * Function to load command file
     * @param filename 
     */
    async function loadFile(filename: string) {
      const pathFile = path.join(dirPath, filename);
      const pack = require(pathFile);
      const data = (pack as any).data;

      commands['data'].push(data);
      commands['main'].set(data.name, pack.exe);
    }

    // Use two pointers to get commands
    while (pointer.l <= pointer.r) {
      if (pointer.l == pointer.r) loadFile(filenames[pointer.l])
      else {
        loadFile(filenames[pointer.l]);
        loadFile(filenames[pointer.r]);
      }
      ++pointer.l;
      --pointer.r;
    }

    this.commands = commands;

    
    try {
      this.install(commands['data']).then(() => this.emit('installed'))
    } catch (err) {
      console.error(err)
    }




  }

  public register() {
    this.app.post('/interactions', (req, res) => {
      const verify = this.verify(req, res)

      if (!verify) return

      const { type, id, data } = req.body;

      if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
      } else {
        (<any>this).actions.InteractionCreate.handle(req.body)
      }
    })
  }


}