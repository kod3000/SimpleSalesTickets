import { scb_Clients } from '/imports/api/simpleClientBook/links.js';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Geolocation } from 'meteor/mdg:geolocation';
import { scb_Tickets } from '/imports/api/simpleTicketBook/links.js';

import './entry.html';

Template.paymentTicketView.onRendered(function helloOnCreated() {                                    
Tracker.autorun(function() {
                if(Session.get("addPayShow")){
                $('#payCont').show();
                $('#payDisp').hide();  
                }else{
                $('#payCont').hide();
                $('#payDisp').show();
                }
                });
Session.set("addPayShow", false);
});
Template.paymentTicketView.helpers({
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
    dollarValue(tmp){
      if(tmp == null || isNaN(tmp))tmp = 0;
      return "$"+ parseFloat(tmp).toFixed(2);     
    },
    returnListOfPaymentsInsideTicket(){
      if(Session.get("dataTicket") == null)return;
      var tmp =  scb_Tickets.find({_id:Session.get("dataTicket")._id}).fetch().pop();
      if(tmp != null && tmp['payments'] != null ){
        return tmp['payments'].reverse();
      }
    },
    dateOfSinceToday(tmp){
      return moment(tmp).subtract(3, 'days').calendar();
    }
});
Template.paymentTicketView.events({
    'click .btn-success'(e){
          const target = e.target;
          var action = $(target).data("id");      
          if(action == "goBack"){
            swiper.slideTo(0);
          }      
          if(action == "cancel"){
            $('#notepayment').val("");
            $('#ipay').val("");
            swiper.slideTo(3);
            Session.set("addPayShow", false);
          }
          if(action == "pay"){
            Session.set("addPayShow", true);
          }      
          if(action == "save"){
            var ok = $('input[name=options]:checked').data("id");
            var tmpPayment = $('#ipay').val().replace(/\$/g, '');
            var tmpNote = $('#notepayment').val();
            if(tmpPayment == null || tmpPayment == "" )return;
            var tmp = { payment:$('#ipay').val(), type: ok, note: $('#note').val()};
            Meteor.call('doHyperAddPaymentToTicket.insert', tmp, Session.get("dataTicket")._id, function(err,res){
                        if(res)Session.set("loading", false);
                        });
            $('#notepayment').val("");
            $('#ipay').val("");
            Session.set("addPayShow", false);
            swiper.slideTo(3);
          }        
    },
});