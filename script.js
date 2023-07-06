const ChatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatmeToggler = document.querySelector(".chatme-toggler");
const chatmeCloseBtn = document.querySelector(".close-btn ");

let userMessage;
const API_KEY = "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";
const inputinitHeight = ChatInput.scrollHeight;

const createChatLi = (message, className) => {
   const chatLi = document.createElement("li");
   chatLi.classList.add("chat", className);
   let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
   chatLi.innerHTML = chatContent;
   chatLi.querySelector("p").textContent = message;
   return  chatLi;
}


  const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
               method: "POST",
               headers: {
                     "Content-Type": "application/json",
                      "Authorization" :`Bearer ${API_KEY}`
               },
               body: JSON.stringify({
                
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: userMessage }]

               })
    }
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
        
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
  }

    const handleChat = () => {
     userMessage = ChatInput.value.trim();
     if(!userMessage) return;
     ChatInput.value = "";
     ChatInput.style.height = `${inputinitHeight}px`;

     chatbox.appendChild(createChatLi(userMessage, "outgoing"));
     chatbox.scrollTo(0, chatbox.scrollHeight);


     setTimeout(() => {
    const incomingChatLi = createChatLi("thinking...", "incoming")
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);


}, 600);

}

ChatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftkey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    } 


});



sendChatBtn.addEventListener("click", handleChat);
chatmeCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatme"));
chatmeToggler.addEventListener("click", () => document.body.classList.toggle("show-chatme"));
