import { scb_Clients } from '/imports/api/simpleClientBook/links.js';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Geolocation } from 'meteor/mdg:geolocation';

import './entry.html';

Template.editClienttView.helpers({
    getSessionData(){
    return Session.get("dataClient");
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

});
Template.editClienttView.events({
    'click .btn-success'(e){
    const target = e.target;
    var action = $(target).data("id");
    if(action == "cancel"){
    $('#cName').val(Session.get("dataClient").name);
    $('#cPhone').val(Session.get("dataClient").phone);
    $('#cEmail').val(Session.get("dataClient").email);
    $('#cAddress').val(Session.get("dataClient").address);
    $('#cZip').val(Session.get("dataClient").zip);
    $('#pName').val(Session.get("dataClient").cProject);
    document.querySelector('.swiper-container').swiper.slideTo(1);
    document.querySelector('.swiper-container').swiper.slideTo(0);
    }
    if(action == "save"){
    Session.set("loading", true);
    var tmpData = Session.get("dataClient");
    tmpData.name = $('#cName').val();
    tmpData.phone = $('#cPhone').val();
    tmpData.email = $('#cEmail').val();
    tmpData.address = $('#cAddress').val();
    tmpData.zip = $('#cZip').val();
    tmpData.cProject = $('#pName').val();
    tmpData.unique = Session.get("dataClient").unique;
    Session.set("dataClient", tmpData);
    Meteor.call('doHyperCreateClient.update', tmpData, function(err,res){
                if(res)Session.set("loading", false);                
                });
    document.querySelector('.swiper-container').swiper.slideTo(1);
    document.querySelector('.swiper-container').swiper.slideTo(0);
    }    
    },

});