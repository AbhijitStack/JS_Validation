/**
 * Created by : Abhijit Kumar
 * email : abhijit.stack@gmail.com
 */

var Validation = {element: {}, message: {list: []}};
var ValidationTools = {};

Validation.report = {
    issuccessful: true,
    id: "",
    attribute: "",
    value: "",
    reset: function () {
        this.issuccessful = true;
        this.id = "";
        this.attribute = "";
        this.value = "";
    }
};


Validation.message.init = function () {
    Validation.message.list["email"] = "Invalid Email format!";
    Validation.message.list["maxlength"] = "maxlength exceeds";
    Validation.message.list["minlength"] = "Minimum length";
    Validation.message.list["datefrom"] = "You can't Enter To Date more than From Date";
    Validation.message.list["mobile"] = "This is a mobile type";
    Validation.message.list["verify"] = " exists!!!";

}

Validation.message.add = function (value) {
    var key = (ValidationTools.getFunctionName(arguments.callee.caller));
    Validation.message.list[key] = value;
}

Validation.message.get = function () {
    var ret = "";

    switch (Validation.report.attribute) {
        case "minlength":
            ret = Validation.message.list[Validation.report.attribute] + " is " + Validation.report.value;
            break;
        case "verify":
            ret = Validation.report.id + " " + Validation.message.list[Validation.report.attribute];
            break;
        default:
            ret = Validation.message.list[Validation.report.attribute];
    }
    return ret;
}


Validation.createStyle = function () {
    var style = document.createElement("style");

    var styleElements =
        ".ValidationErrMsg{" +
        "margin:10px 0px;" +
        "position:absolute;" +
        "padding:5px 10px;" +
        "background-color:#cc3309;" +
        "border:1px;" +
        "box-shadow:1px 1px 2px 1px #ee3309;" +
        "font-size:12px;" +
        "color:#fefefe;" +
        "border-radius:3px;" +
        "z-index:999999999" +
        "}" +
        " \n ";
    styleElements +=
        ".ErrMsgBorder{" +
        "margin-top:-25px;" +
        "position:absolute;" +
        "width  : 0;" +
        "height : 0;" +
        "border-left   : 8px solid transparent;" +
        "border-right  : 8px solid transparent;" +
        "border-bottom : 12px solid #cc3309;" +
        "}";
    style.innerHTML = styleElements;
    document.body.appendChild(style);
}


ValidationTools.pattern = function (mystring, attribute, value) {
    console.log(mystring, attribute, value);
    var patt = new RegExp(value);
    console.log(patt.test(mystring));
}

ValidationTools.toDateAndFromDate = function (mydate, fromid) {
    var fromdate = document.getElementById(fromid).value;
    var date1 = new Date(mydate);
    var date2 = new Date(fromdate);

    if (date1.getFullYear() > date2.getFullYear())
        return false;

    if ((date1.getDate() > date2.getDate()) && (date1.getMonth() >= date2.getMonth()) && (date1.getFullYear() == date2.getFullYear()))
        return false;

    return true;

}

ValidationTools.ajaxRequest = function (id, mystring, data) {
    var xhttp = new XMLHttpRequest();
    var params = data.name + "=" + mystring;
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            if (xhttp.responseText == "true") {
                Validation.report.issuccessful = true;
                return true;
            }
            else {
                Validation.report.issuccessful = false;
                Validation.report.id = id;
                Validation.report.attribute = id + "_verify";
                Validation.report.value = "";
                Validation.message.list[Validation.report.attribute] = data.errormsg;
                Validation.showError();

            }
        }
    };
    if (data.method.toLowerCase() == "get") {
        xhttp.open(data.method, data.url + "?" + params, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();
    }
    else {
        xhttp.open(data.method, data.url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(params);
    }
}


ValidationTools.getFunctionName = function (func) {
    var ret = func.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
}

Object.prototype.Validation = function (id, attribute, value) {
    var mystring = this.toString();
    var result;
    switch (attribute) {
        case "datefrom":
            result = ValidationTools.toDateAndFromDate(mystring, value);
            break;
        case "verify":
            result = ValidationTools.ajaxRequest(id, mystring, value);
            break;
        case "fixedlength":
            result = (mystring.length != value) ? false : true;
            break;
        case "custom":
            Validation.element.id = id;
            Validation.element.value = mystring;
            result = eval(value + "()");
            break;
        case "match":
            var match1 = document.getElementById(id);
            var match2 = document.getElementById(value);
            if (match1 != "undefined") {
                result = (match1.value != match2.value) ? false : true;
            }
            else {
                result = false;
            }
            break;
        case "maxlength":
            result = (mystring.length > value) ? false : true;
            break;
        case "minlength":
            result = (mystring.length < value) ? false : true;
            break;
        case "required":
            result = (mystring.length == 0) ? false : true;
            break;
        case "pattern":
            result = (ValidationTools.pattern(mystring, attribute, value)) ? false : true;
            break;
        case "type":
            switch (value) {
                case "name":
                    var patt = /^[a-z][a-z .]+$/gi;
                    result = (!patt.test(mystring)) ? false : true;
                    if (result) {

                    }
                    break;

                case "email":
                    var patt = /^[a-z]+[a-zA-z0-9_.]*[@][a-z]+[.][a-z]+/gi;
                    result = (!patt.test(mystring)) ? false : true;
                    break;
                case "mobile":
                    var patt = /^\d{10}$/g;
                    result = (!patt.test(mystring)) ? false : true;
                    break;
                case "dropdown":
                    result = (mystring == "null") ? false : true;
                    break;
                case "radio":
                    var myelement = document.getElementById(id);
                    if (myelement.hasAttribute("name")) {
                        var myname = (myelement.getAttribute("name"));
                        result = (document.querySelector("input[name='" + myname + "']:checked") == null) ? false : true;
                    }
                    break;
            }


            break;
    }
    return result;
};


Validation.showError = function () {
    var div = document.createElement("div");

    document.getElementById(Validation.report.id);
    var container = document.getElementById(Validation.report.id).parentNode,
        currentElement = document.getElementById(Validation.report.id);
    var marginleft = (currentElement.getBoundingClientRect().left - container.getBoundingClientRect().left);

    if (container && currentElement) {
        var div = document.createElement("div");
        div.className = "ValidationErrMsg";
        var str = "";
        if ((Validation.report.attribute == "custom") || (Validation.report.attribute == "type")) {
            Validation.report.attribute = Validation.report.value;
        }
        if (Validation.message.list[Validation.report.attribute] != undefined) {
            str = Validation.message.get();
        }
        else {
            str = "Error: " + Validation.report.attribute;
            if (Validation.report.value == true) {
                str += " !!! ";
            }
            else {
                str += " is " + Validation.report.value;
            }

        }
        div.innerHTML = str;
        var arrow = document.createElement("div");
        arrow.className = "ErrMsgBorder";
        div.style.marginLeft = (1+marginleft) + "px";
        div.appendChild(arrow);
        currentElement.parentNode.insertBefore(div, currentElement.nextSibling);
    }
    // console.log("Error in  id", Validation.report.id, "attribute", Validation.report.attribute);
}

Validation.inProgress = function () {
    for (var field_count = 0; field_count < Validation.fields.length; field_count++) {
        // Validation.report.reset();
        var attributes = (Object.keys(Validation.fields[field_count]));
        var myid = Validation.fields[field_count].id;
        var myelement = document.getElementById(myid).value;


        for (var attribute_count = 0; attribute_count < attributes.length; attribute_count++) {

            var myattribute = (attributes[attribute_count]);
            var myvalue = Validation.fields[field_count][myattribute];
            if (myattribute != "id")
                if (myelement.Validation(myid, myattribute, myvalue) == 0) {
                    Validation.report.issuccessful = false;
                    Validation.report.id = myid;
                    Validation.report.attribute = myattribute;
                    Validation.report.value = myvalue;
                    break;
                }
        }
        if (!Validation.report.issuccessful) {
            Validation.showError();
            break;
        }
    }
}
Validation.ValidationErrMsgClear = function () {
    var elements = document.getElementsByClassName("ValidationErrMsg");
    if (elements.length != 0) {
        for(var count=0;count<=elements.length;count++) {
            var parent = elements[count].parentNode;
            parent.removeChild(elements[count]);
            Validation.report.reset();
        }
    }
}

Validation.Initiate = function (form) {
    Validation.createStyle();
    Validation.message.init();
    document.getElementById(form).addEventListener('submit', function (event) {
        event.preventDefault();
        Validation.ValidationErrMsgClear();
        Validation.inProgress();
        if (Validation.report.issuccessful)
            document.getElementById(form).submit();
    }, false);
}




