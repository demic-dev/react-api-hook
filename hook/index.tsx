import { useReducer, useEffect, useRef } from "react";

type ActionType = {
  type: "fetch" | "resolve" | "reject" | "cancel" | "canceled";
  payload?: {
    resolve?: Response;
    reject?: any;
  };
};

// Return state type
type StateType =
  | {
      status: "idle";
    }
  | {
      status: "loading";
    }
  | {
      status: "success";
      data: Response;
    }
  | {
      status: "failure";
      error: any;
    }
  | {
      status: "inAbort";
    }
  | {
      status: "canceled";
    };

function fetchReducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "fetch":
      if (state.status !== "loading")
        return {
          status: "loading",
        };
      else return state;
    case "resolve":
      return {
        status: "success",
        data: action.payload!.resolve!,
      };
    case "reject":
      return {
        status: "failure",
        error: action.payload!.reject,
      };
    case "cancel":
      if (state.status === "loading")
        return {
          status: "inAbort",
        };
      else return state;
    case "canceled":
      return {
        status: "canceled",
      };
    default:
      throw new Error("Unrecognized type.");
  }
}

/**
 * Whit this hook, you fetch data from the endpoint and it return the state and the returned data. Return the error if there is an error.
 * @param url
 * @param options fetch options, such as headers, parameters, method, etc.
 * @returns returns an array with the state and the functions for start and cancel a request.
 */
function useAPIHook(
  url: RequestInfo,
  options?: RequestInit
): [StateType, () => void, () => void] {
  const [status, dispatch] = useReducer<
    (state: StateType, action: ActionType) => StateType
  >(fetchReducer, {
    status: "idle",
  });
  const controllerRef = useRef<AbortController | null>();

  useEffect(() => {
    if (status.status === "inAbort") {
      controllerRef.current!.abort();
    }
    if (status.status === "loading") {
      const controller = new AbortController();
      controllerRef.current = controller;
      fetch(url, { ...options, signal: controllerRef.current.signal })
        .then((result) =>
          dispatch({
            type: "resolve",
            payload: { resolve: result },
          })
        )
        .catch((result) => {
          if (controllerRef.current!.signal.aborted)
            dispatch({ type: "canceled" });
          else
            dispatch({
              type: "reject",
              payload: { reject: result },
            });
        });
    }
  }, [status.status, url, options]);

  const sendRequest = () => dispatch({ type: "fetch" });

  const cancelRequest = () => dispatch({ type: "cancel" });

  return [status, sendRequest, cancelRequest];
}

export default useAPIHook;
