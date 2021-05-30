function alerts(creditAmount, numberOfMonths,  insurance, interestRate){
    if(creditAmount < 30000){
        if(creditAmount == 0){
            alert("Необходимо заполнить сумму кредита!");
            return false;
        }
        alert("Сумма кредита должна быть не меньше 30000!");
        return false;
    } 
    if(numberOfMonths < 1){
        alert("Необходимо заполнить количество месяцев(не меньше 1)!");
        return false;
    }
    if(numberOfMonths > 200){
        alert("Количество месяцев не должно быть больше 200!");
        return false;
    }
    if(insurance < 0){
        alert("Сумма страховки не может быть меньше 0!");
        return false;
    }
    if(interestRate <= 0 || interestRate > 100){
        alert("Процентная ставка должна быть больше 0 и не больше 100!");
        return false;
    }
    return true;
}


function calculateFirstPart(){
    var creditAmount, numberOfMonths, typeOfCredit, interestRate, monthPayment,
        monthInterestRate, result, insurance;
    var rounded = function(number){
        return +number.toFixed(2);
    }   
    creditAmount = document.getElementById("creditAmount").value;
    numberOfMonths = document.getElementById("numberOfMonths").value;
    var radios = document.getElementsByName('typeOfCredit');
    insurance = document.getElementById("insurance").value;
    var saveButton = document.getElementById('saveButton');
    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        typeOfCredit = radios[i].value;
        break;
      }
    }
    interestRate = document.getElementById("interestRate").value;
    if (!alerts(creditAmount, numberOfMonths,  insurance, interestRate)){
        return false;
    }
    monthInterestRate = interestRate / 100 / 12;
    creditAmount = parseFloat(creditAmount);
    creditAmount += Number(insurance);
    var table = document.getElementById("myTable");
    for(var i = table.rows.length - 1; i > 0; i--){
        table.deleteRow(i);
    }
    if(typeOfCredit == 1){
        monthPayment = creditAmount * (monthInterestRate * (1 + monthInterestRate)**numberOfMonths)/
                        ((1 + monthInterestRate)**numberOfMonths - 1);
        result = monthPayment * numberOfMonths;
        var creditLeftAmount = creditAmount;

        if (Math.round((monthPayment)*100)/100 <= creditLeftAmount*monthInterestRate){
            alert("Расчет аннуитетного кредита невозможен. Аннуитета в сумме " + String(Math.round((monthPayment)*100)/100) + 
                " недостаточно, чтобы оплатить сумму процентов " + String(creditLeftAmount*monthInterestRate));
            saveButton.disabled = true; 
            return false;
        }
        var monthRate, creditBody;
        var d = new Date();
        d.setMonth(d.getMonth());
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();
        addRow((day < 10 ? '0' : '') + day + "." + (month < 10 ? '0' : '') + month + "." + year, "", "", "", creditAmount);    
        for(var i = 1; i <= numberOfMonths; i++){
            monthRate = creditLeftAmount*monthInterestRate;
            creditBody = monthPayment - creditLeftAmount*monthInterestRate;
            creditLeftAmount -= monthPayment - creditLeftAmount*monthInterestRate;
            var d = new Date();
            d.setMonth(d.getMonth() + i);
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            monthPayment = Math.round((monthPayment)*100)/100;
            creditLeftAmount = Math.round((creditLeftAmount)*100)/100;
            monthRate = Math.round((monthRate)*100)/100;
            creditBody = Math.round((creditBody)*100)/100;
            if(i == numberOfMonths){
                creditBody += creditLeftAmount;
                creditLeftAmount = 0;
            }
            creditBody = Math.round((creditBody)*100)/100;
            addRow((day < 10 ? '0' : '') + day + "." + (month < 10 ? '0' : '') + month + "." + year, monthPayment, monthRate, creditBody, creditLeftAmount); 
        }
    }
    else{
        result = 0;
        var monthPayment, monthRate, creditBody = creditAmount/ numberOfMonths;
        var creditLeftAmount = creditAmount;
        for(var i = 1; i <= numberOfMonths; i++){
            var d = new Date();
            d.setMonth(d.getMonth() + i);
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            monthRate = creditLeftAmount  * monthInterestRate  * 12 * d.daysInMonth() / d.daysInYear();
            monthPayment = (creditAmount/ numberOfMonths) + monthRate; 
            result += monthPayment;
            creditLeftAmount -= creditAmount/numberOfMonths;
            monthPayment = Math.round((monthPayment)*100)/100;
            creditLeftAmount = Math.round((creditLeftAmount)*100)/100;
            monthRate = Math.round((monthRate)*100)/100;
            creditBody = Math.round((creditBody)*100)/100;
            if(i == numberOfMonths){
                creditBody += creditLeftAmount;
                creditLeftAmount = 0;
            }
            addRow((day < 10 ? '0' : '') + day + "." + (month < 10 ? '0' : '') + month + "." + year, monthPayment, monthRate, creditBody, creditLeftAmount); 
        }
    }
    document.getElementById('result').innerHTML = rounded(result);
    document.getElementById('overpayment').innerHTML = rounded(result - creditAmount);
    var tableBody = document.getElementById('myTableBody');
    if (tableBody.rows.length > 0){
        saveButton.disabled = false;
    }
}


function addRow(dateOfPayment, monthPayment, paymentRate, creditBody, leftAmount)
{
  var tableBody = document.getElementById('myTableBody');
  var newRow = tableBody.insertRow(tableBody.rows.length);
  var dateCell = newRow.insertCell(0);
  var m_paymentCell = newRow.insertCell(1);
  var rateCell = newRow.insertCell(2);
  var bodyCell = newRow.insertCell(3);
  var leftCell = newRow.insertCell(4);
  var dateText = document.createTextNode(dateOfPayment);
  var m_paymentText = document.createTextNode(monthPayment);
  var rateText = document.createTextNode(paymentRate);
  var bodyText = document.createTextNode(creditBody);
  var leftText = document.createTextNode(leftAmount);
  dateCell.appendChild(dateText);
  m_paymentCell.appendChild(m_paymentText);
  rateCell.appendChild(rateText);
  bodyCell.appendChild(bodyText);
  leftCell.appendChild(leftText);
}

Date.prototype.daysInMonth = function(){
    return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
};

Date.prototype.daysInYear = function(){
    return ((new Date(this.getFullYear(), 11, 31) - 
    new Date(this.getFullYear(), 0, 0)))/86400000;
}

function getRandomFileName() {
    var timestamp = new Date().toISOString().replace(/[-:.]/g,"");  
    var random = ("" + Math.random()).substring(2, 8); 
    var random_number = timestamp+ "_" + random;  
    return random_number;
}

function exportTableToCSV() {
    var filename = getRandomFileName() + ".csv";
    var csv = [];
    var headRow = ["Date", "Payment", "Iterest rate", "Credit body", "Left amount"];
    csv.push(headRow.join(","));
    var rows = document.querySelectorAll("table tr");
    var tableBody = document.getElementById('myTableBody');
    for (var i = 0; i < tableBody.rows.length; i++) {
        var row = []; 
        var cells = tableBody.rows[i].cells;
        for (var j = 0; j < cells.length; j++) 
            row.push(cells[j].innerText);
        csv.push(row.join(","));        
    }
    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
    alert("Table was saved!");
}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;
    csvFile = new Blob([csv], {type: "text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);
    // Hide download link
    downloadLink.style.display = "none";
    // Add the link to DOM
    document.body.appendChild(downloadLink);
    // Click download link
    downloadLink.click();
}