import { Meteor } from 'meteor/meteor';
import { scb_Tickets } from './links.js';
import { scb_Clients } from '../simpleClientBook/links.js';

Meteor.methods({
    'doHyperCreateTicket.insert'(data) {
        scb_Clients.update({unique:data.clientUnique}, {$set:{active:data.ticketNumber}});
        return scb_Tickets.insert( {client: data.clientUnique, ticket:data.ticketNumber, project:data.projectName, items:null, notes:null, payments:null, moneyCollected:0, total:0, qty:0, createdAt: new Date() , status:"New", completed:false, state:"idle", clientNotifed:null, timeStamps: null});
    },
    'doHyperAddNewItemsToTicket.insert'(data, idTmp, amt, qty) {
        var tmpItems = scb_Tickets.find({_id:idTmp}).fetch().pop();
        if(tmpItems['status'] == "New")scb_Tickets.update({_id:idTmp},{$set:{status:"Pending"}});
        if(tmpItems['status'] == "Ready Up")scb_Tickets.update({_id:idTmp},{$set:{status:"Pending", state:"idle", clientNotifed:null}});
        if(tmpItems['items'] != null){
            if(data.length >1){
                for(i=0;i<data.length;i++){
                    data[i].createdAt = new Date();
                    data[i].status = "Pending";
                    data[i].completed = false;
                    tmpItems['items'].push(data[i]);
                }
            }else{
                data.createdAt = new Date();
                data.status = "Pending";
                data.completed = false;
                tmpItems['items'].push(data);
            }
            qty = qty + tmpItems['qty'];
        }else{
            if(data.length >1){
                tmpItems['items'] = []; 
                for(i=0;i<data.length;i++){
                    data[i].createdAt = new Date();
                    data[i].status = "Pending";
                    data[i].completed = false;
                    tmpItems['items'].push(data[i]);
                }
            }else{
                data.createdAt = new Date();
                data.status = "Pending";
                data.completed = false;
                tmpItems['items'] = [data]; 
            }
        }
        return scb_Tickets.update({_id:idTmp}, {$set:{items: tmpItems['items'], total: amt, qty: qty}});
    },
    'doHyperOverallStatusForTicket.update'(data, ticketId){
    if(data.action == "Done"){
        var tmp =  scb_Tickets.find({_id:ticketId}).fetch().pop();
        for (i=0; i<tmp['items'].length; i++){
            if(tmp['items'][i].completed){
               // skip this item..
            }else{
                tmp['items'][i].completed = true;
                tmp['items'][i].status = "Completed";
                tmp['items'][i].completedOn = new Date();
            }
        }
        scb_Tickets.update({_id:ticketId}, {$set:{items:tmp['items']}});
    }
    return scb_Tickets.update({_id:ticketId}, {$set:{state:data.action, status:data.status}});
    },
    'doHyperCloseTicket.update'(ticketId){
        var tmp =  scb_Tickets.find({_id:ticketId}).fetch().pop();
        scb_Clients.update({unique:tmp['client']}, {$set:{active:null}});
        return scb_Tickets.update({_id:ticketId}, {$set: {status:"Closed", completed:true, completedOn:new Date()}});
    },
    'doHyperDeleteItemFromTicket.update'(itemId, ticketId){
        var blankItemList = [];
        var tmpItem = "0";
        var tmp =  scb_Tickets.find({_id:ticketId}).fetch().pop();
        if(tmp == null || itemId == null )return;
        for (i=0; i<tmp['items'].length; i++){
            if(tmp['items'][i].id == itemId){
                tmpItem = tmp['items'][i];
            }else{
                blankItemList.push(tmp['items'][i]);
            }
        }
        return scb_Tickets.update({_id:ticketId}, {$set:{items: blankItemList, total: parseFloat(tmp['total']) - parseFloat(tmpItem['amount']), qty: parseFloat(tmp['qty']) - parseFloat(tmpItem['unit'])}});
    },
    'doHyperItemStatusForTicket.update'(itemId, ticketId, status){
        var blankItemList = [];
        var countCompleted = "0";
        var tmp =  scb_Tickets.find({_id:ticketId}).fetch().pop();
        if(tmp == null || itemId == null )return;
        for (i=0; i<tmp['items'].length; i++){
            if(tmp['items'][i].id == itemId){
                tmp['items'][i].status = status;
                if(status == "Completed"){
                    tmp['items'][i].completed = true;
                    tmp['items'][i].completedOn = new Date();
                }
                blankItemList.push(tmp['items'][i]);
            }else{
                blankItemList.push(tmp['items'][i]);
            }
            if(tmp['items'][i].completed)countCompleted = parseFloat(countCompleted) + 1;
        }
        if(parseFloat(countCompleted) == parseFloat(tmp['qty'])) scb_Tickets.update({_id:ticketId}, {$set:{status:"Ready Up"}});
        return scb_Tickets.update({_id:ticketId}, {$set:{items: blankItemList }});
    },
    'doHyperAddNoteToTicket.insert'(data, idTmp) {
        var tmpItems = scb_Tickets.find({_id:idTmp}).fetch().pop();
        if(tmpItems['notes'] != null){
            if(data.length >1){
                for(i=0;i<data.length;i++){
                    data[i].createdAt = new Date();
                    data[i].createdBBy = "Not Tracked";
                    tmpItems['notes'].push(data[i]);
                }
            }else{
                data.createdAt = new Date();
                data.createdBBy = "Not Tracked";
                tmpItems['notes'].push(data);
            }
        }else{
            data.createdAt = new Date();
            data.createdBBy = "Not Tracked";
            tmpItems['notes'] = [data];
        }
        return scb_Tickets.update({_id:idTmp}, {$set:{notes: tmpItems['notes']}});
    },
    'doHyperAddPaymentToTicket.insert'(data, idTmp) {
        var amountNo = "0";
        var paymentType = "Partial";
        var tmpItems = scb_Tickets.find({_id:idTmp}).fetch().pop();
        if(tmpItems['moneyCollected'] != null || tmpItems['moneyCollected'] != 0 ){
            amountNo = tmpItems['moneyCollected'];
        }
        var stillOweThisAmount = (tmpItems['total'] - parseFloat(amountNo)) - data.payment;
        if(stillOweThisAmount <= 0){
            paymentType = "Full";
        }
        amountNo = parseFloat(amountNo) + parseFloat(data.payment);
        if(tmpItems['payments'] != null){
            if(data.length >1){
                for(i=0;i<data.length;i++){
                    data[i].createdAt = new Date();
                    data[i].createdBBy = "Not Tracked";
                    data[i].paymentType = paymentType;
                    data[i].stillOwe = stillOweThisAmount;
                    tmpItems['payments'].push(data[i]);
                }
            }else{
                data.createdAt = new Date();
                data.createdBBy = "Not Tracked";
                data.createdBBy = "Not Tracked";
                data.paymentType = paymentType;
                data.stillOwe = stillOweThisAmount;
                tmpItems['payments'].push(data);
            }
        }else{
            data.createdAt = new Date();
            data.createdBBy = "Not Tracked";
            data.createdBBy = "Not Tracked";
            data.paymentType = paymentType;
            data.stillOwe = stillOweThisAmount;
            tmpItems['payments'] = [data]; 
        }
        return scb_Tickets.update({_id:idTmp}, {$set:{payments: tmpItems['payments'], moneyCollected: amountNo}});
    },
});