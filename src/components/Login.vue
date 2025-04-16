<template>
    <div class="login-container">
        <div class="login-box">
            <h1 class="title">医生工作站</h1>
            <div v-if="!isRegistering" class="form-container">
                <h2 class="subtitle">登录</h2>
                <div class="input-group">
                    <label>用户名</label>
                    <input v-model="username" placeholder="请输入用户名" class="input-field">
                </div>
                <div class="input-group">
                    <label>密码</label>
                    <input v-model="password" type="password" placeholder="请输入密码" class="input-field">
                </div>
                <div class="remember-me">
                    <input type="checkbox" v-model="rememberMe" id="remember">
                    <label for="remember">记住密码</label>
                </div>
                <div class="button-group">
                    <button @click="login" class="btn primary">登录</button>
                    <button @click="isRegistering = true" class="btn secondary">注册</button>
                </div>
            </div>
            <div v-else class="form-container">
                <h2 class="subtitle">注册</h2>
                <div class="input-group">
                    <label>用户名</label>
                    <input v-model="newUsername" placeholder="请输入新用户名" class="input-field">
                </div>
                <div class="input-group">
                    <label>密码</label>
                    <input v-model="newPassword" type="password" placeholder="请输入新密码" class="input-field">
                </div>
                <div class="button-group">
                    <button @click="register" class="btn primary">注册</button>
                    <button @click="isRegistering = false" class="btn secondary">返回登录</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data() {
            return {
                username: '',
                password: '',
                rememberMe: false,
                isRegistering: false,
                newUsername: '',
                newPassword: ''
            };
        },
        created() {
            const storedUsername = localStorage.getItem('username');
            const storedPassword = localStorage.getItem('password');
            if (storedUsername && storedPassword) {
                this.username = storedUsername;
                this.password = storedPassword;
                this.rememberMe = true;
            }
        },
        methods: {
            async login() {
                const apiUrl = 'http://localhost:3000/api/login';
                try {
                    const response = await axios.post(apiUrl, {
                        username: this.username,
                        password: this.password
                    });

                    if (response.data?.success) {
                        localStorage.setItem('isLoggedIn', 'true');
                        if (this.rememberMe) {
                            localStorage.setItem('username', this.username);
                            localStorage.setItem('password', this.password);
                        } else {
                            localStorage.removeItem('username');
                            localStorage.removeItem('password');
                        }
                        this.$router.push('/DoctorWorkstation');
                    } else {
                        alert('登录失败');
                    }
                } catch (error) {
                    console.error('登录错误:', error);
                    alert('登录异常');
                }
            },
            async register() {
                const apiUrl ='http://localhost:3000/api/register';
                try {
                    const response = await axios.post(apiUrl, {
                        username: this.newUsername,
                        password: this.newPassword
                    });

                    if (response.data?.success) {
                        alert('注册成功，请登录');
                        this.isRegistering = false;
                    } else {
                        alert('注册失败');
                    }
                } catch (error) {
                    console.error('注册错误:', error);
                    alert('注册异常');
                }
            }
        }
    };
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.title {
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 2rem;
}

.subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
}

.input-group {
    margin-bottom: 1rem;
}

.input-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
}

.input-field {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.input-field:focus {
    outline: none;
    border-color: #667eea;
}

.remember-me {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

.remember-me label {
    margin-left: 0.5rem;
    color: #666;
}

.button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.btn {
    flex: 1;
    padding: 0.8rem;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn.primary {
    background-color: #667eea;
    color: white;
}

.btn.primary:hover {
    background-color: #5a6fd5;
}

.btn.secondary {
    background-color: #f1f1f1;
    color: #333;
}

.btn.secondary:hover {
    background-color: #e1e1e1;
}
</style>
