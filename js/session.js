/* session.js — Sesión única: al entrar se anota un id de sesión en Firebase; si otro dispositivo entra después, este deja de guardar y vuelve al login.
 * Lee: S, code, DB, key(), SV. Escribe: Firebase juego_espacial_sesion/<key> (fuera de S). Al ser expulsado: dirty=false, S=null, err.
 * NO debe: tocar S salvo para expulsar, usar localStorage ni expulsar por un fallo de red. Gana el último que entra. */
const SES={id:Array.from(crypto.getRandomValues(new Uint8Array(8)),b=>b.toString(16).padStart(2,'0')).join(''),ok:0,at:0,out:0};
const seUrl=()=>`${DB}/juego_espacial_sesion/${key()}.json`;
async function seClaim(){SES.out=0;SES.ok=0;try{const r=await fetch(seUrl(),{method:'PUT',body:JSON.stringify({sid:SES.id,ts:Date.now()})});if(r.ok){SES.ok=1;SES.at=Date.now()}}catch(e){}}
async function seCheck(){if(!S||!code||SES.out)return !SES.out;if(!SES.ok){await seClaim();return true}
try{const r=await fetch(seUrl());if(r.ok){const d=await r.json();SES.at=Date.now();if(d&&d.sid&&d.sid!==SES.id){seKick();return false}}}catch(e){}return true}
async function seOk(){if(SES.out)return false;if(!SES.ok||document.hidden||Date.now()-SES.at<1e4)return true;return seCheck()}
function seKick(){SES.out=1;seDrop()}
function seDrop(){if(!S||!SES.out)return;if(SV){setTimeout(seDrop,300);return}dirty=false;S=null;err='Has iniciado sesión en otro dispositivo. Si quieres jugar aquí, pulsa Entrar (el otro dispositivo saldrá).';render()}
async function seBack(){if(await seCheck())checkNew()}
