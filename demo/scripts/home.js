function updateHomePromptCount(){
  const prompt=document.getElementById('homePrompt');
  const count=document.getElementById('homePromptCount');
  if(!prompt||!count) return;
  count.textContent=`${prompt.value.length}/1000`;
}

function fillHomeExample(){
  const prompt=document.getElementById('homePrompt');
  if(!prompt) return;
  prompt.value='我想做一条老房翻新的抖音获客视频，目标是获取装修报价表单，时长15秒，面向首次装修和老房翻新用户。希望突出免费报价、透明预算、设计师上门量房，不要夸大承诺。';
  updateHomePromptCount();
}

function submitHomePrompt(btn){
  const homePrompt=document.getElementById('homePrompt');
  const createPrompt=document.querySelector('#create textarea');
  if(homePrompt&&createPrompt&&homePrompt.value.trim()){
    createPrompt.value=homePrompt.value.trim();
  }
  createProject(btn);
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
    prompt.addEventListener('input',updateHomePromptCount);
    updateHomePromptCount();
  }
  renderAuth(false);
});
