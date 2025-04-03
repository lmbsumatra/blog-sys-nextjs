

import { NextRequest, NextResponse } from "next/server";
// import { POST as POSTMethod } from "./POST.ts";  
import { GET as GETMethod } from "./GET.ts";    
// import { PUT as PUTMethod } from "./PUT.ts";    
// import { DELETE as DELETEMethod } from "./DELETE.ts"; 

// 
export const GET = async (req: NextRequest) => {
    return GETMethod(req); 
};

// export const POST = async (req: NextRequest) => {
//     return POSTMethod(req);
// };

// export const PUT = async (req: NextRequest) => {
//     return PUTMethod(req);
// };

// export const DELETE = async (req: NextRequest) => {
//     return DELETEMethod(req);
// };
