import { scb_Clients } from '/imports/api/simpleClientBook/links.js';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Geolocation } from 'meteor/mdg:geolocation';


import './entry.html';

Template.summaryTicketView.helpers({
   getSessionData(){
   // holds all basic info of ticket..
   return Session.get("dataTicket");
   },
   getBackButtonWidth(){
   return parseFloat(Session.get("widthCustom")) -10;
   },
   getWidthCustom(){
   // inside view items get a minus
   return parseFloat(Session.get("widthCustom")) - 20;
   },
   getHeight(){
   // first check if tthis is apple.. if it is .. divide by 2.
   return Session.get("heightCustom");
   },
   getHalfHeight(){
   // first check if tthis is apple.. if it is .. divide by 2.
   return Session.get("heightHalfCustom");
   },
   doTheMath(tmp, tmp2){
   return "$ " +parseFloat(tmp-tmp2).toFixed(2);
   }
});

Template.summaryTicketView.events({
'click .btn-success'(e){
    // save open cancel
    const target = e.target;
    var action = $(target).data("id");
    if(action == "goBack"){
    console.log("going back to the ticketlist?");
    //Session.set("dataTicket", null);
    if(Session.get("dataTicket") == null) FlowRouter.go('App.home');
    FlowRouter.go('EmployeeListTicketsOfClient', { unique: Session.get("dataTicket").client });
    }

    if(action == "showItems"){
    swiper.slideTo(1);
    Session.set("addItemShow", false);
    Session.set("itemStack", null);
    }

    if(action == "item"){
    swiper.slideTo(1);
    Session.set("addItemShow", true);
    Session.set("itemStack", null);
    }

    if(action == "note"){
    swiper.slideTo(2);
    }
    if(action == "payment"){
    swiper.slideTo(3);
    }
    if(action == "status"){
    swiper.slideTo(4);
    }
},
});
