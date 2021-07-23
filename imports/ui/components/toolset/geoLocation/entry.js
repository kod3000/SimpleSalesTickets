import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import './entry.html';


Template.geoLocation.helpers({
   geoTrackUser (){
      var locloc = Geolocation.currentLocation();
      if(locloc == null)return false;
      console.log(locloc);
      console.log("https://www.google.com/maps/place/"+ locloc.coords.latitude + "," +locloc.coords.longitude);
      return false;
   },                             
});