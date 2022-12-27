//explique moi ce code
import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');


let loadInterval;

function loader(element) {
  
  element.textContent = '';
  // const text = node.textContent;

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === "....") {
      element.textContent = ""
    }
  }, 300)
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  // creation du timeStamp avec la date au moment T
  const timeStamp = Date.now();
  // Méthode de génération de nombre aléatoire
  const randomNumber = Math.random();
  // generation d'une serie de 16 nombre aléatoire
  const hexadecimalString = randomNumber.toString(16);

  // retourne le résultat sous forme de chaîne de caractères
  return `id-${timeStamp}-${hexadecimalString}`
  
}

function chatStripe(isAi, value, uniqueId){
  return (
    `
      <div class="wrapper ${isAi && 'ai'}" >
        <div class = "chat" >
          <div class="profile">
            <img 
            src="${isAi ? bot : user}" 
            alt="${isAi ? bot : user}"
            />
          </div>
            <div class = "message" id = ${uniqueId}>${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  //user's chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  // bot's chatStripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  
  loader(messageDiv);
  // fetch data from server -> bot's response
  const response = await fetch('https://codexdial.netlify.app/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parsedData  = data.bot.trim();

    typeText(messageDiv, parsedData);
  }else {
    const error = await response.text();

    messageDiv.innerHTML = "Something went wrong";
    alert(error)
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})

