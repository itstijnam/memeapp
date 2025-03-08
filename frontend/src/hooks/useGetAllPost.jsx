import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setPosts } from "@/redux/postSlice";

const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get(`https://memeapp-4a8f.onrender.com/api/v1/user/all`, { withCredentials: true });
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