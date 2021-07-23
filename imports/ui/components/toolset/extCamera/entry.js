import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';
import { Images } from '/imports/api/recWeb/links.js';

import './entry.html';


Template.extCamera.onCreated(function bodyOnCreated() {
    this.image = new ReactiveVar(Session.get("cameraData"));
    this.light = new ReactiveVar(false);
    this.currentUploads = new ReactiveVar(false);
    Session.setDefault("currentUpload", null);
    Session.setDefault("currentActive", null);                            
});
Template.extCamera.onRendered(function bodyOnRendered() {                             
    const SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator;
    try{
      if(SUPPORTS_MEDIA_DEVICES) {
          //Get the environment camera (usually the second one)
          navigator.mediaDevices.enumerateDevices().then(devices => {
                const cameras = devices.filter((device) => device.kind === 'videoinput');
                var video = document.getElementById('video');

                if (cameras.length === 0) {
                  throw 'No camera found on this device.';
                }
                const camera = cameras[cameras.length - 1];

                navigator.mediaDevices.getUserMedia({video: {deviceId: camera.deviceId,
                facingMode: ['user', 'environment'],height: {ideal: 720},width: {ideal: 1280}}
                }).then(stream => {
                      const track = stream.getVideoTracks()[0];
                      try {
                        const imageCapture = new ImageCapture(track);
                        const photoCapabilities = imageCapture.getPhotoCapabilities().then(() => { });
                      }catch(err) {
                        // console.log(err)
                      }
                      window.stream = stream; // make stream available to browser console
                      video.srcObject = stream;
                      video.play();
                      document.getElementById('stopTransmission').addEventListener('click',function(){
                        track.stop();
                        console.log(track);
                      },true);
                      document.getElementById('saveStopTransmission').addEventListener('click',function(){
                        track.stop();
                        console.log(track);
                      },true);
                });
          });
      }
    }catch(err) {
      console.log(err.message);
    }
});
Template.extCamera.helpers({
    currentStateUpload(){
      return Session.get("currentActive");
    },
    currentUpload () {
      return Session.get("currentUpload");
    },
    uploadedFiles: function () {
    //return Images.find();
    },
    thumbnails(){
      return Template.instance().image.get();
    },
    getWidth(tmp){
      if(tmp == "box") return (window.innerWidth/2 - 60) - 100;
      return window.innerWidth/2 - 60;
    },
    getHeight(tmp){
      if(tmp == "box") return (window.innerHeight/2 - 60) - 100;
      // first check if tthis is apple.. if it is .. divide by 2.
      return window.innerHeight/2 - 60;
    },
    getHalfHeight(){
      // first check if tthis is apple.. if it is .. divide by 2.
      return (window.innerHeight/2-60)/2;
    },
});
Template.extCamera.events({
    'click video#video'(event, instance) {
      var tmpVideo = document.querySelector('video#video');
      tmpVideo.pause();
      var w = video.videoWidth ;
      var h = video.videoHeight ;
      var canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, w, h);
      var tmpHldr = Template.instance().image.get();
      if(tmpHldr.length == 0){
        tmpHldr = [canvas.toDataURL('image/png')];
      }else{
        console.log(tmpHldr.length);
        if(tmpHldr.length>=4)tmpHldr.splice(0,1);
        tmpHldr.push(canvas.toDataURL('image/png'));
      }
      Template.instance().image.set(tmpHldr);
      Meteor.setTimeout(function(){ tmpVideo.play(); }, 1500);
    },
    'click #overLay'(event, instance) {
      var tmpVideo = document.querySelector('video#video');
      tmpVideo.pause();
      var w = video.videoWidth ;
      var h = video.videoHeight ;
      var canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, w, h);
      var tmpHldr = Template.instance().image.get();
      if(tmpHldr.length == 0){
        tmpHldr = [canvas.toDataURL('image/png')];
      }else{
        console.log(tmpHldr.length);
        if(tmpHldr.length>=4)tmpHldr.splice(0,1);
        tmpHldr.push(canvas.toDataURL('image/png'));
      }
      Template.instance().image.set(tmpHldr);
      Meteor.setTimeout(function(){ tmpVideo.play(); }, 1500);
    },
    'click img.thumb'(event, instance){
      const target = event.target;
      var tmp = $(target).data('index');
      var tmpHldr = Template.instance().image.get();
      tmpHldr.splice(tmp,1);
      Template.instance().image.set(tmpHldr);
    },
    'click .saveImagesGlobal'(){
      Session.set("cameraData", Template.instance().image.get()); // set data 
      Session.set("cameraOff", true); // closes module of camera..
    }
});