import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'

import mitt from 'mitt'

const emitter = mitt()

const connection = new HubConnectionBuilder()
  .withUrl(import.meta.env.VITE_CHAT_API + '/chat-hub')
  .configureLogging(LogLevel.Information)
  .build()

async function onConnectionAsync() {
  try {
    await connection.start()
    console.log('SignalR Connected.')
  } catch (err) {
    console.log(err)
  }
}

function onDisconnectionAsync() {}

async function SendAll(message) {
  connection.invoke('SendAll', message).catch(function (err) {
    return console.error(err.toString())
  })
}

async function SendMessage(chatId, message) {
  console.log(chatId)
  console.log(message)

  connection.invoke('SendMessage', chatId, JSON.stringify(message)).catch(function (err) {
    return console.error(err.toString())
  })
}

async function AddToChat(chat_id) {
  connection.invoke('AddToChat', chat_id).catch(function (err) {
    return console.error(err.toString())
  })
}

async function RemoveFromChat(chat_id, user_id) {
  connection.invoke('RemoveFromChat', chat_id, user_id).catch(function (err) {
    return console.error(err.toString())
  })
}

export default {
  onConnectionAsync,
  onDisconnectionAsync,
  SendMessage,
  SendAll,
  AddToChat,
  RemoveFromChat,
  emitter,
  connection
}
