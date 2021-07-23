import { Meteor } from 'meteor/meteor';
import { scb_Tickets } from '../links.js';
Meteor.publish('ticketBook.all', function () {
               return scb_Tickets.find();
               });