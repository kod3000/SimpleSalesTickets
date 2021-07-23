module.exports =  {
sayHello:function(){
    Session.setDefault("appBackgroundColor", "white");
    Session.setDefault("appRegTextColor", "black");
    Session.setDefault("appBTNAction1", "#4CAF50"); // go for it..
    Session.setDefault("appBTNAction2", "#2196f3"); // its avalible if you want.
    Session.setDefault("appBTNAction3", "#e91e63"); // this is important!
    Session.setDefault("appHighLightTextColor", "#e91e63"); // this is important Text!
},
getCSS: function (tmp){
    switch(tmp){
            case "BC":
            return Session.get("appBackgroundColor");
            break;
        case "RTC":
            return Session.get("appRegTextColor");
            break;
        case "HTC":
            return Session.get("appHighLightTextColor");
            break;

        case "BT1":
            return Session.get("appBTNAction1");
            break;
        case "BT2":
            return Session.get("appBTNAction2");
            break;
        case "BT3":
            return Session.get("appBTNAction3");
            break;
        default:
            break;
    }
    
}
}
