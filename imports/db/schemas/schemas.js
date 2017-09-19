const MessageSchema = new SimpleSchema({
  text: {type: String},
  timestamp: {type: Date},
  username: {type: String}
});

const ChatSchema = new SimpleSchema({
  intervenients: {
    type: Array,
    minCount: 2,
    maxCount: 2
  },
  'intervenients.$': {
    type: String
  },
  messages: {
    type: Array,
    optional: true
  },
  'messages.$': {
    type: MessageSchema
  },
  creationDate: {
    type: Date
  }
});

module.exports.MessageSchema = MessageSchema;
module.exports.ChatSchema = ChatSchema;
