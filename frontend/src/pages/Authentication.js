import AuthForm from '../components/AuthForm';
import {json,redirect} from 'react-router-dom';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({request,params}){
  const data=await request.formData();
  const searchParams=new URL(request.url).searchParams;
  const mode=searchParams.get('mode') || 'login' //if undefined;

  if(mode!=='login' && mode!=='signup'){
    throw json({message:'Unsupported mode'},{status:422});
  }

  const authData={
    email:data.get('email'),
    password:data.get('password')
  };

  const response=await fetch('http://localhost:8080/'+mode,{
    method:'POST',
    body:JSON.stringify(authData),
    headers:{
      'Content-Type':'application/json'
    }
  })    //backend sends a token as a part of response we want to validate that

  if(response.status===422 || response.status===401){
    return response;
  }

  if(!response.ok){
    throw json({message:'Could not authenticate user'},{status:500});
  }

  const resData=await response.json();
  const token=resData.token;  //getting hold of that token

  localStorage.setItem('token',token); //storing it with a key 'token',we can get it from local storage for outgoing requests.
  const expiration=new Date();
  expiration.setHours(expiration.getHours() +1); //expiration time is current time +1hr
  localStorage.setItem('expiration',expiration.toISOString());
  return redirect('/');   //once loggedIn go to home page




};