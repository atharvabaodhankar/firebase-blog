// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBH7qpj_1Gbn4MYzT4ZJ9onJJpj2ekjer4",
    authDomain: "blog-df7d7.firebaseapp.com",
    projectId: "blog-df7d7",
    storageBucket: "blog-df7d7.firebasestorage.app",
    messagingSenderId: "686359195147",
    appId: "1:686359195147:web:fb31544c30337467eb610e",
    measurementId: "G-3Q509QEBMW"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const adminPanel = document.getElementById('adminPanel');
const blogForm = document.getElementById('blogForm');
const blogPosts = document.getElementById('blogPosts');

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
        const email = prompt('Enter admin email:');
        const password = prompt('Enter password:');
        
        auth.signInWithEmailAndPassword(email, password)
            .catch(error => alert(error.message));
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
                
                const postElement = document.createElement('div');
                postElement.className = 'blog-post';
                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <div class="date">${date.toLocaleDateString()}</div>
                    <div class="content">${post.content}</div>
                `;
                
                blogPosts.appendChild(postElement);
            });
        });
}

// Load posts when page loads
loadBlogPosts(); 