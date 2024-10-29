// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof

export function leadingZeros(number, numOfDigits){
    let num = Math.abs(number);
    const zero = "0";
    for( i=0 ; i < numOfDigits ; i++ ){
        if( num > 10 ** (numOfDigits-i) ) 
            return zero.repeat(i) + num;
    }
    return (number < 0 ? "-" : "") + zero.repeat(numOfDigits-1) + num
}
