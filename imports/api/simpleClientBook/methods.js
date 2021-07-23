import { Meteor } from 'meteor/meteor';
import { scb_Clients } from './links.js';
import { scb_Tickets } from '../simpleTicketBook/links.js';

Meteor.methods({
    'doHyperCreateClient.insert'(data) {
        var seachExisting = scb_Clients.find({email: data.email, zip: data.zip}).fetch().pop();
        if(seachExisting != null)return {msg:"This already existed..", tmpId: seachExisting._id};
        return {msg:"Successful.", tmpId:  scb_Clients.insert( {unique: data.unique, name:data.name, phone:data.phone, email:data.email, zip: data.zip, address: data.address, cProject: data.currentProject,  createdAt: new Date(), locationData:data.location }) };
    },
    'doHyperCreateClient.update'(data) {
        if(data.active){
            scb_Tickets.update({ticket:data.active, client:data.unique},{$set:{project:data.cProject }});
        }
        return scb_Clients.update({unique:data.unique}, { $set: {name:data.name, phone:data.phone, email:data.email, zip: data.zip, address: data.address, cProject: data.cProject }});
    },
});