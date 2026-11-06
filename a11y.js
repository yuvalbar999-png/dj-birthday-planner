/* תפריט נגישות: גודל טקסט, ניגודיות, עצירת אנימציות, הדגשת קישורים, גופן קריא. נשמר בדפדפן. */
(function(){
  const KEY="pp-a11y";
  const root=document.documentElement;
  const state=(()=>{ try{ return JSON.parse(localStorage.getItem(KEY)||"{}")||{} }catch(e){ return {} } })();
  function apply(){
    root.classList.toggle("a11y-contrast",!!state.contrast);
    root.classList.toggle("a11y-noanim",!!state.noanim);
    root.classList.toggle("a11y-links",!!state.links);
    root.classList.toggle("a11y-font",!!state.font);
    root.classList.remove("a11y-big","a11y-bigger");
    if(state.size===1) root.classList.add("a11y-big");
    if(state.size===2) root.classList.add("a11y-bigger");
    document.querySelectorAll("[data-a11y]").forEach(b=>{
      const k=b.dataset.a11y;
      const on = k==="size" ? (state.size||0)>0 : !!state[k];
      b.setAttribute("aria-pressed", on?"true":"false");
    });
  }
  function save(){ try{ localStorage.setItem(KEY,JSON.stringify(state)) }catch(e){} apply(); }
  apply();

  document.addEventListener("DOMContentLoaded",()=>{
    const base = document.body.dataset.base || "";
    const box=document.createElement("div");
    box.className="a11y";
    box.innerHTML=`
      <button type="button" class="a11y-btn" id="a11yToggle" aria-expanded="false" aria-controls="a11yPanel" aria-label="פתיחת תפריט נגישות">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>
        <span>נגישות</span>
      </button>
      <div class="a11y-panel" id="a11yPanel" role="dialog" aria-label="תפריט נגישות" hidden>
        <p class="a11y-title">תפריט נגישות</p>
        <button type="button" data-a11y="size" aria-pressed="false">הגדלת טקסט</button>
        <button type="button" data-a11y="contrast" aria-pressed="false">ניגודיות גבוהה</button>
        <button type="button" data-a11y="noanim" aria-pressed="false">עצירת אנימציות</button>
        <button type="button" data-a11y="links" aria-pressed="false">הדגשת קישורים</button>
        <button type="button" data-a11y="font" aria-pressed="false">גופן קריא</button>
        <button type="button" data-a11y="reset">איפוס</button>
        <a href="${base}accessibility/">הצהרת נגישות</a>
      </div>`;
    document.body.appendChild(box);
    const t=box.querySelector("#a11yToggle"), p=box.querySelector("#a11yPanel");
    function open(o){ p.hidden=!o; t.setAttribute("aria-expanded",o?"true":"false"); if(o) p.querySelector("button").focus(); else t.focus(); }
    t.addEventListener("click",()=>open(p.hidden));
    document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&!p.hidden) open(false); });
    document.addEventListener("click",e=>{ if(!p.hidden&&!box.contains(e.target)) { p.hidden=true; t.setAttribute("aria-expanded","false"); } });
    p.addEventListener("click",e=>{
      const b=e.target.closest("[data-a11y]"); if(!b) return;
      const k=b.dataset.a11y;
      if(k==="reset"){ for(const x of Object.keys(state)) delete state[x]; }
      else if(k==="size"){ state.size=((state.size||0)+1)%3; }
      else state[k]=!state[k];
      save();
    });
    apply();
  });
})();
