import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // For JWT-based auth, logout is primarily handled on the client side
    // by removing the token from storage. However, we can add server-side 
    // logic here if needed (e.g., token blacklisting)
    
    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
