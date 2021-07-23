import { scb_Clients } from '/imports/api/simpleClientBook/links.js';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Geolocation } from 'meteor/mdg:geolocation';
import { scb_Tickets } from '/imports/api/simpleTicketBook/links.js';

import './entry.html';

Template.statusTicketView.onRendered(function helloOnCreated() {
      Tracker.autorun(function() {
                      if(Session.get("changeStatusShow")){
                      $('#statusCont').show();
                      $('#statusDisp').hide(); 
                      }else{
                      $('#statusCont').hide();
                      $('#statusDisp').show();
                      }                
                      });
      Session.set("changeStatusShow", false);
});
Template.statusTicketView.helpers({
      getSessionData(){
         return Session.get("dataTicket");
      },
      getItemData(){
         if(Session.get("dataTicket") == null || Session.get("itemStatus") == null )return;
         var tmp =  scb_Tickets.find({_id:Session.get("dataTicket")._id}).fetch().pop();
         var tmpId = Session.get("itemStatus");
         for (i=0; i<tmp['items'].length; i++){
            if(tmp['items'][i].id == tmpId){
            Session.set("dataItem", tmp['items'][i]);
            }
         }
         return Session.get("dataItem"); 
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
      },
      setComplete(tmp){
         if(tmp == "Pending")return true;
         if(tmp == "In Process")return false;
         return false;
      },
      checkTicketState(tmp){
         if(tmp == null || tmp == "idle")return true
      },
      checkifTheJobISCOMPLETED(tmp){
         if(tmp == "Ready Up")return true;
      },
      giveTheGlyph(tmp){
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
             break;
          case "Ready Up":
             return "gift";
             break;
          default:
             break;
       }
      },
      doTheMath(tmp, tmp2){
       return "$ " +parseFloat(tmp-tmp2).toFixed(2);
      },
      thisTicketCanBeClosed(tmp, tmp2){
       if(parseFloat(tmp-tmp2) < 0 || parseFloat(tmp-tmp2) == 0 )return true;
       return false;
      }
});

Template.statusTicketView.events({

      'click .btn-success'(e){
      const target = e.target;
      var action = $(target).data("id");
      if(action == "goBack"){
         swiper.slideTo(0);       
      }
      if(action == "gotoPayment"){
         swiper.slideTo(3);
      }
      if(action == "makePayMent"){
         swiper.slideTo(3);
         Session.set("addPayShow", true);
      }
      if(action == "cancel"){
         swiper.unlockSwipes();
         swiper.slideTo(1);
         Session.set("itemStatus", null); // holds the id of the single item
         Session.set("dataItem", null); // holds all info of the single item
         Session.set("changeStatusShow", false); // simple show and tell window
      }
       
      if(action == "deleteItem"){
         // single Item Function
         Session.set("loading", true);
         Meteor.call('doHyperDeleteItemFromTicket.update', Session.get("itemStatus"), Session.get("dataTicket")._id, function(err,res){
                     if(res)Session.set("loading", false);
                     });
         // after we deleted everything clean up and keep it moving..
         swiper.unlockSwipes();
         swiper.slideTo(1);
         Session.set("itemStatus", null); // holds the id of the single item
         Session.set("dataItem", null); // holds all info of the single item
         Session.set("changeStatusShow", false); // simple show and tell window
      }
      switch(action){
      case "inprocess":
         Session.set("loading", true);
         var status = "In Process";
         Meteor.call('doHyperItemStatusForTicket.update', Session.get("itemStatus"), Session.get("dataTicket")._id, status  , function(err,res){
                     if(res){
                     Session.set("loading", false);
                     }                  
                     });

         swiper.unlockSwipes();
         swiper.slideTo(1);
         Session.set("itemStatus", null); // holds the id of the single item
         Session.set("dataItem", null); // holds all info of the single item
         Session.set("changeStatusShow", false); // simple show and tell window
         break;
      case "completedItem":
         var status = "Completed";
         Meteor.call('doHyperItemStatusForTicket.update', Session.get("itemStatus"), Session.get("dataTicket")._id, status  , function(err,res){
                     if(res)Session.set("loading", false);                  
                     });
         // after we deleted everything clean up and keep it moving..
         swiper.unlockSwipes();
         swiper.slideTo(1);
         Session.set("itemStatus", null); // holds the id of the single item
         Session.set("dataItem", null); // holds all info of the single item
         Session.set("changeStatusShow", false); // simple show and tell window
         break;
      default:
         break;
      }
      
      switch(action){
      case "closeTicket":
         Session.set("loading", true);
         Meteor.call('doHyperCloseTicket.update',Session.get("dataTicket")._id, function(err,res){
                     if(res)Session.set("loading", false);
                     });
         // after we deleted everything clean up and keep it moving..
         break;
      case "completeJob":
         Session.set("loading", true);
         var status = {action:"Done", status:"Ready Up"};
         Meteor.call('doHyperOverallStatusForTicket.update',status, Session.get("dataTicket")._id, function(err,res){
                     if(res)Session.set("loading", false);
                     });
         // after we deleted everything clean up and keep it moving..
         break;      
      case "startJob":
         Session.set("loading", true);
         //var status = {action:"Start",  ;
         var status = {action:"Start", status:"Working"};
         Meteor.call('doHyperOverallStatusForTicket.update',status, Session.get("dataTicket")._id, function(err,res){
                     if(res)Session.set("loading", false);                     
                     });
         // after we deleted everything clean up and keep it moving..
         break;
      case "pauseJob":
         Session.set("loading", true);
         //var status = {action:"Start",  ;
         var status = {action:"idle", status:"On Going"};
         Meteor.call('doHyperOverallStatusForTicket.update',status, Session.get("dataTicket")._id, function(err,res){
                     if(res){
                     Session.set("loading", false);
                     }
                     
                     });
         // after we deleted everything clean up and keep it moving..
         break;
      default:
         break;
      }
          
      if(action == "save"){
      var ok = $('input[name=options]:checked').data("id");
      var tmpPayment = $('#ipay').val();
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