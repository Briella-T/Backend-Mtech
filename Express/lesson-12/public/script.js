let currentUser = null;
        const messageArea = document.getElementById('message-area');
        const authSection = document.getElementById('auth-section');
        const dashboardSection = document.getElementById('dashboard-section');
        const userInfoDiv = document.getElementById('user-info');
        const usersDisplay = document.getElementById('users-display');

        // Forms
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        // Buttons
        const getMyInfoBtn = document.getElementById('get-my-info-btn');
        const getAllUsersBtn = document.getElementById('get-all-users-btn');
        const logoutBtn = document.getElementById('logout-btn');

        // Utility functions
        function showMessage(text, type = 'info') {
            messageArea.innerHTML = `<div class="message ${type}">${text}</div>`;
            setTimeout(() => {
                messageArea.innerHTML = '';
            }, 5000);
        }

        function showAuthSection() {
            authSection.classList.remove('hidden');
            dashboardSection.classList.add('hidden');
        }

        function showDashboard(user) {
            currentUser = user;
            authSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            userInfoDiv.innerHTML = `
                <h3>Current User</h3>
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Display Name:</strong> ${user.displayName}</p>
            `;
        }

        // API calls
        async function makeRequest(url, options = {}) {
            try {
                const response = await fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    }
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || `HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                throw error;
            }
        }

        // Event Handlers
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);

            try {
                const user = await makeRequest('/login', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                showMessage(`Welcome back, ${user.displayName}!`, 'success');
                showDashboard(user);
                loginForm.reset();
            } catch (error) {
                showMessage(`Login failed: ${error.message}`, 'error');
            }
        });

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);

            try {
                const user = await makeRequest('/register', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                showMessage(`Registration successful! Welcome, ${user.displayName}!`, 'success');
                showDashboard(user);
                registerForm.reset();
            } catch (error) {
                showMessage(`Registration failed: ${error.message}`, 'error');
            }
        });

        getMyInfoBtn.addEventListener('click', async () => {
            try {
                const user = await makeRequest('/api/me');
                showMessage('User info refreshed successfully!', 'success');
                showDashboard(user);
            } catch (error) {
                showMessage(`Error getting user info: ${error.message}`, 'error');
                if (error.message.includes('Unauthorized')) {
                    showAuthSection();
                }
            }
        });

        getAllUsersBtn.addEventListener('click', async () => {
            try {
                const users = await makeRequest('/api/users');
                usersDisplay.innerHTML = `
                    <div class="users-list">
                        <h3>All Users</h3>
                        ${users.map(user => `
                            <div class="user-item">
                                <strong>${user.displayName}</strong> (@${user.username}) - ID: ${user.id}
                            </div>
                        `).join('')}
                    </div>
                `;
                showMessage('Users loaded successfully!', 'success');
            } catch (error) {
                showMessage(`Error loading users: ${error.message}`, 'error');
                if (error.message.includes('Unauthorized')) {
                    showAuthSection();
                }
            }
        });

        logoutBtn.addEventListener('click', async () => {
            try {
                await makeRequest('/logout', { method: 'POST' });
                showMessage('Logged out successfully!', 'success');
                showAuthSection();
                currentUser = null;
                usersDisplay.innerHTML = '';
            } catch (error) {
                showMessage(`Logout error: ${error.message}`, 'error');
            }
        });

        window.addEventListener('load', async () => {
            try {
                const user = await makeRequest('/api/me');
                showDashboard(user);
                showMessage('Welcome back!', 'success');
            } catch (error) {
                showAuthSection();
            }
        });