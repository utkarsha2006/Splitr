"use client"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";


import React from 'react'

const mainLayout = ({ children }) => {
  return (
    <SignedIn>
        <div className='container mx-auto mt-24 mb-20'>{children}</div>
    </SignedIn>
  )
}

export default mainLayout