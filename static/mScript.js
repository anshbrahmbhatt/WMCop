const typingForm = document.querySelector(".typing-form");
const chatContainer = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion");
const toggleThemeButton = document.querySelector("#theme-toggle-button");
const deleteChatButton = document.querySelector("#delete-chat-button");
const avatarContainer = document.querySelector('.chat-container');

var personality = 'Franklin';
// Function to create a new message element
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
}

// Function to show typing effect
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
  const words = text.split(' ');
  let currentWordIndex = 0;
  const typingInterval = setInterval(() => {
    // Append each word to the text element with a space
    textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
    incomingMessageDiv.querySelector(".icon").classList.add("hide");
    // If all words are displayed
    if (currentWordIndex === words.length) {
      clearInterval(typingInterval);
      isResponseGenerating = false;
      incomingMessageDiv.querySelector(".icon").classList.remove("hide");
      localStorage.setItem("saved-chats", chatContainer.innerHTML); // Save chats to local storage
    }
    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
  }, 75);
}

let avatarUrl1 = avatarContainer.dataset.avatarUrl1;

// Function to send data to the server and handle the response
function sendData() {
  const userInput = document.getElementById('user-input').value;
  const avatarUrl = document.querySelector('.chat-container').dataset.avatarUrl; // Get avatar URL from data attribute
  const userAvatarUrl = document.querySelector('.chat-container').dataset.userAvatarUrl; // Get user avatar URL from data attribute

  if (userInput === '') {
    alert("Type something");
    return;
  }
  // Add user input to the chat container
  const userMessageHtml = `<div class="message-content">
                             <img class="avatar" src="${userAvatarUrl}" alt="User avatar">
                             <p class="text">${userInput}</p>
                           </div>
                           <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;
  const userMessageDiv = createMessageElement(userMessageHtml, "outgoing");
  chatContainer.appendChild(userMessageDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom

  // Add loading message for incoming response
  const incomingMessageHtml = `<div class="message-content">
                                 <img class="avatar" src="${avatarUrl1}" alt="Gemini avatar">
                                 <p class="text"></p>
                                 <div class="loading-indicator">
                                   <div class="loading-bar"></div>
                                   <div class="loading-bar"></div>
                                   <div class="loading-bar"></div>
                                 </div>
                               </div>
                               <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;
  const incomingMessageDiv = createMessageElement(incomingMessageHtml, "incoming", "loading");
  chatContainer.appendChild(incomingMessageDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom

  hideHeader(); // Hide the header when the chat starts

  axios.post('/submit', { input: userInput, personality: personality })
    .then(response => {
      const apiResponse = response.data.message;
      console.log(apiResponse);
      showTypingEffect(apiResponse, incomingMessageDiv.querySelector(".text"), incomingMessageDiv); // Show typing effect
    })
    .catch(error => {
      console.error('Error:', error);
      incomingMessageDiv.querySelector(".text").innerText = error.message;
      incomingMessageDiv.classList.add("error");
    })
    .finally(() => {
      incomingMessageDiv.classList.remove("loading");
    });

  document.getElementById('user-input').value = '';
}

// Function to hide the header
const hideHeader = () => {
  const header = document.querySelector(".header");
  if (header) {
    header.style.display = "none";
  }
}

const showHeader = () => {
  const header = document.querySelector(".header");
  if (header) {
    header.style.display = "block"; // Use "block" or another appropriate display value
  }
}

// Handle Enter key press for sending messages
function handleKeypress(event) {
  if (event.key == 'Enter') {
    const personality = "some_personality"; // Replace this with the actual personality value you want to use
    sendData(personality);
  }
}

// Event listener for Enter key press to send message
document.addEventListener("keypress", function (e) {
  const userInput = document.getElementById('user-input').value;

  if (e.key === "Enter" && userInput != "") {
    e.preventDefault();
    document.getElementById("send-message-button").click();
  }
});

const copyMessage = (copyButton) => {
  const messageText = copyButton.parentElement.querySelector(".text").innerText;
  navigator.clipboard.writeText(messageText);
  copyButton.innerText = "done"; // Show confirmation icon
  setTimeout(() => copyButton.innerText = "content_copy", 1000); // Revert icon after 1 second
}


/// Function to be called when an image is clicked
function handleImageClick(event) {
  const clickedImageId = event.target.id;

  if (clickedImageId === 'set-michael') {
    if (personality === 'Michael') {
      alert('Already selected')
    }
    else {
      alert('Selected Michael');
      personality = 'Michael';
      clearDiv();
      avatarUrl1 = avatarContainer.dataset.avatarUrl2;

      document.querySelector('h1').innerText = "Yo, you're chatting with Michael, the legend"
      document.getElementById('s1').innerHTML = "Yo, Michael, can you lend me some money? Don't worry, I will give it back.";
      document.getElementById('s2').innerHTML = "Michael, how have you been? I heard you moved into a new place.";
      document.getElementById('s3').innerHTML = "Michael, do you think I should pursue my dream or should I focus on college?";
      
      showHeader();
    }
    
    // document.getElementById('s4').innerHTML = "Hey mate, how was your day? Can we meet today?";
  } else if (clickedImageId === 'set-trevor') {
    if (personality === 'Trevor') {
      alert('Already selected');
    }
    else {
      alert('Selected Trevor');
      personality = 'Trevor';
      clearDiv();
      avatarUrl1 = avatarContainer.dataset.avatarUrl3;

      document.querySelector('h1').innerText = "Yo, you're chatting with Trevor. What can i do for you?"
      document.getElementById('s1').innerHTML = "Yo, Trevor, can you lend me some money. Don't worry I will give it back";
      document.getElementById('s2').innerHTML = "Trevor, how have you been? I heard you moved into a new place.";
      document.getElementById('s3').innerHTML = "Trevor, do you think I should pursue my dream or should I focus on college?";
      
      showHeader();
    }

  }
  else if (clickedImageId === 'set-franklin') {
    if (personality !== 'Franklin') {
      refreshPage();
    }
    else {
      alert("Already selected")
    }
  }
  
  
}

// Select the image elements
const imageOfMichael = document.getElementById('set-michael');
const imageOfTrevor = document.getElementById('set-trevor');
const imageOfFranklin = document.getElementById('set-franklin');

// Add event listeners for the 'click' event
if (imageOfMichael) {
  imageOfMichael.addEventListener('click', handleImageClick);
}

if (imageOfTrevor) {
  imageOfTrevor.addEventListener('click', handleImageClick);
}

if (imageOfFranklin) {
  imageOfFranklin.addEventListener('click', handleImageClick);
}

const clearDiv = () => {
  const div = document.querySelector('.chat-list'); // Use your specific class or ID
  if (div) {
    div.innerHTML = ''; // Removes all child elements
  }
}

const refreshPage = () => {
  location.reload();
}



suggestions.forEach(suggestion => {
  suggestion.addEventListener("click", () => {
    const userInput = suggestion.querySelector(".text").innerText;
    const userAvatarUrl = document.querySelector('.chat-container').dataset.userAvatarUrl; // Get user avatar URL from data attribute

  // Add user input to the chat container
  const userMessageHtml = `<div class="message-content">
                             <img class="avatar" src="${userAvatarUrl}" alt="User avatar">
                             <p class="text">${userInput}</p>
                           </div>
                           <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;
  const userMessageDiv = createMessageElement(userMessageHtml, "outgoing");
  chatContainer.appendChild(userMessageDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom

  // Add loading message for incoming response
  const incomingMessageHtml = `<div class="message-content">
                                 <img class="avatar" src="${avatarUrl1}" alt="Gemini avatar">
                                 <p class="text"></p>
                                 <div class="loading-indicator">
                                   <div class="loading-bar"></div>
                                   <div class="loading-bar"></div>
                                   <div class="loading-bar"></div>
                                 </div>
                               </div>
                               <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;
  const incomingMessageDiv = createMessageElement(incomingMessageHtml, "incoming", "loading");
  chatContainer.appendChild(incomingMessageDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom

  hideHeader(); // Hide the header when the chat starts

  axios.post('/submit', { input: userInput, personality: personality })
    .then(response => {
      const apiResponse = response.data.message;
      console.log(apiResponse);
      showTypingEffect(apiResponse, incomingMessageDiv.querySelector(".text"), incomingMessageDiv); // Show typing effect
    })
    .catch(error => {
      console.error('Error:', error);
      incomingMessageDiv.querySelector(".text").innerText = error.message;
      incomingMessageDiv.classList.add("error");
    })
    .finally(() => {
      incomingMessageDiv.classList.remove("loading");
    });

  document.getElementById('user-input').value = '';
    
  });
});