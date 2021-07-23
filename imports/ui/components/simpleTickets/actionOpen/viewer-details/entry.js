import { scb_Clients } from '/imports/api/simpleClientBook/links.js';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Geolocation } from 'meteor/mdg:geolocation';
import { scb_Tickets } from '/imports/api/simpleTicketBook/links.js';

import './entry.html';


Template.detailTicketView.onCreated(function helloOnCreated() {
   Meteor.subscribe('ticketBook.all');
   Session.set("addItemShow", false);       
});
Template.detailTicketView.onRendered(function helloOnCreated() {                                  
   Tracker.autorun(function() {
                 if(Session.get("addItemShow")){
                 
                 $('#listCont').show();
                 $('#listDisp').hide();

                 }else{
                 $('#listCont').hide();
                 $('#listDisp').show();
                 
                 }
                 
                 });
   Session.set("addItemShow", false);
                                    
});
Template.detailTicketView.helpers({
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
   returnListOfItemsInsideTicket(){
   if(Session.get("dataTicket") == null)return;
   var tmp =  scb_Tickets.find({_id:Session.get("dataTicket")._id}).fetch().pop();
   if(tmp != null || tmp['items'] != null ){
   return tmp['items'].reverse();
   }
   },
   numIndex(tmp){
   return tmp+1;
   },
   itemsReadyToAdd(){
   return  Session.get("itemStack");
   },
   checkGlyph(tmp){
   switch(tmp){
   case "New":
   return "star-empty";
   break;
   case "Pending":
   return "screenshot";
   break;
   case "In Process":
   return "time";
   break;
   case "Ready":
   return "check";
   break;
   default:
   break;
   }

   }
});

Template.detailTicketView.events({

   'click .btn-success'(e){
   const target = e.target;
   var action = $(target).data("id");
   if(action == "goBack"){
   swiper.slideTo(0);
   }
   if(action == "statusItem"){
   swiper.slideTo(4);
   swiper.lockSwipes();
   Session.set("changeStatusShow", true);
   Session.set("itemStatus", $(target).data("item"));
   }
   if(action == "item"){
   swiper.slideTo(1);
   Session.set("addItemShow", true);
   Session.set("itemStack", null);
   }
   if(action == "cancelItems"){
   $('#iQty').val("");
   $('#iDes').val("");
   $('#iAmount').val("");
   $('#iUnit').val("");
   swiper.slideTo(1);
   Session.set("addItemShow", false);
   Session.set("itemStack", null);
   }
   if(action == "addAnother"){
   var tmpQty = $('#iQty').val();
   var tmpDes = $('#iDes').val();
   var tmpAmt = $('#iAmount').val().replace(/\$/g, '');
   var tmpUnt = $('#iUnit').val().replace(/\$/g, '');
   if(tmpQty == null || tmpQty == "" || tmpDes == null || tmpDes == "" || tmpAmt == null || tmpAmt == ""  || tmpUnt == null || tmpUnt == "" )return;
   var dataItems = [];
   var dollarAmount = 0;
   var qtyAmount = 0;
   if(Session.get("itemStack") != null){
   dataItems =  Session.get("itemStack");
   dollarAmount =  Session.get("dollarAmount");
   qtyAmount =  Session.get("qtyAmount");
   }
   var tmp = { id:Random.id(3), qty: $('#iQty').val(), des: $('#iDes').val(), unit: $('#iUnit').val().replace(/\$/g, ''), amount: $('#iAmount').val().replace(/\$/g, '') };
   swiper.slideTo(1);
   dataItems.push(tmp);
   dollarAmount = parseFloat(dollarAmount + parseFloat($('#iAmount').val().replace(/\$/g, '')));
   qtyAmount = parseFloat(qtyAmount + parseFloat($('#iUnit').val().replace(/\$/g, '')));
   Session.set("itemStack", dataItems);
   Session.set("dollarAmount", dollarAmount);
   Session.set("qtyAmount", qtyAmount);
   $('#iQty').val("");
   $('#iDes').val("");
   $('#iAmount').val("");
   $('#iUnit').val("");
   }
   if(action == "save"){
   var tmpQty = $('#iQty').val();
   var tmpDes = $('#iDes').val();
   var tmpAmt = $('#iAmount').val().replace(/\$/g, '');
   var tmpUnt = $('#iUnit').val().replace(/\$/g, '');
   if(tmpQty == null || tmpQty == "" || tmpDes == null || tmpDes == "" || tmpAmt == null || tmpAmt == ""  || tmpUnt == null || tmpUnt == "" )return;
   var tmp = { id:Random.id(3), qty: $('#iQty').val(), des: $('#iDes').val(), unit: $('#iUnit').val().replace(/\$/g, ''), amount: $('#iAmount').val().replace(/\$/g, '') };
   var dataItems = [];
   var dollarAmount = 0;
   var qtyAmount = 0;
   if(Session.get("itemStack") != null){
   dataItems =  Session.get("itemStack");
   dollarAmount =  Session.get("dollarAmount");
   qtyAmount =  Session.get("qtyAmount");
   dataItems.push(tmp);
   }else{
   dataItems = tmp;
   }
   dollarAmount = parseFloat(dollarAmount + parseFloat($('#iAmount').val().replace(/\$/g, '')));
   dollarAmount = parseFloat(dollarAmount + parseFloat(Session.get("dataTicket").total));
   qtyAmount = parseFloat(qtyAmount + parseFloat($('#iUnit').val().replace(/\$/g, '')));
   Meteor.call('doHyperAddNewItemsToTicket.insert', dataItems, Session.get("dataTicket")._id, dollarAmount, qtyAmount, function(err,res){
            if(res)Session.set("loading", false)
            });
   $('#iQty').val("");
   $('#iDes').val("");
   $('#iAmount').val("");
   $('#iUnit').val("");
   Session.set("itemStack", null);
   Session.set("dollarAmount", null);
   Session.set("addItemShow", false);
   swiper.slideTo(0);
   }
   },                             
});

