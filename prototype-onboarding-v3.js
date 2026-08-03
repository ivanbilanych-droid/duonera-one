const welcome = document.querySelector('[data-screen="welcome"]');
const question = document.querySelector('[data-screen="question"]');
const next = document.querySelector('[data-next]');

function showQuestion(){
  welcome.classList.remove('is-active');
  question.classList.add('is-active');
  question.setAttribute('aria-hidden','false');
}

function showWelcome(){
  question.classList.remove('is-active');
  question.setAttribute('aria-hidden','true');
  welcome.classList.add('is-active');
}

document.querySelector('[data-start]').addEventListener('click',showQuestion);
document.querySelector('[data-back]').addEventListener('click',showWelcome);
document.querySelectorAll('input[name="seeking"]').forEach(input=>{
  input.addEventListener('change',()=>{ next.disabled=false; });
});
