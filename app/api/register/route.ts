import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import db from "@/lib/db"


export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {fullName, email, password} = body

    if(!fullName || !email || !password) {
      return new NextResponse("All values are required", {status: 400})
    }

    const existingUser = await db.user.findUnique({
      where: {email}
    })

    if(existingUser) {
      return new NextResponse('This Email elready register')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword
      }
    })

    return NextResponse.json({
      message: "Register Susccesfull",
      user : {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      }
    }, {status: 201})


  } catch(error) {
    console.error("Register Error:", error)
  }
}
