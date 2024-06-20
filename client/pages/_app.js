// pages/_app.js or pages/_app.tsx
import 'antd/dist/reset.css';
import {UserProvider} from '../context';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../components/nav'
import React from 'react';


function MyApp({ Component, pageProps }) {
  return(
  <>
  <UserProvider>
  
    <Nav />
    <Component {...pageProps} />;
    </UserProvider>
  </>
)
}

export default MyApp;
