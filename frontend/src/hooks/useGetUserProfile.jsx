import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setUserProfile } from "@/redux/authSlice";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/v1/user/${userId}/profile`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setUserProfile(res.data.user));
                    console.log(res.data.user)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserProfile();
    }, [userId]);
};

export default useGetUserProfile;