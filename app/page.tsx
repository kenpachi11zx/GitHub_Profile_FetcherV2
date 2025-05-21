"use client"

import type React from "react"

import { useState } from "react"
import { Search, User, GitBranch, Users, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface GitHubProfile {
  name: string
  bio: string
  public_repos: number
  followers: number
  following: number
  avatar_url: string
}

export default function Home() {
  const [username, setUsername] = useState("")
  const [profile, setProfile] = useState<GitHubProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      setError("Please enter a GitHub username")
      return
    }

    setLoading(true)
    setError(null)
    setProfile(null)

    try {
      const response = await fetch(`/api/github?username=${encodeURIComponent(username)}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch GitHub profile")
      }

      const data = await response.json()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-3">
            GitHub Profile Explorer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Enter a GitHub username to view their profile details
          </p>
        </div>

        <form onSubmit={fetchProfile} className="flex gap-2 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Enter GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching
              </>
            ) : (
              "Search"
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {profile && (
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="pb-0">
              <div className="flex items-start gap-4">
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={`${profile.name || username}'s avatar`}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                />
                <div>
                  <CardTitle className="text-2xl">{profile.name || username}</CardTitle>
                  <CardDescription className="mt-1">
                    <a
                      href={`https://github.com/${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      @{username} <ExternalLink className="ml-1" size={14} />
                    </a>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {profile.bio && <p className="text-gray-700 dark:text-gray-300 mb-6">{profile.bio}</p>}

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <GitBranch className="text-gray-500" />
                  </div>
                  <p className="text-2xl font-bold">{profile.public_repos}</p>
                  <p className="text-sm text-gray-500">Repositories</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <Users className="text-gray-500" />
                  </div>
                  <p className="text-2xl font-bold">{profile.followers}</p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <User className="text-gray-500" />
                  </div>
                  <p className="text-2xl font-bold">{profile.following}</p>
                  <p className="text-sm text-gray-500">Following</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t">
              <Button variant="outline" asChild>
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex justify-center"
                >
                  View on GitHub <ExternalLink className="ml-2" size={16} />
                </a>
              </Button>
            </CardFooter>
          </Card>
        )}

        {!profile && !error && !loading && (
          <div className="text-center p-12 border-2 border-dashed rounded-lg">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No profile</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter a GitHub username to see their profile details
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
