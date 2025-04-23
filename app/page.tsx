'use client'

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import './globals.css';

export default function Home() {
  redirect('/login');
}