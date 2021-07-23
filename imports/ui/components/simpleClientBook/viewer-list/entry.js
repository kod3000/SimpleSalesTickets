import { scb_Clients } from '/imports/api/simpleClientBook/links.js';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import './entry.html';

Template.listClientView.onCreated(function helloOnCreated() {
        Meteor.subscribe('clientBook.all');
});
Template.listClientView.helpers({
        getWidthCustom(){
        return parseFloat(Session.get("widthCustom")) - 20;
        },
        getHeight(){
        return Session.get("heightCustom");
        },
        getHalfHeight(){
        return Session.get("heightHalfCustom");
        },
        numIndex(tmp){
        return tmp+1;
        },
        okayguy(){
        var tmp = scb_Clients.find().fetch();
        if(tmp == null)return;
        return tmp.reverse();
        }                     
});
Template.listClientView.events({

       'click .add'(e){       
       swiper.slideTo(1);
       },
       'click .clickBait'(e){
       const target = e.target;
       var action = $(target).data("id");
       console.log(action);
       FlowRouter.go('EmployeeListTicketsOfClient', { unique: action });
       }
});