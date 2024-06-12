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
  connection.invoke('SendMessage', chatId, JSON.stringify(message)).catch(function (err) {
    return console.error(err.toString())
  })
}

const receiveMessage = connection.on('ReceiveMessage', (message) => {
  emitter.emit('receiveMessage', JSON.parse(message))
})

async function AddToChat(chatId) {
  connection.invoke('AddToChat', chatId).catch(function (err) {
    return console.error(err.toString())
  })
}

async function RemoveFromChat(chatId) {
  connection.invoke('RemoveFromChat', chatId).catch(function (err) {
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
  receiveMessage,
  connection
}
