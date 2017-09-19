import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Chats } from '../../db/collections.js';

import './chat.html';
import '../../api/chat.js';

const REACTIVE = new ReactiveDict();

Template.chat.onCreated(() => {
  Template.instance().state = new ReactiveDict();
  Meteor.subscribe('user.contacts');

});

Template.chat.onDestroyed(() => {
  Meteor.call('user.setOnlineStatus');
});

Template.messageBoard.onCreated(() => {
  Meteor.subscribe('user.chats');

  Template.instance().autorun(() => {

  });
});

Template.contactsBar.onCreated(() => {
  var self = Template.instance();
  self.state = new ReactiveDict();
});

Template.chat.helpers({
    username() {
      if(Meteor.userId)
        return Meteor.user().username;
    }
});

Template.chat.events({
  'submit .text-input-form'(event) {
    event.preventDefault();
    
    Meteor.call('chat.addMessage', chatId, event.target.text.value);
    event.target.text.value = ''; //clear text field
  }

});

Template.messageBoard.helpers({
  messages() {
    console.log(REACTIVE.get('currentUser'));
    var chat = Meteor.call('getChat', REACTIVE.get('currentUser'));
    if(chat){
      return chat.messages;
    }
    return null;
  }
});

Template.contactsBar.helpers({
  contacts() {
    var users;
    var ownUsername = Meteor.user().username;

    if(!Template.instance().state.get('hideCompleted'))
      users = Meteor.users.find({ username: { $ne: ownUsername }});
    else
      users = Meteor.users.find({ username: { $ne: ownUsername }, online: true });
    return users;
  },

});

Template.contactsBar.events({
  'click .hide-offline'() {
    var self = Template.instance();
    self.state.set('hideCompleted', !self.state.get('hideCompleted'));
  },
});

Template.contact.events({
  'click li'(_,instance) {
    REACTIVE.set('currentUser', username);
  }
});
