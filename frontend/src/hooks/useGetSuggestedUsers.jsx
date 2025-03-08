import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setSuggestedUsers } from "@/redux/authSlice";

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/user/suggested`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchSuggestedUsers();
    }, []);
};

export default useGetSuggestedUsers;
