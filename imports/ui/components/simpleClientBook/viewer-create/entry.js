import { scb_Clients } from '/imports/api/simpleClientBook/links.js';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Geolocation } from 'meteor/mdg:geolocation';

import './entry.html';

Template.createClientView.onRendered(function helloOnCreated() {
    var startWatchingPosition = function () {
        if (! watchingPosition && navigator.geolocation) {
        navigator.geolocation.watchPosition(onPosition, onError, options);
        watchingPosition = true;
        }
    };
});
Template.createClientView.helpers({
    getWidthCustom(){
        return parseFloat(Session.get("widthCustom")) - 20;
    },
    getHeight(){
        return Session.get("heightCustom");
    },
    getHalfHeight(){
        return Session.get("heightHalfCustom");
    },
});
Template.createClientView.events({
    'click .btn-success'(e){
        const target = e.target;
        var action = $(target).data("id");
        if(action == "cancel"){
        $('#cName').val("");
        $('#cPhone').val("");
        $('#cEmail').val("");
        $('#cAddress').val("");
        $('#pName').val("");
        $('#cZip').val("");
        swiper.slideTo(0);
        }
        if(action == "jump" || action == "open" ){
        Session.set("loading", true);
        var cName = $('#cName').val() || "N/A";
        var cPhone = $('#cPhone').val() || "000-000-0000";
        var cEmail = $('#cEmail').val().trim();
        var cAddress = $('#cAddress').val() || "N/A";
        var cZip = $('#cZip').val().trim();
        var pName = $('#pName').val() || "Proj-" + Random.id(3);
        var customerUnique =  Random.id(11);
        if( cZip == "" || cZip == null  || cEmail == "" || cEmail == null ){
        Session.set("loading", false);
        if(action == "open")swiper.slideTo(0);
        return;
        }         
        if(Geolocation.currentLocation()){
        var locloc = Geolocation.currentLocation().coords;
        var locationData = {accuracy:locloc.accuracy, latitude: locloc.latitude, longitude: locloc.latitude, speed: locloc.speed};
        }else{
        var locationData = null;
        }
        var customerData = {unique:customerUnique, name: cName, phone: cPhone,  email: cEmail, zip: cZip, address: cAddress, currentProject: pName, location: locationData};
        Meteor.call('doHyperCreateClient.insert', customerData, function(err,res){
                if(res)Session.set("loading", false);
                });
         Session.set("loading", true);
         if(action == "open"){
         var dataSend = {clientUnique:customerUnique, ticketNumber: Random.id(5), projectName: pName};
         Meteor.call('doHyperCreateTicket.insert', dataSend, function(err,res){
                     if(res){
                     Session.set("loading", false);
                     FlowRouter.go('EmployeeViewTicketOfClient', { _id: res });
                     }
                     }); 
        }
        $('#cName').val("");
        $('#cPhone').val("");
        $('#cEmail').val("");
        $('#cAddress').val("");
        $('#pName').val("");
        $('#cZip').val("");
        swiper.slideTo(0);
        }
    },
});