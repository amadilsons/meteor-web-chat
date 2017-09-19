import { ChatSchema } from './schemas/schemas.js';

const ChatCollection = new Mongo.Collection('chats');
ChatCollection.schema = ChatSchema;

module.exports.Chats = ChatCollection;
