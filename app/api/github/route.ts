import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory rate limiting
// In production, you'd use a more robust solution like Redis
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10
const requestLog: Record<string, { count: number; resetAt: number }> = {}

export async function GET(request: NextRequest) {
  try {
    // Get the username from the query parameters
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    // Check if username is provided
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    // Implement basic rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const now = Date.now()

    if (!requestLog[ip] || requestLog[ip].resetAt < now) {
      requestLog[ip] = { count: 1, resetAt: now + RATE_LIMIT_WINDOW }
    } else {
      requestLog[ip].count += 1

      if (requestLog[ip].count > MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Try again later." },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": Math.ceil(requestLog[ip].resetAt / 1000).toString(),
            },
          },
        )
      }
    }

    // Fetch data from GitHub API
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "GitHub-Profile-Fetcher",
      },
    })

    // Handle GitHub API errors
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "GitHub user not found" }, { status: 404 })
      }

      return NextResponse.json({ error: "Error fetching data from GitHub API" }, { status: response.status })
    }

    // Parse the response
    const userData = await response.json()

    // Extract only the required fields
    const profileData = {
      name: userData.name,
      bio: userData.bio,
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      avatar_url: userData.avatar_url,
    }

    // Return the data with caching headers
    return NextResponse.json(profileData, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=120",
        "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
        "X-RateLimit-Remaining": (MAX_REQUESTS_PER_WINDOW - requestLog[ip].count).toString(),
        "X-RateLimit-Reset": Math.ceil(requestLog[ip].resetAt / 1000).toString(),
      },
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
