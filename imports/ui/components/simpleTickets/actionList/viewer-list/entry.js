import { scb_Clients } from '/imports/api/simpleClientBook/links.js';
import { scb_Tickets } from '/imports/api/simpleTicketBook/links.js';

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Geolocation } from 'meteor/mdg:geolocation';


import './entry.html';

Template.listTicketView.onRendered(function helloOnCreated() {
var okReady = Meteor.subscribe('clientBook.all');
var superReady = Meteor.subscribe('ticketBook.all');
Tracker.autorun(function() {
           
           if(okReady.ready() && superReady.ready() ){

           var tmp = scb_Clients.find({unique: FlowRouter.getParam('unique')}).fetch().pop();
           Session.set("dataClient", tmp);
           console.log(FlowRouter.current().route.name);
           if(FlowRouter.current().route.name == "EmployeeListTicketsOfClient" && tmp == null)FlowRouter.go("/");
           }
           });
                                  
});
Template.listTicketView.helpers({                        
        getSessionData(){
        return Session.get("dataClient");        
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
        okayguy(){
        if(Session.get("dataClient") == null)return;
        return scb_Tickets.find({client: Session.get("dataClient").unique }).fetch();
        },
        numIndex(tmp){
        return tmp+1;
        },
        itemsReadyToAdd(){
        return  Session.get("itemStack");
        },
        dollarValue(tmp){
        if(tmp == null || isNaN(tmp))tmp = 0;
        return "$"+ parseFloat(tmp).toFixed(2);        
        },
        checkGlyph(tmp){
                switch(tmp){
                        case "New":
                        return "star-empty";
                        break;
                        case "Pending":
                        return "flag";
                        break;
                        case "On Going":
                        return "repeat";
                        break;
                        case "Working":
                        return "fire";
                        case "Ready Up":
                        return "gift";
                        break;
                        default:
                        break;
                }
        
        }
});
Template.listTicketView.events({
       'click .btn-success'(e){
       const target = e.target;
       var action = $(target).data("id");
       if(action == "goBack"){
       Session.set("dataClient", null);
       Session.set("whereTo", 0);
       FlowRouter.go('App.home');
       }
       if(action == "createTicket"){
       Session.set("loading", true);
       var dataSend = {clientUnique:FlowRouter.getParam('unique'), ticketNumber: Random.id(5), projectName: Session.get("dataClient").cProject};
       Meteor.call('doHyperCreateTicket.insert', dataSend, function(err,res){
                   if(res)Session.set("loading", false);
                   });       
       }
       },
       'click .clickBait'(e){
       const target = e.target;
       var action = $(target).data("id");
       if(action == "openTicket"){
       var tmpTicket = $(target).data("ticket");
       console.log("want to open a specific ticket? " +  Session.get("dataClient").unique + " " + tmpTicket );
       FlowRouter.go('EmployeeViewTicketOfClient', { _id: tmpTicket});
       }
       }
});