import firebaseConfig from './config.js';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const adminPanel = document.getElementById('adminPanel');
const blogForm = document.getElementById('blogForm');
const blogPosts = document.getElementById('blogPosts');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const closeModalBtn = document.querySelector('.close-modal');

// Custom cursor
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
});

// Loader animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    gsap.to(loader, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            loader.style.display = 'none';
        }
    });
});

// Dark mode toggle
const darkModeToggle = document.getElementById('darkMode');
darkModeToggle.addEventListener('change', () => {
    document.body.setAttribute('data-theme', 
        darkModeToggle.checked ? 'dark' : 'light'
    );
});

// Authentication state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Your UID:", user.uid);  // This will show the UID in browser console
        loginBtn.textContent = 'Logout';
        adminPanel.classList.remove('hidden');
    } else {
        loginBtn.textContent = 'Admin Login';
        adminPanel.classList.add('hidden');
    }
});

// Login/Logout button click handler
loginBtn.addEventListener('click', () => {
    if (auth.currentUser) {
        auth.signOut();
    } else {
        // Show login modal with animation
        loginModal.classList.add('active');
        gsap.from(loginModal.querySelector('.modal-content'), {
            y: 50,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    }
});

// Close modal when clicking close button or outside
closeModalBtn.addEventListener('click', () => {
    closeLoginModal();
});

loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        closeLoginModal();
    }
});

function closeLoginModal() {
    gsap.to(loginModal.querySelector('.modal-content'), {
        y: 20,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            loginModal.classList.remove('active');
            loginForm.reset();
            // Reset any error messages
            const errorMessage = loginForm.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    });
}

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    
    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <span class="btn-text">Logging in...</span>
        <div class="loader-dots"></div>
    `;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        closeLoginModal();
    } catch (error) {
        // Remove existing error message if any
        const existingError = loginForm.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create and show new error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = error.message;
        loginForm.appendChild(errorMessage);

        // Animate error message
        gsap.from(errorMessage, {
            y: -10,
            opacity: 0,
            duration: 0.3
        });
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <span class="btn-text">Login</span>
            <span class="btn-icon">→</span>
        `;
    }
});

// Add escape key listener to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal.classList.contains('active')) {
        closeLoginModal();
    }
});

// Blog form submit handler
blogForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    try {
        await db.collection('blogs').add({
            title,
            content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        blogForm.reset();
        alert('Blog post added successfully!');
    } catch (error) {
        alert('Error adding blog post: ' + error.message);
    }
});

// Load blog posts
function loadBlogPosts() {
    db.collection('blogs')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
            blogPosts.innerHTML = '';
            
            snapshot.forEach((doc) => {
                const post = doc.data();
                const date = post.timestamp ? post.timestamp.toDate() : new Date();
                
                const postElement = document.createElement('article');
                postElement.className = 'blog-post';
                postElement.innerHTML = `
                    <div class="post-content">
                        <h2 class="post-title">${post.title}</h2>
                        <div class="post-meta">
                            <span class="post-date">${date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                        <div class="post-body">${post.content}</div>
                    </div>
                `;
                
                blogPosts.appendChild(postElement);
            });
            
            // Call animateBlogPosts after adding new posts
            animateBlogPosts();
        });
}

// Load posts when page loads
loadBlogPosts();

// Blog post animation
function animateBlogPosts() {
    const posts = gsap.utils.toArray('.blog-post');
    posts.forEach((post, i) => {
        gsap.set(post, { opacity: 0, y: 50 }); // Set initial state
        
        gsap.to(post, {
            scrollTrigger: {
                trigger: post,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out'
        });
    });
}

// Add smooth hover effect on buttons
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(button, {
            scale: 1.05,
            duration: 0.3
        });
    });
    
    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            scale: 1,
            duration: 0.3
        });
    });
}); 