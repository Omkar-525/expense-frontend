import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import { useRouter } from 'next/router';

const AuthenticationForm = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    name: !isLogin ? Yup.string().required('Required') : undefined,
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleAuthentication = async (values) => {
    try {
      const endpoint = isLogin ? 'login' : 'register';
      const response = await fetch(`http://localhost:8080/${endpoint}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const responseData = await response.json();

      if (responseData.response_code === '200') {
        console.log(`${isLogin ? 'Login' : 'Registration'} successful!`);
        if(isLogin){
          if (responseData.jwt) {
            localStorage.setItem('jwt', responseData.jwt);
            localStorage.setItem('user', JSON.stringify(responseData.user));
          }
      
          router.push('/dashboard');
        } else {
          router.push("/");
        }
        
      } else {
        alert(`${isLogin ? 'Login' : 'Registration'} failed. Invalid credentials.`);
        router.push("/");
      }
    } catch (error) {
      console.error('An error occurred:', error);
      router.push("/");
    }
  };

  useEffect(()=>{
    if(localStorage.getItem('jwt') !== null){
      router.push("/dashboard");
    }
  },[])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 sm:px-0">
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-1/2 md:w-1/3">
        <div className="flex justify-center mb-4">
          <Image
            className="w-20 h-20 object-contain"
            src={"/assets/images/logo.png"}
            alt="Logo"
            width={100}
            height={100}
          />
        </div>
        <h2 className="text-2xl font-semibold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleAuthentication}
        >
          <Form>
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border rounded-sm focus:ring focus:ring-blue-300"
                />
                <ErrorMessage name="name" component="div" className="text-red-500" />
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="email">Email</label>
              <Field
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border rounded-sm focus:ring focus:ring-blue-300"
              />
              <ErrorMessage name="email" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                id="password"
                name="password"
                className="w-full px-3 py-2 border rounded-sm focus:ring focus:ring-blue-300"
              />
              <ErrorMessage name="password" component="div" className="text-red-500" />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-sm hover:bg-blue-600 focus:ring focus:ring-blue-300"
            >
              {isLogin ? 'Log in' : 'Register'}
            </button>
          </Form>
        </Formik>
        <p className="mt-2 text-center">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register here' : 'Log in here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthenticationForm;
