import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

  import 'react-toastify/dist/ReactToastify.css';

interface Notify{
  passData:any
}
    const Notify = ({passData} : Notify) => {
        alert(passData)
        toast(passData);
        return (
            <div className='notification'>
             {passData ? <ToastContainer /> : ''} 
            </div>
          );
    }
    export default Notify;
 