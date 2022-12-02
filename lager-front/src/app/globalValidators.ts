export default class GlobalValidators{
    // nameregex
     public static nameReg = new RegExp("([a-zA-Z',.-]+( [a-zA-Z',.-]+)*){3,30}");
     public static passReq = new RegExp( "([a-zA-Z]*\.[a-zA-Z]){3,30}");

}
