import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { registerService, loginService ,checkAuthService} from "@/services";
import { createContext, useState , useEffect} from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({children}){

const [signInFormData,setSignInFormData]=useState(initialSignInFormData)
const [signUpFormData,setSignUpFormData]=useState(initialSignUpFormData)
const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

async function handelRegisterUser(event) {
    event.preventDefault();
    const data = await registerService(signUpFormData);
    
}

async function handleLoginUser(event) {
    event.preventDefault();
    const data = await loginService(signInFormData);

    if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
    } else {
        setAuth({
          authenticate: false,
          user: null,
        });
    }  
}

//check auth user
async function checkAuthUser() {
  try {
    const data = await checkAuthService();
    if (data.success) {
      setAuth({
        authenticate: true,
        user: data.data.user,
      });
      setLoading(false);
    } else {
      setAuth({
        authenticate: false,
        user: null,
      });
      setLoading(false);
    }
  } catch (error) {
    console.log(error);
    if (!error?.response?.data?.success) {
      setAuth({
        authenticate: false,
        user: null,
      });
      setLoading(false);
    }
  }
}

function resetCredentials() {
  setAuth({
    authenticate: false,
    user: null,
  });
}

    useEffect(() => {
        checkAuthUser()
      }, []);


    return (
    <AuthContext.Provider value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handelRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
    }}
    >
        {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
    );
}
