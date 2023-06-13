import { Dispatch, createContext, useReducer } from "react";

export type TUser = {
  uid: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
};
type AuthState = {
  currentUser: TUser | null;
  dispatch: Dispatch<AuthAction>;
};

type AuthAction = {
  type: string;
  payload?: object | null;
};

const INITIAL_STATE: AuthState = {
  currentUser: JSON.parse(localStorage.getItem("user") as string),
  dispatch: () => {},
};

export const AuthContext = createContext(INITIAL_STATE);

export default function AuthContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  // auth reducer
  function authReducer(state: AuthState, action: AuthAction): AuthState {
    const { type, payload } = action;
    switch (type) {
      case "LOGIN":
        localStorage.setItem("user", JSON.stringify(payload as TUser));
        return {
          ...state,
          currentUser: payload ? (payload as TUser) : null,
        };
      case "LOGOUT":
        localStorage.clear();
        return { ...state, currentUser: null };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

  return (
    <AuthContext.Provider
      value={{ currentUser: state.currentUser, dispatch: dispatch }}
    >
      {children}
    </AuthContext.Provider>
  );
}
