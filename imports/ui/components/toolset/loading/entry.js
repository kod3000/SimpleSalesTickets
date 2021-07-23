import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';


import './entry.html';


Template.loading.onCreated(function bodyOnCreated() {
                           // Session.set('loadingSplash', false); // just show loading splash once
                           
                           })
Template.loading.onRendered(function bodyOnCreated() {
                            
                            
                            var message = '<p class="loading-message" style="color:' + $('body').css( "color" )  + ';">Processing..</p>';
                            var spinner = '<div class="sk-spinner sk-spinner-rotating-plane" style="zoom:3;background-color:' + $('body').css( "color" )  + ';" >';
                            if ( ! Session.get('loadingSplash') ) {
                            this.loading = window.pleaseWait({
                                                             logo: '/images/Meteor-logo.png',
                                                             backgroundColor: $('body').css( "background-color" ),
                                                             loadingHtml: message + spinner
                                                             });
                            Session.set('loadingSplash', true); // just show loading splash once
                            }
                            });


Template.loading.onDestroyed(function bodyOnCreated() {
                             if ( this.loading ) {
                             this.loading.finish();
                             }
                             });
