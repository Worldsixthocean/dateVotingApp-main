function isDate(myDate) {   //https://www.w3schools.com/js/js_typeof.asp
    return myDate?.constructor === Date;
  }

function LeapYear(year){
    if(year % 4 == 0){//optimisation needed
        if(year % 100 == 0){
            if(year % 400 == 0){
                return true;
            }
            return false;
        }
        return true;
    }
    return false;
}

export function dateToString(date) {
    return(
        date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + '  ' +
        (date.getHours() < 10 ? '0' + date.getHours() :  date.getHours()) + ':' + 
        (date.getMinutes() < 10 ? '0' + date.getMinutes() :  date.getMinutes())
    );
}

function LongMonth(month){
    switch(month){
        case 0:
        case 2:
        case 4:
        case 6:
        case 7:
        case 9:
        case 11:
            return true;
        case 1:
        case 3:
        case 5:
        case 8:
        case 10:
            return false;
        default:
            console.log('LongMonth: invalid input');
            return;
    }
}

function daysInMonth(year, month){
    if(month == 1){
        if(LeapYear(year)) return 29;
        else return 28;
    }
    else return (LongMonth(month) ? 31 : 30);
}

export function daysBefore(date, days){
    if (days == 0) return date;

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    if (day == 1){
        if(month == 0){
            return daysBefore(new Date(year - 1, 11, 31), days - 1);
        }
        else if(month == 2){
            return daysBefore(new Date(year, 1, LeapYear(year) ? 29 : 28), days - 1);
        }
        else{
            return daysBefore(new Date(year, month - 1, LongMonth(month - 1) ? 31 : 30), days - 1);
        }
    }
    else{
        return daysBefore(new Date(year, month, day - 1), days - 1);
    }

}

export function sameDateOrEariler(early,late){
    return (sameDate(early,late) || earlierThan(early,late));
}

export function sameDate(date1, date2){
    if(!(isDate(date1) && isDate(date2))){
        console.log('earlierThanError: both early and late has to be type Date');
        return false;
    }

    return (
        date1.getFullYear() == date2.getFullYear() && 
        date1.getMonth() == date2.getMonth() && 
        date1.getDate() == date2.getDate());
}

export function earlierThan(early, late){
    if(!(isDate(early) && isDate(late))){
        console.log('earlierThanError: both early and late has to be type Date');
        return false;
    }

    if(early.getFullYear() == late.getFullYear()){
        if(early.getMonth() == late.getMonth()){
            return (early.getDate() < late.getDate());
        }
        else return (early.getMonth() < late.getMonth());
    }
    else return (early.getFullYear() < late.getFullYear());

}

export function daysAfter(date, days){
    if (days == 0) return date;

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    if (day == daysInMonth(year, month)){
        if(month == 11){
            return daysAfter(new Date(year + 1, 0, 1), days - 1);
        }
        else{
            return daysAfter(new Date(year, month + 1, 1), days - 1);
        }
    }
    else{
        return daysAfter(new Date(year, month, day + 1), days - 1);
    }

}

export function dayToString(day){
    switch(day){
        case 0:
            return 'Sun';
        case 1:
            return 'Mon';
        case 2:
            return 'Tue';
        case 3:
            return 'Wed';
        case 4:
            return 'Thu';
        case 5:
            return 'Fri';
        case 6:
            return 'Sat';
        default:
            console.log('dayToString: invaild input');
            return 'NaN';
    }
}