import { scb_Tickets } from '/imports/api/simpleTicketBook/links.js';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
const cssJack = require( '/imports/startup/client/uniformLook.js');

// import submodule views for the app to function
//  this was done so to not have so much clutter on one html doc
import './viewer-summary/entry.js';
import './viewer-details/entry.js';
import './viewer-notes/entry.js';
import './viewer-payment/entry.js';
import './viewer-status/entry.js';

import './entry.html';

Template.cST_Open.onCreated(function helloOnCreated() {
    var handleTicketBook = Meteor.subscribe('ticketBook.all');
    Session.set("loading", true);
    Session.set("dataTicket", null);
    Tracker.autorun(function() {      
      if(handleTicketBook.ready()){
         // subscription is ready..
         Session.set("loading", false);
         var tmp = scb_Tickets.find({_id: FlowRouter.getParam('_id')}).fetch().pop();
         console.log(tmp);
         Session.set("dataTicket", tmp);
         if(tmp == null)console.log("we should redirect out of Action Open ticket..");
         // redirect ..
         if(FlowRouter.current().route.name == "EmployeeViewTicketOfClient" && tmp == null)FlowRouter.go("/");
      }
    });
});

Template.cST_Open.helpers({
    JACKCSS(tmp){
      // deleveloping..
      return cssJack.getCSS(tmp);
    },
    getWidthCustom(){
      return parseFloat(Session.get("widthCustom"));
    },
    getHeight(){
      // first check if tthis is apple.. if it is .. divide by 2.
      return Session.get("heightCustom");
    },
    getHalfHeight(){
      // first check if tthis is apple.. if it is .. divide by 2.
      return Session.get("heightHalfCustom");
    },
    processLoading(){
      return  Session.get("loading");
    }                
});