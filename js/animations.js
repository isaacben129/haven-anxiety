// GSAP Animations for Haven Anxiety Chat Interface

document.addEventListener('DOMContentLoaded', function() {
    gsap.registerPlugin(ScrollTrigger);

    // =============================
    // Reusable Dialogue System
    // =============================
    function createDialogueSystem(chatContainerSelector, textboxSelector, messages, responses, avatars) {
        const chatContainer = chatContainerSelector;
        let currentDialogueIndex = 0;

        // Utility functions
        function createMessageBubble(message, isUser = true, useTypewriter = false, avatarSrc = 'images/group-17.svg', aiSrc = 'images/group-17.svg', textboxSelector) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `frame-60 ${isUser ? 'right' : ''}`;
            
            const textboxDiv = document.createElement('div');
            textboxDiv.className = isUser ? 'textbox-r' : 'textbox-l';
            
            const textDiv = document.createElement('div');
            textDiv.className = 'chat-text-m';
            textDiv.textContent = useTypewriter ? '' : message;

            const aiimg = document.createElement('img');
            aiimg.src = aiSrc;
            aiimg.className = 'group-17';
            aiimg.width = '48'; aiimg.height = '48';
            
            const avatarImg = document.createElement('img');
            avatarImg.src = avatarSrc;
            avatarImg.className = 'group-17';
            avatarImg.width = '48'; avatarImg.height = '48';

            if (isUser) {
                textboxDiv.appendChild(textDiv);
                messageDiv.appendChild(textboxDiv);
                messageDiv.appendChild(avatarImg);
            } else {
                messageDiv.appendChild(aiimg);
                textboxDiv.appendChild(textDiv);
                messageDiv.appendChild(textboxDiv);
            }

            if (useTypewriter) {
                gsap.to(textDiv, {
                    text: message,
                    duration: message.length * 0.03,
                    ease: "none",
                    delay: 0.5
                });
            }

            return messageDiv;
        }

        function clearChatContainer() {
            const existingMessages = chatContainer.querySelectorAll('.frame-60');
            if (existingMessages.length > 0) {
                gsap.to(existingMessages, {
                    opacity: 0,
                    y: -20,
                    scale: 0.95,
                    duration: 0.8,
                    ease: "power1.inOut",
                    onComplete: () => {
                        existingMessages.forEach(msg => msg.remove());
                    }
                });
            }
        }

        function animateMessageIn(messageElement) {
            gsap.fromTo(messageElement, {
                opacity: 0,
                y: 20,
                scale: 0.95
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "power2.inOut"
            });
        }

        function showDialogue(userMessage, aiResponse, avatarIndex) {
            clearChatContainer();

            setTimeout(() => {
                const inputText = textboxSelector
                inputText.textContent = '';
                inputText.style.color = '#464a48';

                gsap.to(inputText, {
                    text: userMessage,
                    duration: userMessage.length * 0.03,
                    ease: "none",
                    delay: 0.5,
                    onComplete: () => {
                        animateSendButtonClick(userMessage, aiResponse, avatarIndex);
                    }
                });
            }, 600);
        }

        function animateSendButtonClick(userMessage, aiResponse, avatarIndex) {
            const sendButton = document.querySelector('.send-button');
            gsap.to(sendButton, {
                scale: 0.95,
                duration: 0.3,
                ease: "power2.out",
                yoyo: true,
                repeat: 1,
                color: 'blue',
                onComplete: () => {
                    transitionUserMessageUpward(userMessage, aiResponse, avatarIndex);
                }
            });
        }

        function transitionUserMessageUpward(userMessage, aiResponse, avatarIndex) {
            const userAvatar = avatars[avatarIndex];
            const aiAvatar = avatars[avatarIndex];

            const userBubble = createMessageBubble(userMessage, true, false, userAvatar);
            chatContainer.appendChild(userBubble);

            const inputText = textboxSelector
            inputText.textContent = '';

            animateMessageIn(userBubble);

            const aiResponseDelay = 800 + Math.random() * 1000;

            setTimeout(() => {
                const typingIndicator = createMessageBubble('Haven is typing...', false, false, aiAvatar);
                chatContainer.appendChild(typingIndicator);
                animateMessageIn(typingIndicator);

                setTimeout(() => {
                    const textElement = typingIndicator.querySelector('.chat-text-m');
                    textElement.textContent = '';

                    gsap.to(textElement, {
                        text: aiResponse,
                        duration: aiResponse.length * 0.03,
                        ease: "none"
                    });

                    const aiTypingTime = aiResponse.length * 0.03 * 1000;
                    const displayTime = 3000;
                    const totalDialogueTime = aiTypingTime + displayTime;

                    setTimeout(() => {
                        const dialogueMessages = chatContainer.querySelectorAll('.frame-60');
                        gsap.to(dialogueMessages, {
                            opacity: 0,
                            scale: 0.95,
                            duration: 0.6,
                            ease: "power2.in",
                            onComplete: () => {
                                dialogueMessages.forEach(msg => msg.remove());
                                showNextDialogue();
                            }
                        });
                    }, totalDialogueTime);

                }, 1500 + Math.random() * 1000);

            }, aiResponseDelay);
        }

        function showNextDialogue() {
            if (currentDialogueIndex < messages.length) {
                const userMessage = messages[currentDialogueIndex];
                const aiResponse = responses[currentDialogueIndex % responses.length];
                const avatarIndex = currentDialogueIndex % avatars.length;
                showDialogue(userMessage, aiResponse, avatarIndex);
                currentDialogueIndex++;
            } else {
                currentDialogueIndex = 0;
                showNextDialogue();
            }
        }

        function start() {
            setTimeout(() => {
                showNextDialogue();
            }, 1500);
        }

        return { start };
    }

    // =============================
    // Example Usage
    // =============================

    gsap.set('.textbox-r, .textbox-l', {
        opacity: 0,
        y: 20,
        scale: 0.95
    });

    // Show the input area and send button
    gsap.set('.textbox-r-2, .textbox-chat, .send-button', {
        opacity: 1,
        y: 0,
        scale: 1
    });

    // Section 1
    const chatContainer = document.querySelector('.frame-62');
    
    // Disable scrollbars in the chat container
    chatContainer.style.overflow = 'hidden';

    // User messages for the dialogue system
    const anxietyMsgs = [
        "I feel kind of anxious right now.",
        "I can't stop worrying about everything.",
        "My heart is racing and I can't calm down.",
        "I feel like I'm spiraling out of control.",
        "I'm having trouble sleeping because of my anxiety.",
        "I feel overwhelmed by everything happening in my life.",
        "I'm scared I'm going to have a panic attack.",
        "I feel like I'm alone in this struggle."
    ];

    // AI responses for the dialogue system
    const anxietyRes = [
        "I hear you. Let's take a moment to breathe together. Can you tell me what's making you feel anxious right now?",
        "That sounds really difficult. You're not alone in this. What would feel most helpful right now?",
        "I understand. Sometimes just talking about it can help. What's on your mind?",
        "It's okay to feel this way. Let's work through this together, one step at a time.",
        "I'm here for you. Would you like to try a simple breathing exercise, or would you prefer to talk about what's happening?",
        "You're doing great by reaching out. What's one small thing that might help you feel a bit calmer right now?",
        "I can feel how much you're struggling right now. That takes courage to share.",
        "Let's focus on your breathing. Can you take three slow, deep breaths with me?"
    ];

    // Different avatar images for each dialogue
    const anxietyAvatars = [
        'images/Frame 18.webp',  // Default avatar (green circle with person)
        'images/Frame 19.webp',   // Different avatar (complex design)
        'images/Frame 20.webp',   // Different avatar
        'images/Frame 21.webp',   // Different avatar
        'images/Frame 22.webp',   // Different avatar
        'images/Frame 23.webp',   // Different avatar
        'images/Frame 20.webp',   // Different avatar
        'images/Frame 18.webp',   // Different avatar
    ];

    const anxietyText = document.querySelector('.text-6');

    const anxietyChat = createDialogueSystem(chatContainer, anxietyText, anxietyMsgs, anxietyRes, anxietyAvatars);

    // Section 2
    const motivationMsgs = [
        "I feel like giving up.",
        "Nothing seems to work out."
    ];
    const motivationRes = [
        "Progress takes time, you’re stronger than you think.",
        "Let’s break it into small steps together."
    ];
    const motivationAvatars = ["images/Frame 22.webp", "images/Frame 23.webp"];

    const featureContainer = document.querySelector('.feature-chat')

    const motivationText = document.querySelector('.feature-textbox');    

    const motivationChat = createDialogueSystem(featureContainer, motivationText, motivationMsgs, motivationRes, motivationAvatars);

    // Trigger them via ScrollTrigger
    /*ScrollTrigger.create({
        trigger: ".frame-62",
        start: "top center",
        once: true,
        onEnter: () => anxietyChat.start()
    });*/
    featureContainer.style.overflow = 'hidden';

    ScrollTrigger.create({
        trigger: ".frame-62",
        start: "top center",
        once: true,
        onEnter: () => anxietyChat.start()
    });

    ScrollTrigger.create({
        trigger: ".feature-chat",
        start: "top center",
        once: true,
        onEnter: () => motivationChat.start()
    });

});
