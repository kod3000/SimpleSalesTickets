import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
const cssJack = require( '/imports/startup/client/uniformLook.js');
import './entry.html';

// this checks to see if the user is using an apple device and changes the css for the user..
Template.appleCSS.helpers({
     universal_IOS_ANDROID_CHECK(){
          // function returns true if the device is apple.
          var iOS = /iPad|iPhone|iPod|iPhone Simulator/.test(navigator.userAgent) && !window.MSStream;
          return iOS;
     },
     JACKCSS(tmp){
          // deleveloping..
          return cssJack.getCSS(tmp);
     },
});