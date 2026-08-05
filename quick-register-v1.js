const form = document.querySelector('.quick-form');
const intro = document.querySelector('.intro');
const success = document.querySelector('.success');

function clearValidation(){
  form.querySelectorAll('.invalid').forEach(element => element.classList.remove('invalid'));
}

form.addEventListener('submit', event => {
  event.preventDefault();
  clearValidation();

  const invalid = [...form.elements].filter(element => !element.checkValidity());
  if(invalid.length){
    invalid.forEach(element => {
      if(element.name === 'looking_for') element.closest('.seeking').classList.add('invalid');
      else element.classList.add('invalid');
    });
    invalid[0].focus();
    return;
  }

  const name = form.elements.first_name.value.trim();
  document.querySelector('[data-success-name]').textContent = name;
  intro.hidden = true;
  form.hidden = true;
  success.hidden = false;
  window.scrollTo({top:0,behavior:'smooth'});
});

form.addEventListener('input', event => {
  event.target.classList.remove('invalid');
  if(event.target.name === 'looking_for') event.target.closest('.seeking').classList.remove('invalid');
});
