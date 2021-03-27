const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer

const bot = mineflayer.createBot({
  host: '104.194.9.191', 
  username: '1Bela_LevyRedfox',
  port: '25586',
  version: '1.16.3'
})


// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)

bot.once('spawn', () => {
    mineflayerViewer(bot, { port: 8080 }) // Start the viewing server on port 3000
  
    // Draw the path followed by the bot
    const path = [bot.entity.position.clone()]
    bot.on('move', () => {
      if (path[path.length - 1].distanceTo(bot.entity.position) > 1) {
        path.push(bot.entity.position.clone())
        bot.viewer.drawLine('path', path)
      }
    })

    





  })

  bot.loadPlugin(require('mineflayer-dashboard'))

  bot.once('inject_allowed', () => {
    global.console.log = bot.dashboard.log
    global.console.error = bot.dashboard.log
  })


  let lastUser = null
const whisper = new bot.dashboard.Mode('whisper', {
  bg: 'blue',
  interpreter (string) {
    let words = string.split(' ')
 
    // Check if we change receiver
    if (/ :to \w{3,16}$/.test(string)) {
      lastUser = words[words.length - 1]
      words = words.slice(0, -2)
    }
    
    // Log an error if there is no receiver
    if (lastUser === null) {
      return bot.dashboard.log("No receiver set, please add ' :to <user>' at the end of the message")
    }   
 
    // Send message
    const message = words.join(' ')
    bot.chat(`/msg ${lastUser} ${message}`)
    this.println(`to ${lastUser}: ${message}`)
  },
  async completer (string) {
    // We're using already well defined minecraft completer
    return bot.dashboard._minecraftCompleter(string)
  }
})
 
bot.on('whisper', (username, message) => {
  // Log a notification if not in whisper mode
  if (bot.dashboard.mode !== whisper) {
    return bot.dashboard.log(`You have a new message from ${username}`)
  } 
 
  // Display messages in the mode
  whisper.println(`MESSAGE: ${username} >> ${message}`)
})

