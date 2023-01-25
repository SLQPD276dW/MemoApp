import React, { ReactNode } from 'react';
import Header from './Header';
import Modal from 'react-modal';

type Props = {
  children: ReactNode;
};

Modal.setAppElement('#__next');

const Layout = (props: Props) => {
  return (
    <div>
      <Header />
      <div id="app">{props.children}</div>
    </div>
  );
};

export default Layout;
