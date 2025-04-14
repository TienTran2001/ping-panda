import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const API_URL = "https://jsonplaceholder.typicode.com/posts"

export const fetchPosts = async (page: number, limit: number = 10) => {
  const response = await axios.get(API_URL, {
    params: { _page: page, _limit: limit },
  })

  const totalCount = parseInt(response.headers["x-total-count"], 10)
  return {
    posts: response.data,
    totalCount,
  }
}

export const usePosts = (page: number, limit: number = 10) => {
  return useQuery({
    queryKey: ["posts", page],
    queryFn: () => fetchPosts(page, limit),
    keepPreviousData: true,
  })
}
