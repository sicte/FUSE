import React, { useEffect } from "react";
import { type User } from "../models/modelUser";

import { setUser } from '../redux/sliceUser';
import { setLoader } from "../redux/sliceLoader";

import { useAppDispatch } from '../redux/hookStore';

import { urlUser } from "../api/APIs";
import { getRequest } from "../api/APIManager";
import { routeMaintenance, routeAboutus, routePrivacyPolicy, routeTermsAndConditions, routePostDetails, routeDataDeletion, routeSafetyPolicy } from "../utils/Routes";

function AutoLogin() {
  const dispatch = useAppDispatch();

  function isPostDetailsScreen() {
    return window.location.pathname.startsWith(routePostDetails.replace(':postId', ''));
  }

  async function fetchUser() {
    if (
      window.location.pathname.startsWith(routeMaintenance) ||
      window.location.pathname.startsWith(routeAboutus) ||
      window.location.pathname.startsWith(routePrivacyPolicy) ||
      window.location.pathname.startsWith(routeTermsAndConditions) ||
      window.location.pathname.startsWith(routeDataDeletion) ||
      window.location.pathname.startsWith(routeSafetyPolicy)
    ) {
      return;
    }

    if (!isPostDetailsScreen()) {
      dispatch(setLoader({ isLoading: true }));
    }

    const { data } = await getRequest<User>(urlUser);

    if (data) {
      dispatch(setUser(data));
    }

    if (!isPostDetailsScreen()) {
      dispatch(setLoader({ isLoading: false }));
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return null;
}

export default React.memo(AutoLogin);