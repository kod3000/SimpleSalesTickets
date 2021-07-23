import { scb_Clients } from '/imports/api/simpleClientBook/links.js';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
const cssJack = require( '/imports/startup/client/uniformLook.js');

import './viewer-create/entry.js';
import './viewer-list/entry.js';
import './entry.html';

/*
Simple Client Book - Tasked to create customers.

Does the following: 
- It creates a client
- It Lists the client
-- Inside the List it tells weather or not the client has an active ticket.
*/

Template.cSC.onCreated(function helloOnCreated() {
  var handle = Meteor.subscribe('clientBook.all');
  Session.setDefault("whereTo", 1);
  Tracker.autorun(function() {
               
               if(handle.ready()){
               // subscription is ready..
               Session.set("loading", false);                                       
               }else{
               // subscription is NOT ready..
               Session.set("loading", true);
               
               }
  });
});
Template.cSC.helpers({
  JACKCSS(tmp){
  // deleveloping..
  return cssJack.getCSS(tmp);

  },
  getWidthCustom(){

  return Session.get("widthCustom");
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