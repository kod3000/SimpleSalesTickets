import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { scb_Clients } from '/imports/api/simpleClientBook/links.js';

import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/create/home.js';
import '../../ui/pages/open/home.js';
import '../../ui/pages/list/home.js';

import '../../ui/pages/not-found/not-found.js';

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});
FlowRouter.route('/create', {
                 name: 'EmployeeCreateNewClient',
                 action() {
                 BlazeLayout.render('App_body', { main: 'App_create' });
                 },                 
});
FlowRouter.route('/client/:unique', {
                 // the clients ticket list
                 name: 'EmployeeListTicketsOfClient',
                 action() {
                 BlazeLayout.render('App_body', { main: 'App_list' });
                 },
});
FlowRouter.route('/open/:_id', {
                 // open or create a new ticket for client
                 name: 'EmployeeViewTicketOfClient',
                 action() {
                 BlazeLayout.render('App_body', { main: 'App_open' });
                 },
});
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};