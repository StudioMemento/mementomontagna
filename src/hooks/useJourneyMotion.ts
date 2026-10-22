import { useEffect, type RefObject } from 'react';
export function useJourneyMotion(root:RefObject<HTMLElement|null>,season:string){
  useEffect(()=>{
    let disposed=false;let cleanup:(()=>void)|undefined;
    void(async()=>{
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      await document.fonts?.ready;
      const [{gsap},{ScrollTrigger}]=await Promise.all([import('gsap'),import('gsap/ScrollTrigger')]);
      if(disposed||!root.current)return;
      gsap.registerPlugin(ScrollTrigger);
      const context=gsap.context(()=>{
        const timeline=(selector:string)=>gsap.timeline({scrollTrigger:{trigger:selector,start:'top top',end:'bottom bottom',scrub:.7,invalidateOnRefresh:true}});
        timeline('.arrival-chapter')
          .to('.arrival-landscape',{scale:1.12,yPercent:-2,ease:'none'},0)
          .to('.arrival-title',{y:-90,opacity:0,duration:.55},.12)
          .fromTo('.arrival-whisper',{y:40,opacity:0},{y:0,opacity:1,duration:.3},.58)
          .to('.arrival-bottom',{opacity:0,duration:.2},.1);
        timeline('.chalet-chapter')
          .fromTo('.chalet-photo', {clipPath:'inset(18% 20% 8% 20%)',scale:.96},{clipPath:'inset(0% 0% 0% 0%)',scale:1,ease:'none',duration:.6},0)
          .fromTo('.chalet-intro',{y:0},{y:-65,duration:.65},0)
          .fromTo('.chalet-caption',{y:55,opacity:0},{y:0,opacity:1,duration:.3},.35)
          .fromTo('.chalet-chapter .scene-note',{opacity:0},{opacity:1,duration:.25},.5);
        timeline('.slow-chapter')
          .fromTo('.slow-photo-second',{opacity:0,scale:1.08},{opacity:1,scale:1,duration:.6,ease:'power1.inOut'},.2)
          .fromTo('.slow-copy',{y:35},{y:-40,ease:'none',duration:1},0)
          .fromTo('.slow-ritual span',{opacity:.35,y:15},{opacity:1,y:0,stagger:.18,duration:.24},.12);
        root.current!.querySelectorAll<HTMLElement>('.postcard').forEach((el,i)=>{
          gsap.fromTo(el,{y:75+i*35,rotation:i===0?-6:i===2?6:0},{y:0,rotation:i===0?-3:i===2?3:0,ease:'none',scrollTrigger:{trigger:'.postcards',start:'top 95%',end:'center 53%',scrub:.65}});
        });
        gsap.fromTo('.together-photo',{yPercent:-5,scale:1.1},{yPercent:5,scale:1.03,ease:'none',scrollTrigger:{trigger:'.together-chapter',start:'top bottom',end:'bottom top',scrub:.8}});
      },root);
      const refresh=()=>ScrollTrigger.refresh();
      root.current.querySelectorAll('img').forEach(img=>img.addEventListener('load',refresh,{once:true}));
      ScrollTrigger.refresh();
      cleanup=()=>{root.current?.querySelectorAll('img').forEach(img=>img.removeEventListener('load',refresh));context.revert();};
    })();
    return()=>{disposed=true;cleanup?.();};
  },[root,season]);
}
