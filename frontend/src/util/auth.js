import { redirect } from "react-router-dom";

export function getTokenDuration(){
    const storedExpirationDate=localStorage.getItem('expiration');
    const expirationDate=new Date(storedExpirationDate);
    const now=new Date();
    const duration=expirationDate.getTime()-now.getTime();
    //duration would be + if token is valid - if invalid

    return duration;

}
export function getAuthToken(){
    const token= localStorage.getItem('token'); //getting it from localStorage
   
    if(!token){
        return null;
    }
    const tokenDuration=getTokenDuration();

    if(tokenDuration<0){
        return 'EXPIRED';
    }
    return token;

}

export function tokenLoader(){
    return getAuthToken();

}

export function checkAuthLoader(){     //for route protection
    const token=getAuthToken();

    if(!token){
        return redirect('/auth');

    }

    return null;   //loader must return something

}