import { Meteor } from 'meteor/meteor';
import { scb_Clients } from '../links.js';
Meteor.publish('clientBook.all', function () {
               return scb_Clients.find();
               });