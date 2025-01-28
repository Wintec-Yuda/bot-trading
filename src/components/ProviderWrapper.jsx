'use client';

import store from '@/lib/redux/store';
import React from 'react'
import { Provider } from 'react-redux';

const ProviderWrapper = ({children}) => {
  return (
    <Provider store={store}>{children}</Provider>
  )
}

export default ProviderWrapper