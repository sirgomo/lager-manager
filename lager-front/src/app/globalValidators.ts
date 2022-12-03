export default class GlobalValidators{
    // nameregex
     public static nameReg = new RegExp("^\s*([A-Za-z]{1,}([\.,]?|[-']| ))+[A-Za-z]+\.?\s*$|\w+");
     public static passReq = new RegExp( "([a-zA-Z]*\.[a-zA-Z]){3,30}");
     public static strasseReq = new RegExp("^\s*([A-Za-z]{1,}([\.,]?|[-']| ))+[A-Za-z]+\.?\s*( [0-9]+)$|\w+");
     public static postleitReq = new RegExp("^[0-9]{5}$");



}
