// 只接受已解析为固定尺寸、来自本期核验目录 CDN 的静态封面。
export function safeArtwork(value){
  if(typeof value!=='string')return null;
  return /^https:\/\/is1-ssl\.mzstatic\.com\/image\/thumb\/[A-Za-z0-9_./-]+\/320x320bb\.jpg$/.test(value)&&!value.includes('/../')?value:null;
}
