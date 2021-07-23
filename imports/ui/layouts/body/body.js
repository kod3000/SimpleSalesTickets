import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
const cssJack = require( '/imports/startup/client/uniformLook.js');

import './body.html';

Template.App_body.onCreated(function helloOnCreated() {
    // set Universal Truths...
    Session.setDefault("widthCustom", window.innerWidth/2 - 60);
    Session.setDefault("heightCustom", window.innerHeight/2 - 60);
    Session.setDefault("heightHalfCustom", (window.innerHeight/2-60)/2);
    // Set the necessary properites inside CSS Jack
    cssJack.sayHello();
});

Template.App_body.helpers({
    mobile(){
    if(( navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) || navigator.userAgent.toLowerCase().indexOf("android") > -1) return true;
    return false;
    },
});
