let expression = [];
let lastOperator = "";
let isNewDecimal = true;
let newExp = false;


function enableButtons(enable) {
    var buttons = document.getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].id !== "clear") {
            if (!enable) {
                if (buttons[i].id !== "clearHist") {
                    buttons[i].disabled = true;
                   // buttons[i].style.backgroundColor = "#BFBFBF";
                   buttons[i].style.opacity = "0.5";
                }
            }
            else {
                buttons[i].disabled = false;
                buttons[i].style.opacity = "1.0";
            }
        }
    }
}
function clear() {
    document.getElementById("total").innerHTML = "";
    expression = [];
    lastOperator = "";
    isNewDecimal = true;
    enableButtons(true);
}
function showHistory() {
    var h = document.getElementById("history");
    if (h.style.visibility === 'hidden') {
        h.style.visibility = 'visible';
    } else {
        h.style.visibility = 'hidden';
    }
}
function parseExp() {
    let temp = document.getElementById("total").innerHTML;
    let copy = temp;
    let finalArray = [];
    let negativeNum = false;
    let index = -1;
    //is the first element negative
    if ((index = temp.indexOf("-")) === 0) {
        negativeNum = true;
    }
    let numbers = copy.split(/[^0-9\.]+/);      //number array
    numbers = numbers.filter(function (n) { return n !== "" });

    //operators array
    temp = temp.replace(/[0-9]+/g, "#");            //replace all digits with #
    temp = temp.replace(/[\.)]/g, "");                 //replace . with ""
    var operators = temp.split("#").filter(function (n) { return n }); //take out all the blank objects

    //combine both
    for (i = 0; i < numbers.length; i++) {
        if (negativeNum) {
            if (i == 0) {
                finalArray.push(0);
                finalArray.push(operators[0]);
                finalArray.push(numbers[0]);
            }
            else {
                if (i < operators.length) finalArray.push(operators[i]);
                finalArray.push(numbers[i]);
            }
        }
        else {
            finalArray.push(numbers[i]);
            if (i < operators.length) finalArray.push(operators[i]);
        }
    }
    return finalArray;
}
function calculateFunc() {
    //display on history window
    document.getElementById("displayHist").innerHTML += document.getElementById("total").innerHTML + " = ";
    // Parentheses, Exponents, Multiplication, Division, Addition, Subtraction. 
    let expArray = parseExp();
    let i1 = 0;
    let i2 = 0;
    let i3 = 0;
    while (expArray.length != 1) {
        //Multiplication or Division or Mod
        i1 = expArray.findIndex(function (a) { return a === "*" });
        i2 = expArray.findIndex(function (a) { return a === "/" });
        i3 = expArray.findIndex(function (a) { return a === "%" });

        //Multiplication
        if (i1 !== -1) {
            if ((i2 === -1 && i3 === -1) || ((i2 != -1 && i3 != -1) && (i1 < i2 && i1 < i3)) ||
                ((i2 !== -1 && i3 === -1) && (i1 < i2)) || ((i3 !== -1 && i2 === -1) && (i1 < i3))) {
                let multValue = parseFloat(expArray[i1 - 1]) * parseFloat(expArray[i1 + 1]);
                expArray.splice(i1 - 1, 3, multValue);
                continue;
            }
        }
        //Division
        if (i2 !== -1) {
            if ((i1 === -1 && i3 === -1) || ((i1 != -1 && i3 != -1) && (i2 < i1 && i2 < i3)) ||
                ((i1 !== -1 && i3 === -1) && (i2 < i1)) || ((i3 !== -1 && i1 === -1) && (i2 < i3))) {
                let divValue = parseFloat(expArray[i2 - 1]) / parseFloat(expArray[i2 + 1]);
                expArray.splice(i2 - 1, 3, divValue);
                continue;
            }
        }
        //Modulo
        if (i3 !== -1) {
            if ((i1 === -1 && i2 === -1) || ((i1 != -1 && i2 != -1) && (i3 < i1 && i3 < i2)) ||
                ((i1 !== -1 && i2 === -1) && (i3 < i1)) || ((i2 !== -1 && i1 === -1) && (i3 < i2))) {
                let modValue = parseFloat(expArray[i3 - 1]) % parseFloat(expArray[i3 + 1]);
                expArray.splice(i3 - 1, 3, modValue);
                continue;
            }
        }
        // Additon or Subtraction
        i1 = expArray.findIndex(function (a) { return a === "+" });
        i2 = expArray.findIndex(function (a) { return a === "-" });
        //Addition
        if (((i1 < i2 && i1 !== -1) || (i2 === -1)) && (i1 !== i2)) {
            let addValue = parseFloat(expArray[i1 - 1]) + parseFloat(expArray[i1 + 1]);
            expArray.splice(i1 - 1, 3, addValue);
            continue;
        }
        //Subtraction
        if (((i2 < i1 && i2 !== -1) || (i1 === -1)) && (i1 !== i2)) {
            let subValue = parseFloat(expArray[i2 - 1]) - parseFloat(expArray[i2 + 1]);
            expArray.splice(i2 - 1, 3, subValue);
            continue;
        }
    }
    document.getElementById("total").innerHTML = expArray[0];
    document.getElementById("displayHist").innerHTML += expArray[0] + "<br /><br />";
    //IF RESULT IS INFINITY OR NaN 
    if (expArray[0] === Infinity || expArray[0] === -Infinity || expArray[0] === NaN) {
        enableButtons(false);
    }
    return expArray[0];
}
function calcSquareRoot() {

    let tempValue = document.getElementById("total").innerHTML;
    if (tempValue.length > 1) {
        tempValue = calculateFunc();
    }
    let result = Math.sqrt(tempValue);
    document.getElementById("displayHist").innerHTML += "√" + document.getElementById("total").innerHTML + " = ";
    document.getElementById("total").innerHTML = result;
    document.getElementById("displayHist").innerHTML += result + "<br /><br />";
    //IF RESULT IS INFINITY OR NaN 
    if (result === Infinity || result === -Infinity || result === NaN) {
        enableButtons(false);
    }

}
function isOperand(item) {
    if (item === "/" || item === "*" || item === "+" || item === "-" || item === "%")
        return true;
    else
        return false;
}
function isDecimal(item) {
    if (item === ".")
        return true;
    else
        return false;
}
function isFirstItemOperand(item) {
    let operand = false;
    // if the first item is an operand 
    if (expression.length === 0 && isOperand(item)) {
        operand = true;
    }
    return operand;
}
function islastItemOperand() {
    let operand = false;
    let lastItem = expression[expression.length - 1];
    if (isOperand(lastItem)) {
        operand = true;
        document.getElementById("total").innerHTML = 'ERROR';
        enableButtons(false);
    }
    return operand;
}
function enterOperand(newOperand) {
    if (expression.length > 0) {
        let tmpValue = expression[expression.length - 1];
        //check if last item is a operand
        if (isOperand(tmpValue) === false) {       //if last item is a num enter operand
            document.getElementById("total").innerHTML += newOperand;
            expression.push(newOperand);
            isNewDecimal = true;
        }
        else {                                                   //if new operand is not the same as current
            if (tmpValue !== newOperand && isDecimal(newOperand) === false) {
                let str = document.getElementById("total").innerHTML;
                document.getElementById("total").innerHTML = str.slice(0, -1);      //remove old operand
                document.getElementById("total").innerHTML += newOperand;           //add new
                expression.pop();
                expression.push(newOperand);                                        //add to array
                isNewDecimal = true;
            }
        }
    }
}
function enterDecimal() {
    //if starting the expression with a decimal point
    if (expression.length === 0) {
        document.getElementById("total").innerHTML += "0.";
        expression.push("0");
        expression.push(".");
        isNewDecimal = false;
        return;
    }
    if (expression.length > 0) {
        let tmp = expression[expression.length - 1];
        if (isDecimal(tmp) === false) {
            if (isOperand(tmp)) {
                document.getElementById("total").innerHTML += "0.";
                expression.push("0");
                expression.push(".");
                isNewDecimal = false;
            }
            else if (isNewDecimal) {
                document.getElementById("total").innerHTML += ".";
                expression.push(".");
                isNewDecimal = false;
            }
        }
    }
}
document.getElementById('calc').addEventListener('click', function (e) {
    e.preventDefault()
    var target = e.target;

    if (target.id !== "calc") {
        if (target.id !== "equals" && target.id !== "histButton") {
            if (newExp && target.id !== "sqrRoot" && (isOperand(target.value) === false)) {
                clear();
                newExp = false;
            }
            if (isFirstItemOperand(target.value) === false) {              //check if the first item is an operand
                if (isOperand(target.value) === false && isDecimal(target.value) === false) {         //if item is num then add to the string/array
                    document.getElementById("total").innerHTML += target.value;
                    expression.push(target.value);
                }
                else if (isDecimal(target.value)) {
                    enterDecimal();
                }
                else {
                    enterOperand(target.value);
                }
                newExp = false;
            }
        }
        if (target.id === "clear") {
            clear();
        }
        if (target.id === "equals") {
            if (islastItemOperand() === false && document.getElementById("total").innerHTML !== "") {
                newExp = true;
                calculateFunc();
            }
        }
        if (target.id === "sqrRoot") {
            if (islastItemOperand() === false && document.getElementById("total").innerHTML !== "") {
                newExp = true;
                calcSquareRoot();
            }
        }
        if (target.id === "histButton") {
            showHistory();
        }
    }
})
document.getElementById('clearHist').addEventListener('click', function (e) {
    e.preventDefault()
    var target = e.target;
    document.getElementById("displayHist").innerHTML = "";
})