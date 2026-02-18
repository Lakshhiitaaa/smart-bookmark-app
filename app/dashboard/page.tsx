"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [bookmarks, setBookmarks] = useState<any[]>([])

  // Get logged-in user
  useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser()

    if (data.user) {
      setUser(data.user)
      fetchBookmarks(data.user.id)
    }
  }

  getUser()
}, [])

  // Fetch bookmarks
  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    setBookmarks(data || [])
  }

  // Realtime subscription
useEffect(() => {
  if (!user) return

  const channel = supabase
    .channel("bookmarks-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
      },
      () => {
        fetchBookmarks(user.id)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [user])


  // Add bookmark
  const addBookmark = async () => {
    if (!title || !url) {
      alert("Please fill all fields")
      return
    }

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    })

    setTitle("")
    setUrl("")

    fetchBookmarks(user.id)
  }

  // Delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id)
    fetchBookmarks(user.id)
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-xl mx-auto">

      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">
        Welcome {user.email}
      </h1>

      {/* Logout */}
      <button
        onClick={async () => {
          await supabase.auth.signOut()
          window.location.href = "/"
        }}
        className="bg-red-500 text-white px-4 py-2 rounded mb-6"
      >
        Logout
      </button>

      {/* Add Bookmark Form */}
      <div className="border p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">Add Bookmark</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <button
          onClick={addBookmark}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Bookmark
        </button>
      </div>

      {/* Bookmark List */}
      <div>
        <h2 className="font-semibold mb-2">Your Bookmarks</h2>

        {bookmarks.length === 0 && <p>No bookmarks yet.</p>}

        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="border p-3 rounded mb-2 flex justify-between"
          >
            <div>
              <p className="font-medium">{bookmark.title}</p>
              <a
                href={bookmark.url}
                target="_blank"
                className="text-blue-600 text-sm"
              >
                {bookmark.url}
              </a>
            </div>

            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}
