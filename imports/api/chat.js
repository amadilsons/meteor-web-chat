import { Meteor } from 'meteor/meteor';
import { Chats } from '../db/collections.js';
import { ChatSchema, MessageSchema } from '../db/schemas/schemas.js';

if(Meteor.isServer){
  //publish information about online users
  Meteor.publish('user.chats', () => {
    return Chats.find({ intervenients: Meteor.user().username });
  });

  Meteor.publish('user.contacts', () => {
    var contacts = Meteor.user().contacts;
    contacts.push(Meteor.user().username);
    if(contacts)
      return Meteor.users.find({ username: { $in: contacts }}, { fields: { _id: 1, username: 1, online: 1}});
    else
      return null;
  });

}

Meteor.methods({
  'user.setOnlineStatus'() {
    var user = Meteor.users.find({ _id: Meteor.userId });
    Meteor.users.update({ _id: Meteor.userId }, { $set: { online: !user.online}})
  },
  getChat(username) {
    var chat = Chats.findOne({ intervenients: username });
    if(chat){ return chat };

    chat = {
      intervenients: [ Meteor.user().username, username],
      messages: [],
      creationDate: new Date()
    }

    Chats.schema.validate(chat);
    Chats.insert(chat);
  },
  'chat.addMessage'(chatId, text) {

      let msg = {
        text: text,
        timestamp: new Date(),
        username: Meteor.user().username
      }

      MessageSchema.validate(msg);
      Chats.update({ _id: chatId }, { $push: { messages: msg }});
  }
});
