function updateHomePromptCount(){
  const prompt=document.getElementById('homePrompt');
  if(!prompt) return;
}

function fillHomeExample(){
  const prompt=document.getElementById('homePrompt');
  if(!prompt) return;
  prompt.value='QJ-203918';
  updateHomePromptCount();
}

function submitHomePrompt(btn){
  const homePrompt=document.getElementById('homePrompt');
  const createPrompt=document.querySelector('#create textarea');
  const value=homePrompt?.value.trim();
  const fallbackMode=value && !value.toUpperCase().startsWith('QJ-') && !/^\d+$/.test(value) ? 'demand' : 'qijia';
  const mode=btn?.dataset.homeMode||homePrompt?.dataset.homeMode||fallbackMode;
  const stop=setHomeSendLoading(btn);
  setCreateMode('selected');
  if(mode==='demand'){
    updateSelectedPlanSummary(
      value ? '营销需求匹配' : '自定义营销需求',
      value ? `AI 已根据「${value}」匹配获客方向` : 'AI 将根据营销需求匹配获客方向',
      '待按本次需求确认投放渠道'
    );
  }else{
    updateSelectedPlanSummary(
      value ? `齐家网ID：${value}` : '齐家网客户匹配',
      'AI 已根据客户资料匹配营销方向',
      '待按本次需求确认投放渠道'
    );
  }
  if(createPrompt) createPrompt.value=value||'';
  const workspaceTitle=document.querySelector('#workspace .title h1');
  if(workspaceTitle) workspaceTitle.textContent=value?'AI获客方案工作台':'齐家网·AI获客方案';
  if(typeof createProject==='function'){
    createProject();
  }else if(typeof openProjectAtStep==='function'){
    openProjectAtStep(0,workspaceTitle?.textContent||'AI获客方案工作台');
  }else if(typeof showPage==='function'){
    showPage('workspace');
  }
  if(typeof notify==='function') notify(value?'正在根据需求生成项目工作台':'正在进入项目工作台');
  setTimeout(stop,2200);
}

function setHomeSendLoading(btn){
  if(!btn) return ()=>{};
  btn.classList.add('is-loading');
  btn.disabled=true;
  return ()=>{
    btn.classList.remove('is-loading');
    btn.disabled=false;
  };
}

function searchHomeCases(btn){
  const search=document.getElementById('homeSearch');
  const homePrompt=document.getElementById('homePrompt');
  const value=search?.value.trim()||'';
  const mode=value && !value.toUpperCase().startsWith('QJ-')?'demand':'qijia';
  if(homePrompt){
    homePrompt.dataset.homeMode=mode;
    homePrompt.value=value;
    updateHomePromptCount();
  }
  submitHomePrompt(btn);
}

function initHomeSearchAndFilters(){
  const search=document.getElementById('homeSearch');
  search?.addEventListener('keydown',(event)=>{
    if(event.key!=='Enter') return;
    event.preventDefault();
    searchHomeCases();
  });
  document.querySelectorAll('.home-case-filters .filter-row').forEach((row)=>{
    row.addEventListener('click',(event)=>{
      const btn=event.target.closest('button');
      if(!btn) return;
      row.querySelectorAll('button').forEach((item)=>item.classList.toggle('active',item===btn));
    });
  });
}

function selectHomeCase(card){
  const createPrompt=document.querySelector('#create textarea');
  const name=card.dataset.caseName||card.querySelector('h3')?.textContent.trim()||'爆款营销案例';
  const desc=card.dataset.caseDesc||card.querySelector('p')?.textContent.trim()||'';
  const channel=card.dataset.caseChannel||card.querySelector('small')?.textContent.replace('投放渠道：','').trim()||'';
  setCreateMode('selected');
  updateSelectedPlanSummary(name, desc, channel);
  if(createPrompt) createPrompt.value='';
  if(typeof showPage==='function') showPage('create');
  if(typeof notify==='function') notify(`已选择「${name}」，请补充本次需求`);
}

function openCreateFromQuickTab(name){
  const createPrompt=document.querySelector('#create textarea');
  setCreateMode('selected');
  updateSelectedPlanSummary(name, '基于该获客方向补充投放目标、预算、人群和素材要求', '首页快捷入口');
  if(createPrompt) createPrompt.value='';
  if(typeof showPage==='function') showPage('create');
}

function openCreateFromScratch(){
  const createPrompt=document.querySelector('#create textarea');
  setCreateMode('scratch');
  if(createPrompt) createPrompt.value='';
  if(typeof showPage==='function') showPage('create');
}

function setCreateMode(mode){
  const layout=document.querySelector('#create .create-layout');
  const title=document.getElementById('createPageTitle');
  const subtitle=document.getElementById('createPageSubtitle');
  const briefTitle=document.getElementById('briefSectionTitle');
  const textarea=document.getElementById('briefTextarea');
  const scratch=mode==='scratch';
  layout?.classList.toggle('from-scratch',scratch);
  if(title) title.textContent=scratch?'新建广告项目':'补充投放需求';
  if(subtitle){
    subtitle.textContent=scratch
      ? '直接描述投放需求，也可以语音输入或上传资料，AI 会自动整理成项目需求单并生成策划方案。'
      : '基于已选择的营销方案或齐家网ID，补充本次投放目标、预算、人群、卖点和禁用表达，AI 会整理成项目需求单并生成策划方案。';
  }
  if(briefTitle) briefTitle.textContent=scratch?'输入投放需求':'补充本次投放需求';
  if(textarea){
    textarea.placeholder=scratch
      ? '请描述投放需求：推广产品、平台、预算、时长、人群、卖点、禁用表达、参考素材链接，或说明已有资料。'
      : '请补充本次投放需求：推广城市、预算范围、具体服务、目标人群、优惠权益、素材禁用表达、是否已有齐家网ID或历史投放数据。';
  }
}

function updateSelectedPlanSummary(name, desc, channel){
  const nameEl=document.getElementById('selectedPlanName');
  const descEl=document.getElementById('selectedPlanDesc');
  const channelEl=document.getElementById('selectedPlanChannel');
  if(nameEl) nameEl.textContent=name;
  if(descEl) descEl.textContent=desc;
  if(channelEl) channelEl.textContent=channel;
}

function handleHomeCaseKey(event, card){
  if(event.key!=='Enter'&&event.key!==' ') return;
  event.preventDefault();
  selectHomeCase(card);
}

function toggleHomeCases(btn){
  const section=document.querySelector('.home-cases');
  const hero=document.querySelector('.home-hero');
  if(!section||!btn) return;
  const collapsed=section.classList.toggle('is-collapsed');
  if(hero) hero.classList.toggle('cases-collapsed',collapsed);
  btn.textContent=collapsed?'展开':'收起';
  btn.setAttribute('aria-expanded',String(!collapsed));
}

function renderAuth(isLoggedIn){
  const auth=document.getElementById('homeAuth');
  if(!auth) return;
  auth.innerHTML=isLoggedIn
    ? '<div class="auth-user"><span class="auth-avatar">A</span><span>admin</span></div><button type="button" class="auth-logout" onclick="logoutDemoUser()">退出登录</button>'
    : '<button type="button" class="auth-login" onclick="loginDemoUser()">登录</button>';
}

function loginDemoUser(){
  renderAuth(true);
  if(typeof notify==='function') notify('已登录');
}

function logoutDemoUser(){
  renderAuth(false);
  if(typeof notify==='function') notify('已退出登录');
}

document.addEventListener('DOMContentLoaded',()=>{
  const prompt=document.getElementById('homePrompt');
  if(prompt){
    prompt.addEventListener('input',()=>{
      delete prompt.dataset.homeMode;
      updateHomePromptCount();
    });
    updateHomePromptCount();
  }
  initHomeSearchAndFilters();
  renderAuth(false);
});
