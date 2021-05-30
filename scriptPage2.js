function alerts(creditAmount, numberOfMonths, paymentAmount){
    if(creditAmount < 30000 || creditAmount > 100000000){
        if(creditAmount == 0){
            alert("Необходимо заполнить сумму кредита!");
            return false;
        }
        alert("Сумма кредита должна быть не меньше 30000 и не больше 100000000!");
        return false;
    } 
    if(numberOfMonths < 0){
        alert("Необходимо заполнить количество месяцев (больше 0)!");
        return false;
    }
    if(numberOfMonths > 200){
        alert("Количество месяцев не должно быть больше 200!");
        return false;
    }
    if(paymentAmount < creditAmount){
        alert("Общая сумма платежа не может быть меньше суммы кредита!");
        return false;
    }
    return true;
}


function calculateSecondPart(){

    var creditAmount, numberOfMonths, paymentAmount;
    creditAmount = document.getElementById("creditAmount").value;
    numberOfMonths = document.getElementById("numberOfMonths").value;
    paymentAmount = document.getElementById("paymentAmount").value;
    if (!alerts(creditAmount, numberOfMonths, paymentAmount)){
        return false;
    }
    if(creditAmount == paymentAmount){
        document.getElementById('interestRate').innerHTML = "0%";
        return;
    }
    let arr = [];
    var a = 0, i = 0;
    while(a < 100){
        arr[i] = a;
        a += 0.0001;
        i += 1;
    }
    var cf = Math.pow(paymentAmount, 1/4);
    var k = 1;
    if( paymentAmount > 10000000){
        k = 10;
        var cf = Math.pow(paymentAmount, 1/3);
    }
    var target = Math.round(paymentAmount/cf)*cf;
    let start = 0, end = arr.length, pivot = Math.floor((start + end)/2);
    while(start < end){
        if(Math.round(numberOfMonths * creditAmount * (arr[pivot]/100/12 * (1 + arr[pivot]/100/12)**numberOfMonths)/
        ((1 + arr[pivot]/100/12)**numberOfMonths - 1)/cf)*cf != target){
            if(target < Math.round(numberOfMonths * creditAmount * (arr[pivot]/100/12 * (1 + arr[pivot]/100/12)**numberOfMonths)/
            ((1 + arr[pivot]/100/12)**numberOfMonths - 1)/cf)*cf) end = pivot;
            else start = pivot;
            pivot = Math.floor((start + end)/2);
        }
        if (Math.round(numberOfMonths * creditAmount * (arr[pivot]/100/12 * (1 + arr[pivot]/100/12)**numberOfMonths)/
        ((1 + arr[pivot]/100/12)**numberOfMonths - 1)/cf)*cf > (target - cf*k) && Math.round(numberOfMonths * creditAmount * (arr[pivot]/100/12 * (1 + arr[pivot]/100/12)**numberOfMonths)/
        ((1 + arr[pivot]/100/12)**numberOfMonths - 1)/cf)*cf < (target + cf*k)){
            document.getElementById('interestRate').innerHTML = String(Math.round(arr[pivot]*10000)/10000) + "%";
            return;
        }
    }
    document.getElementById('interestRate').innerHTML = 'Not found ( or more than 100%)';
    
}


