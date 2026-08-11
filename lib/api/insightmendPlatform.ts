import { createClient } from "@/lib/supabase/client";
const API=process.env.NEXT_PUBLIC_API_BASE_URL||"http://localhost:8000";
async function call<T>(path:string,init?:RequestInit){const s=createClient();const {data}=await s.auth.getSession();if(!data.session)throw new Error("Sign in required.");const r=await fetch(API+path,{...init,headers:{"Content-Type":"application/json",Authorization:`Bearer ${data.session.access_token}`,"user-id":data.session.user.id,...(init?.headers||{})}});if(!r.ok)throw new Error(await r.text());return r.json() as Promise<T>}
export type PlatformKind="channels"|"schedules"|"embeds"|"attachments"|"imports"|"outbox";
export const listPlatform=(kind:PlatformKind,wid:string)=>call<any[]>(`/api/insightmend/platform/${kind}?workspace_id=${wid}`);
export const createPlatform=(kind:"channels"|"schedules"|"embeds"|"attachments"|"imports",payload:any)=>call<any>(`/api/insightmend/platform/${kind}`,{method:"POST",body:JSON.stringify(payload)});
export const createEmbedToken=(payload:any)=>call<{token:string;expires_in:number}>("/api/insightmend/platform/embed-token",{method:"POST",body:JSON.stringify(payload)});
export const exploreAttachment=(payload:any)=>call<any>("/api/insightmend/platform/explore",{method:"POST",body:JSON.stringify(payload)});
