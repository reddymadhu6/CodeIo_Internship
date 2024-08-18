import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type ContextProps = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

export const Context = createContext<ContextProps>({
  loading: false,
  setLoading: (): boolean => false,
});

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <Context.Provider value={{ loading, setLoading }}>
      {children}
    </Context.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalContext = () => useContext(Context);
