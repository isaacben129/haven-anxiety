// GSAP Animations for Haven Anxiety Chat Interface
document.addEventListener('DOMContentLoaded', function() {
    // Set initial state - hide input area and existing messages
    gsap.set('.textbox-r, .textbox-l', {
        opacity: 0,
        y: 20,
        scale: 0.95
    });

    // Show the input area and send button
    gsap.set('.textbox-r-2, .send-button', {
        opacity: 1,
        y: 0,
        scale: 1
    });

    // Chat functionality
    const chatContainer = document.querySelector('.frame-62');
    
    // Disable scrollbars in the chat container
    chatContainer.style.overflow = 'hidden';

    // User messages for the dialogue system
    const userMessages = [
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
    const responses = [
        "I hear you. Let's take a moment to breathe together. Can you tell me what's making you feel anxious right now?",
        "That sounds really difficult. You're not alone in this. What would feel most helpful right now?",
        "I understand. Sometimes just talking about it can help. What's on your mind?",
        "It's okay to feel this way. Let's work through this together, one step at a time.",
        "I'm here for you. Would you like to try a simple breathing exercise, or would you prefer to talk about what's happening?",
        "You're doing great by reaching out. What's one small thing that might help you feel a bit calmer right now?",
        "I can feel how much you're struggling right now. That takes courage to share.",
        "Let's focus on your breathing. Can you take three slow, deep breaths with me?"
    ];

    function createMessageBubble(message, isUser = true, useTypewriter = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `frame-60 ${isUser ? 'right' : ''}`;
        
        const textboxDiv = document.createElement('div');
        textboxDiv.className = isUser ? 'textbox-r' : 'textbox-l';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'chat-text-m';
        
        // If using typewriter effect, start with empty text
        if (useTypewriter) {
            textDiv.textContent = '';
        } else {
            textDiv.textContent = message;
        }
        
        const avatarImg = document.createElement('img');
        avatarImg.src = 'images/group-17.svg';
        avatarImg.className = 'group-17';
        avatarImg.loading = 'lazy';
        avatarImg.width = '48';
        avatarImg.height = '48';
        avatarImg.alt = '';
        
        if (isUser) {
            textboxDiv.appendChild(textDiv);
            messageDiv.appendChild(textboxDiv);
            messageDiv.appendChild(avatarImg);
        } else {
            messageDiv.appendChild(avatarImg);
            textboxDiv.appendChild(textDiv);
            messageDiv.appendChild(textboxDiv);
        }
        
        // Add typewriter effect if requested
        if (useTypewriter) {
            gsap.to(textDiv, {
                text: message,
                duration: message.length * 0.03, // Speed based on message length
                ease: "none",
                delay: 0.5 // Small delay before typing starts
            });
        }
        
        return messageDiv;
    }

    function clearChatContainer() {
        // Fade out all existing messages
        const existingMessages = chatContainer.querySelectorAll('.frame-60');
        if (existingMessages.length > 0) {
            gsap.to(existingMessages, {
                opacity: 0,
                y: -20,
                scale: 0.95,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => {
                    // Remove all messages from DOM
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
            duration: 0.5,
            ease: "power2.out"
        });
    }

    function showDialogue(userMessage, aiResponse) {
        // Clear any existing messages first
        clearChatContainer();
        
        // Wait for clear animation to complete, then show new dialogue
        setTimeout(() => {
            // First, show user message in the input textbox with typewriter effect
            const inputText = document.querySelector('.text-6');
            const sendButton = document.querySelector('.send-button');
            inputText.textContent = '';
            inputText.style.color = '#464a48';
            
            // Type the user message in the input box
            gsap.to(inputText, {
                text: userMessage,
                duration: userMessage.length * 0.03,
                ease: "none",
                delay: 0.5,
                onComplete: () => {
                    // After typing is complete, animate send button click
                    animateSendButtonClick(userMessage, aiResponse);
                }
            });

        }, 600); // Wait for clear animation to complete
    }

    function animateSendButtonClick(userMessage, aiResponse) {
        const sendButton = document.querySelector('.send-button');
        
        // Animate send button click
        gsap.to(sendButton, {
            scale: 0.95,
            duration: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                // After click animation, transition the message upward
                transitionUserMessageUpward(userMessage, aiResponse);
            }
        });
    }

    function transitionUserMessageUpward(userMessage, aiResponse) {
        // Create user message bubble in chat area
        const userBubble = createMessageBubble(userMessage, true, false); // No typewriter effect since it's already typed
        chatContainer.appendChild(userBubble);
        
        // Clear the input textbox
        const inputText = document.querySelector('.text-6');
        inputText.textContent = '';
        
        // Animate the user message appearing in chat area
        animateMessageIn(userBubble);

        // Calculate delay for AI response
        const aiResponseDelay = 1000 + Math.random() * 1000; // 1-2 seconds after user message appears

        setTimeout(() => {
            // Show typing indicator first
            const typingIndicator = createMessageBubble('Haven is typing...', false, false);
            chatContainer.appendChild(typingIndicator);
            animateMessageIn(typingIndicator);

            // Show AI response after typing indicator
            setTimeout(() => {
                // Instead of replacing, update the existing typing indicator content
                const textElement = typingIndicator.querySelector('.chat-text-m');
                
                // Clear the typing text and start typing the AI response
                textElement.textContent = '';
                
                // Use typewriter effect to show AI response in the same bubble
                gsap.to(textElement, {
                    text: aiResponse,
                    duration: aiResponse.length * 0.03,
                    ease: "none"
                });

                // Calculate total time for this dialogue display
                const aiTypingTime = aiResponse.length * 0.03 * 1000;
                const displayTime = 3000; // Show completed dialogue for 3 seconds
                const totalDialogueTime = aiTypingTime + displayTime;

                // Fade out the entire dialogue after completion
                setTimeout(() => {
                    const dialogueMessages = chatContainer.querySelectorAll('.frame-60');
                    gsap.to(dialogueMessages, {
                        opacity: 0,
                        y: -20,
                        scale: 0.95,
                        duration: 0.8,
                        ease: "power2.in",
                        onComplete: () => {
                            // Remove messages from DOM
                            dialogueMessages.forEach(msg => msg.remove());
                            // Start next dialogue
                            showNextDialogue();
                        }
                    });
                }, totalDialogueTime);

            }, 1500 + Math.random() * 1000); // Typing indicator shows for 1.5-2.5 seconds

        }, aiResponseDelay);
    }

    // Dialogue system
    let currentDialogueIndex = 0;

    function showNextDialogue() {
        if (currentDialogueIndex < userMessages.length) {
            const userMessage = userMessages[currentDialogueIndex];
            const aiResponse = responses[currentDialogueIndex % responses.length];
            
            showDialogue(userMessage, aiResponse);
            currentDialogueIndex++;
        } else {
            // Reset to beginning for continuous loop
            currentDialogueIndex = 0;
            showNextDialogue();
        }
    }

    function startDialogueSystem() {
        // Start first dialogue after initial delay
        setTimeout(() => {
            showNextDialogue();
        }, 2000);
    }

    // Start the dialogue system
    startDialogueSystem();
});
