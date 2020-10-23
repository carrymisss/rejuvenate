import React, { useEffect, useState } from "react";
import { Prompt, useLocation } from "react-router-dom";
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const CustomPrompt = ({ navigate, when, shouldBlockNavigation, yes, no, title, content }) => {
   const currentLocation = useLocation();

   const [modalVisible, updateModalVisible] = useState(false);
   const [lastLocation, updateLastLocation] = useState(null);
   const [exist, setExist] = useState(false);
   const [confirmedNavigation, updateConfirmedNavigation] = useState(false);

   const showModal = location => {
      if (currentLocation.pathname !== location.pathname) {
         updateLastLocation(location);
         updateModalVisible(true);
      }
   };

   const closeModal = cb => {
      setExist(false);
      updateModalVisible(false);
      if (cb) {
         cb();
      }
   };

   const handleBlockedNavigation = nextLocation => {
      if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
         showModal(nextLocation);
         return false;
      }
      return true;
   };

   const handleConfirmNavigationClick = () => {
      closeModal(() => {
         if (lastLocation) {
            updateConfirmedNavigation(true);
         }
      });
   };

   function showConfirm() {
      setExist(true);
      Modal.confirm({
         title: title,
         icon: <ExclamationCircleOutlined />,
         content: content,
         maskClosable: true,
         centered: true,
         okText: yes,
         cancelText: no,
         onOk() {
            handleConfirmNavigationClick();
         },
         onCancel() {
            closeModal();
         }
      });
   }

   useEffect(() => {
      if (confirmedNavigation) {
         navigate(lastLocation.pathname);
         updateConfirmedNavigation(false);
      }
   }, [confirmedNavigation, lastLocation, navigate]);

   return (
      <>
      <Prompt when={when} message={handleBlockedNavigation} />
      { (modalVisible && !exist) && showConfirm() }
      </>
   );
};

export default CustomPrompt;
