import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setPosts } from "@/redux/postSlice";

const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/user/all`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setPosts(res.data.post));
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllPost();
    }, []);
};

export default useGetAllPost;