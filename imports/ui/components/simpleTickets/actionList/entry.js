import { scb_Clients } from '/imports/api/simpleClientBook/links.js';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
const cssJack = require( '/imports/startup/client/uniformLook.js');

import './viewer-list/entry.js';
import './viewer-editClient/entry.js';
import './entry.html';

Template.cST_List.onCreated(function helloOnCreated() {
    // counter starts at 0
    FlowRouter.reload();
    var handle = Meteor.subscribe('clientBook.all');
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
Template.cST_List.helpers({
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