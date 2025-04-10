"use client"

import { fetchPosts, usePosts } from "@/app/services/api/post-api"
import { QueryClient } from "@tanstack/react-query"
import { useState } from "react"

const TestContent = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = usePosts(page)

  const handlePrefetch = (nextPage: number) => {
    QueryClient.prefetchQuery({
      queryKey: ["posts", nextPage],
      queryFn: () => fetchPosts(nextPage),
    })
  }

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error fetching posts</p>

  return (
    <div>
      <h1>Post List</h1>
      <ul>
        {data.posts.map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          setPage((prev) => prev + 1)
        }}
        onMouseEnter={() => handlePrefetch(page + 1)}
      >
        Next Page
      </button>
    </div>
  )
}

export default TestContent
