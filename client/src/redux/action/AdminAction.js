import axios from 'axios';
import { sleep } from '../../utils/sleep';
import { baseURL } from '../../constants';

import {
  ACCEPT_WITHDRAW_FAILED,
  ACCEPT_WITHDRAW_REQUEST,
  ACCEPT_WITHDRAW_RESET,
  ACCEPT_WITHDRAW_SUCCESS,
  ADD_HOTSPOT_TO_CLIENT_FAILED,
  ADD_HOTSPOT_TO_CLIENT_REQUEST,
  ADD_HOTSPOT_TO_CLIENT_RESET,
  ADD_HOTSPOT_TO_CLIENT_SUCCESS,
  ADD_MANUAL_WITHDRAW_HISTORY_FAILED,
  ADD_MANUAL_WITHDRAW_HISTORY_REQUEST,
  ADD_MANUAL_WITHDRAW_HISTORY_SUCCESS,
  ADD_NEW_CLIENT_FAILED,
  ADD_NEW_CLIENT_REQUEST,
  ADD_NEW_CLIENT_RESET,
  ADD_NEW_CLIENT_SUCCESS,
  ADMIN_LOGIN_FAILED,
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGOUT,
  CLIENT_UPDATE_FAILED,
  CLIENT_UPDATE_REQUEST,
  CLIENT_UPDATE_RESET,
  CLIENT_UPDATE_SUCCESS,
  DELETE_SINGLE_CLIENT_FAILED,
  DELETE_SINGLE_CLIENT_REQUEST,
  DELETE_SINGLE_CLIENT_RESET,
  DELETE_SINGLE_CLIENT_SUCCESS,
  GET_ALL_CLIENTS_FAILED,
  GET_ALL_CLIENTS_REQUEST,
  GET_ALL_CLIENTS_SUCCESS,
  GET_MANUAL_WITHDRAW_HISTORY_FAILED,
  GET_MANUAL_WITHDRAW_HISTORY_REQUEST,
  GET_MANUAL_WITHDRAW_HISTORY_SUCCESS,
  DELETE_MANUAL_WITHDRAW_HISTORY_FAILED,
  DELETE_MANUAL_WITHDRAW_HISTORY_REQUEST,
  DELETE_MANUAL_WITHDRAW_HISTORY_SUCCESS,
  GET_MW_SW_CW_BALANCE_REQUEST,
  GET_MW_SW_CW_BALANCE_RESET,
  GET_MW_SW_CW_BALANCE_SUCCESS,
  GET_SINGLE_CLIENT_FAILED,
  GET_SINGLE_CLIENT_REQUEST,
  GET_SINGLE_CLIENT_SUCCESS,
  GET_WITHDRAWAL_FAILED,
  GET_WITHDRAWAL_REQUEST,
  GET_WITHDRAWAL_SUCCESS,
  HOTSPOT_DELETE,
  HOTSPOT_UPDATE_FAILED,
  HOTSPOT_UPDATE_REQUEST,
  HOTSPOT_UPDATE_RESET,
  HOTSPOT_UPDATE_SUCCESS,
  REJECT_WITHDRAW_FAILED,
  REJECT_WITHDRAW_REQUEST,
  REJECT_WITHDRAW_RESET,
  REJECT_WITHDRAW_SUCCESS,
  GET_WITHDRAW_HISTORY_BYA_REQUEST,
  GET_WITHDRAW_HISTORY_BYA_SUCCESS,
  GET_WITHDRAW_HISTORY_BYA_FAILED,
  GET_REWARD_BY_ADMIN_SUCCESS,
  GET_REWARD_BY_ADMIN_FAILED,
  GET_REWARD_BY_ADMIN_REQUEST,
  GET_REWARD_BY_ADMIN_RESET,
  GET_AGREEMENTS_REQUEST,
  GET_AGREEMENTS_SUCCESS,
  GET_AGREEMENTS_FAILED,
  MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_REQUEST,
  MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_SUCCESS,
  MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_FAILED,
  MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_RESET,
  ADMIN_RESET_CLIENT_PASSWORD_REQUEST,
  ADMIN_RESET_CLIENT_PASSWORD_SUCCESS,
  ADMIN_RESET_CLIENT_PASSWORD_RESET,
  ADMIN_RESET_CLIENT_PASSWORD_FAILED,
} from '../actionTypes';

export const adminLogin = (credentials) => async (dispatch) => {
  try {
    dispatch({
      type: ADMIN_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(
      `${baseURL}/api/admin/login`,
      { credentials },
      config
    );
    localStorage.setItem('aInfo', JSON.stringify(data));
    dispatch({
      type: ADMIN_LOGIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_LOGIN_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const adminLogout = () => async (dispatch) => {
  try {
    localStorage.removeItem('aInfo');
    dispatch({ type: ADMIN_LOGOUT });
  } catch (err) {
    console.log(err);
  }
};

export const getAllClients = (pageNo) => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_ALL_CLIENTS_REQUEST,
    });

    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.get(
      `${baseURL}/api/admin/getAllClients/${pageNo}`,
      config
    );
    dispatch({
      type: GET_ALL_CLIENTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_ALL_CLIENTS_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getSingleClient = (clientId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_SINGLE_CLIENT_REQUEST,
    });

    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.get(
      `${baseURL}/api/admin/getSingleClientHotspots/${clientId}`,
      config
    );
    dispatch({
      type: GET_SINGLE_CLIENT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SINGLE_CLIENT_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addNewClient = (client) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADD_NEW_CLIENT_REQUEST,
    });

    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.post(
      `${baseURL}/api/admin/addNewClient`,
      client,
      config
    );
    dispatch({
      type: ADD_NEW_CLIENT_SUCCESS,
      payload: data,
    });
    dispatch({
      type: ADD_NEW_CLIENT_RESET,
    });
  } catch (error) {
    dispatch({
      type: ADD_NEW_CLIENT_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const updateClient =
  (clientId, client) => async (dispatch, getState) => {
    try {
      dispatch({
        type: CLIENT_UPDATE_REQUEST,
      });

      const {
        loginAdmin: { aInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${aInfo._atoken}`,
        },
      };
      const { data } = await axios.put(
        `${baseURL}/api/admin/editClientProfile/${clientId}`,
        client,
        config
      );
      dispatch({
        type: CLIENT_UPDATE_SUCCESS,
        payload: data,
      });
      setTimeout(() => {
        dispatch({
          type: CLIENT_UPDATE_RESET,
        });
      }, 2000);
    } catch (error) {
      dispatch({
        type: CLIENT_UPDATE_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const deleteClient = (clientId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DELETE_SINGLE_CLIENT_REQUEST,
    });

    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.delete(
      `${baseURL}/api/admin/deleteClient/${clientId}`,
      config
    );
    dispatch({
      type: DELETE_SINGLE_CLIENT_SUCCESS,
      payload: data,
    });

    dispatch({
      type: DELETE_SINGLE_CLIENT_RESET,
    });
  } catch (error) {
    dispatch({
      type: DELETE_SINGLE_CLIENT_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addHotspotToClient = (datas) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADD_HOTSPOT_TO_CLIENT_REQUEST,
    });

    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.post(
      `${baseURL}/api/admin/addHotspot`,
      datas,
      config
    );
    dispatch({
      type: ADD_HOTSPOT_TO_CLIENT_SUCCESS,
      payload: data,
    });
    setTimeout(() => {
      dispatch({
        type: ADD_HOTSPOT_TO_CLIENT_RESET,
      });
    }, 3000);
  } catch (error) {
    dispatch({
      type: ADD_HOTSPOT_TO_CLIENT_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteHotspot =
  (hotspotId, clientId) => async (dispatch, getState) => {
    try {
      const {
        loginAdmin: { aInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${aInfo._atoken}`,
        },
      };
      const { data } = await axios.delete(
        `${baseURL}/api/admin/deleteHotspot/${hotspotId}/${clientId}`,
        config
      );
      dispatch({
        type: HOTSPOT_DELETE,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ADD_HOTSPOT_TO_CLIENT_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const updateHotspot =
  (hotspotId, hotspot) => async (dispatch, getState) => {
    try {
      dispatch({
        type: HOTSPOT_UPDATE_REQUEST,
      });
      const {
        loginAdmin: { aInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${aInfo._atoken}`,
        },
      };
      await axios.put(
        `${baseURL}/api/admin/editHotspot/${hotspotId}`,
        hotspot,
        config
      );
      dispatch({
        type: HOTSPOT_UPDATE_SUCCESS,
      });
      setTimeout(() => {
        dispatch({
          type: HOTSPOT_UPDATE_RESET,
        });
      }, 2000);
    } catch (error) {
      dispatch({
        type: HOTSPOT_UPDATE_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getWithdrawalRequets = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_WITHDRAWAL_REQUEST,
    });
    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.get(
      `${baseURL}/api/admin/getWithdrawalRequests`,
      config
    );
    dispatch({
      type: GET_WITHDRAWAL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_WITHDRAWAL_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const rejectWithdrawRequest = (wrId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: REJECT_WITHDRAW_REQUEST,
    });
    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.put(
      `${baseURL}/api/admin/withdrawalRequestReject/${wrId}/reject`,
      {},
      config
    );
    dispatch({
      type: REJECT_WITHDRAW_SUCCESS,
      payload: data,
    });
    setTimeout(() => {
      dispatch({
        type: REJECT_WITHDRAW_RESET,
      });
    }, 2000);
  } catch (error) {
    dispatch({
      type: REJECT_WITHDRAW_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    dispatch({
      type: REJECT_WITHDRAW_RESET,
    });
  }
};

export const acceptWithdrawRequest = (wrId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ACCEPT_WITHDRAW_REQUEST,
    });
    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.put(
      `${baseURL}/api/admin/withdrawalRequestAccept/${wrId}/accept`,
      {},
      config
    );
    dispatch({
      type: ACCEPT_WITHDRAW_SUCCESS,
      payload: data,
    });
    setTimeout(() => {
      dispatch({
        type: ACCEPT_WITHDRAW_RESET,
      });
    }, 2000);
  } catch (error) {
    dispatch({
      type: ACCEPT_WITHDRAW_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    dispatch({
      type: ACCEPT_WITHDRAW_RESET,
    });
  }
};

export const getMWSWCWbalances = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_MW_SW_CW_BALANCE_REQUEST,
    });
    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.get(
      `${baseURL}/api/admin/getMainSecondWallet`,
      config
    );
    dispatch({
      type: GET_MW_SW_CW_BALANCE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_MW_SW_CW_BALANCE_RESET,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getManulaWithdrawHistory =
  (clientId) => async (dispatch, getState) => {
    try {
      dispatch({
        type: GET_MANUAL_WITHDRAW_HISTORY_REQUEST,
      });
      const {
        loginAdmin: { aInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${aInfo._atoken}`,
        },
      };
      const { data } = await axios.get(
        `${baseURL}/api/admin/getManulaWithdrawHistory/${clientId}`,
        config
      );
      dispatch({
        type: GET_MANUAL_WITHDRAW_HISTORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_MANUAL_WITHDRAW_HISTORY_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const addManulaWithdrawHistory =
  (clientId, mw_amount) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ADD_MANUAL_WITHDRAW_HISTORY_REQUEST,
      });
      const {
        loginAdmin: { aInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${aInfo._atoken}`,
        },
      };
      const { data } = await axios.put(
        `${baseURL}/api/admin/addManualWithdraw/${clientId}`,
        { mw_amount },
        config
      );
      dispatch({
        type: ADD_MANUAL_WITHDRAW_HISTORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ADD_MANUAL_WITHDRAW_HISTORY_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const deleteManulaWithdrawHistory =
  (historyId) => async (dispatch, getState) => {
    try {
      dispatch({
        type: DELETE_MANUAL_WITHDRAW_HISTORY_REQUEST,
      });
      const {
        loginAdmin: { aInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${aInfo._atoken}`,
        },
      };
      const { data } = await axios.delete(
        `${baseURL}/api/admin/deleteManualWithdraw/${historyId}`,
        config
      );
      dispatch({
        type: DELETE_MANUAL_WITHDRAW_HISTORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DELETE_MANUAL_WITHDRAW_HISTORY_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getWithdrawHistoryByA =
  (clientId) => async (dispatch, getState) => {
    try {
      dispatch({
        type: GET_WITHDRAW_HISTORY_BYA_REQUEST,
      });
      const {
        loginAdmin: { aInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${aInfo._atoken}`,
        },
      };
      const { data } = await axios.get(
        `${baseURL}/api/admin/getWithdrawHistoryByAdmin/${clientId}`,
        config
      );
      dispatch({
        type: GET_WITHDRAW_HISTORY_BYA_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_WITHDRAW_HISTORY_BYA_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getRewardByAdmin = (clientIds) => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_REWARD_BY_ADMIN_REQUEST,
    });
    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    await axios.put(
      `${baseURL}/api/admin/getRewardsByAdmin`,
      { clientIds },
      config
    );
    dispatch({
      type: GET_REWARD_BY_ADMIN_SUCCESS,
    });

    dispatch({
      type: GET_REWARD_BY_ADMIN_RESET,
    });
  } catch (error) {
    dispatch({
      type: GET_REWARD_BY_ADMIN_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    dispatch({
      type: GET_REWARD_BY_ADMIN_RESET,
    });
  }
};

export const getAgreements = (hotspotAdress) => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_AGREEMENTS_REQUEST,
    });
    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };
    const { data } = await axios.get(
      `${baseURL}/api/admin/getHotspotAgreements/${hotspotAdress}`,
      config
    );
    dispatch({
      type: GET_AGREEMENTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_AGREEMENTS_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const acceptMultipleWithdrawRequests =
  (requestIds) => async (dispatch, getState) => {
    try {
      dispatch({
        type: MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_REQUEST,
      });
      const {
        loginAdmin: { aInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${aInfo._atoken}`,
        },
      };
      const { data } = await axios.post(
        `${baseURL}/api/admin/acceptMultipleWithdrawRequests`,
        { requestIds },
        config
      );

      dispatch({
        type: GET_WITHDRAWAL_SUCCESS,
        payload: data,
      });

      dispatch({
        type: MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_SUCCESS,
      });

      await sleep(1000);

      dispatch({
        type: MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_RESET,
      });
    } catch (error) {
      dispatch({
        type: MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      dispatch({
        type: MULTIPLE_WITHDRAW_REQUESTS_ACCEPT_RESET,
      });
    }
  };

export const resetClientPassword = (clientId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADMIN_RESET_CLIENT_PASSWORD_REQUEST,
    });
    const {
      loginAdmin: { aInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${aInfo._atoken}`,
      },
    };

    await axios.put(
      `${baseURL}/api/admin/passwordReset/client`,
      { clientId },
      config
    );

    dispatch({
      type: ADMIN_RESET_CLIENT_PASSWORD_SUCCESS,
    });

    await sleep(1000);

    dispatch({
      type: ADMIN_RESET_CLIENT_PASSWORD_RESET,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_RESET_CLIENT_PASSWORD_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    dispatch({
      type: ADMIN_RESET_CLIENT_PASSWORD_RESET,
    });
  }
};
