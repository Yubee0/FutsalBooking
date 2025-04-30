import React, {useRef, useEffect} from 'react';
import DropdownAlert from './DropdownAlert';

let dropdownRef = null;

export const DropdownAlertWrapper = () => {
  const internalRef = useRef(null);

  useEffect(() => {
    dropdownRef = internalRef.current;
  }, []);

  return <DropdownAlert ref={internalRef} />;
};

export const showAlert = (type, message) => {
  if (dropdownRef && dropdownRef.showAlert) {
    dropdownRef.showAlert(type, message);
  } else {
    console.warn('DropdownAlert is not ready');
  }
};
