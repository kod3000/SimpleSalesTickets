import { scb_Clients } from '/imports/api/simpleClientBook/links.js';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Geolocation } from 'meteor/mdg:geolocation';
import { scb_Tickets } from '/imports/api/simpleTicketBook/links.js';

import './entry.html';

Template.notesTicketView.onCreated(function helloOnCreated() {
    Meteor.subscribe('ticketBook.all');
});
Template.notesTicketView.onRendered(function helloOnCreated() {
    Tracker.autorun(function() {
            if(Session.get("addNoteShow")){
               $('#noteCont').show();
               $('#noteDisp').hide();
            }else{
               $('#noteCont').hide();
               $('#noteDisp').show();
            }
        });
    Session.set("addNoteShow", false);
});
Template.notesTicketView.helpers({
    getSessionData(){
    return Session.get("dataTicket");
    },
    getBackButtonWidth(){
    return parseFloat(Session.get("widthCustom")) -10;
    },
    getWidthCustom(){
    return parseFloat(Session.get("widthCustom")) - 20;
    },
    getHeight(){
    return Session.get("heightCustom");
    },
    getHalfHeight(){
    return Session.get("heightHalfCustom");
    },
    returnListOfNotesInsideTicket(){
    if(Session.get("dataTicket") == null)return;
    var tmp =  scb_Tickets.find({_id:Session.get("dataTicket")._id}).fetch().pop();
    if(tmp != null && tmp['notes'] != null){
    return tmp['notes'].reverse();
    }
    },
});

Template.notesTicketView.events({

    'click .btn-success'(e){
        const target = e.target;
        var action = $(target).data("id");
        if(action == "goBack"){
            swiper.slideTo(0);
        }
        if(action == "cancel"){
            $('#note').val("");
            swiper.slideTo(2);
            Session.set("addNoteShow", false);
        }
        if(action == "note"){
            $('#note').val("");                                
            Session.set("addNoteShow", true);
        }
        if(action == "save"){
            var tmpNote = $('#note').val();
            if(tmpNote == null || tmpNote == "" )return;
            var tmp = { note: $('#note').val()};
            Meteor.call('doHyperAddNoteToTicket.insert', tmp, Session.get("dataTicket")._id, function(err,res){
                        if(res)Session.set("loading", false);
                        });
            $('#note').val("");
            Session.set("addNoteShow", false);
            swiper.slideTo(2); 
        }                             
    },
});