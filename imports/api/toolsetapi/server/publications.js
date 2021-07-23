import { Meteor } from 'meteor/meteor';
import { Images } from '../links.js';
Meteor.publish('imagesBook.all', function () {
               return Images.find();
               });