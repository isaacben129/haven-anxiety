document.addEventListener('DOMContentLoaded', function() {
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(SplitText);

    // About section text animation with scroll trigger
    function setupAboutTextAnimation() {
        const aboutH1 = document.querySelector('.about-h1');
        const aboutSection = document.querySelector('.about-section');
        
        
        if (aboutH1 && aboutSection) {
            // Check if screen width is above 767px
            function isAbove767px() {
                return window.innerWidth > 767;
            }
            
            // Store the original text
            const originalText = aboutH1.textContent;
            
            // Only apply animation on screens above 767px
            if (isAbove767px()) {
                // Split text into words and create spans for each word
                // const words = originalText.split(' ');
                // aboutH1.innerHTML = '';
                
                /* Create spans for each word with initial state
                words.forEach((word, index) => {
                    const wordSpan = document.createElement('span');
                    wordSpan.textContent = word + (index < words.length - 1 ? ' ' : '');
                    wordSpan.style.display = 'inline-block';
                    wordSpan.style.opacity = '0';
                    wordSpan.style.transform = 'translateY(-50px)';
                    aboutH1.appendChild(wordSpan);
                });*/
                
                // Create scroll-triggered animation
                gsap.set(".text-wrapper", {
                    opacity: 0,
                    y: 20,
                });
                gsap.set(".about-h1", {
                    opacity: 0,
                });
                tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: "top 20%", // Start when bottom of hero section is 80% down the viewport
                        end: "bottom top",   // End when bottom of hero section is 20% down the viewport
                        toggleActions: "play none reverse reset",
                        once: true,
                        onLeaveBack: () => {
                          gsap.to(".about-h1", { opacity: 0 });
                          gsap.to(".text-wrapper", { opacity: 0, y: 100 });
                        },
                        onEnter: () => {
                            SplitText.create(".about-h1", {
                                type: "lines, words",
                                // mask: "lines",
                                autoSplit: true,
                                onSplit(self) {
                                    // runs every time it splits
                                  gsap.to(".about-h1", {
                                    opacity: 1,
                                  });
                                  gsap.from(self.words, {
                                    duration: 1,
                                    y: 0, 
                                    autoAlpha: 0, 
                                    stagger: 0.15
                                  });
                                },
                                onLeaveBack(self) {
                                    gsap.to(".about-h1", {
                                        opacity: 0,
                                    });
                                    self.revert()
                                }
                            });
                            
                            
                        },
                        
                    }
                });
                t1 = gsap.to(
                    ".text-wrapper",
                    {
                        y: 0,
                        opacity:0,
                        delay: 3,
                    }
                )
                t2 = gsap.to(
                    ".text-wrapper",
                    {
                        opacity: 1,
                        y: 0,
                        duration: 4,
                        ease: "power4.inOut",
                        delay: 1
                    }
                    
                );
                // tl.add(t1)
                tl.add(t2)
                tl

            } else {
                // On mobile (767px and below), just set the text normally
                aboutH1.textContent = originalText;
                gsap.set(".text-wrapper", {
                    opacity: 1,
                    y: 0,
                    delay: 2,
                });
                gsap.set(".about-h1", {
                    opacity: 1,
                });
            }
            
            // Handle window resize
            window.addEventListener('resize', () => {
                // Refresh ScrollTrigger on resize
                ScrollTrigger.refresh();
            });
        }
    }

    // Setup the scroll-triggered animation
    setupAboutTextAnimation();
});