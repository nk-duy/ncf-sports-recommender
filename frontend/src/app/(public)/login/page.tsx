'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    full_name: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Login API calls expect application/x-www-form-urlencoded
        const formDataParams = new URLSearchParams();
        formDataParams.append('username', formData.username);
        formDataParams.append('password', formData.password);

        const res = await fetch('http://localhost:8000/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formDataParams,
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('token', data.access_token);
          router.push('/');
        } else {
          const errData = await res.json();
          setError(errData.detail || 'Login failed');
        }
      } else {
        // Register API
        const res = await fetch('http://localhost:8000/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name
          }),
        });

        if (res.ok) {
          setIsLogin(true);
          setError('Đăng ký thành công! Hãy đăng nhập.');
        } else {
          const errData = await res.json();
          setError(errData.detail || 'Registration failed');
        }
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.glassCard}>
        <h2 className={styles.title}>{isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}</h2>
        
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Tên đăng nhập</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          {!isLogin && (
            <>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Họ và Tên</label>
                <input 
                  type="text" 
                  name="full_name" 
                  value={formData.full_name} 
                  onChange={handleChange} 
                />
              </div>
            </>
          )}

          <div className={styles.inputGroup}>
            <label>Mật khẩu</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            {isLogin ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ'}
          </button>
        </form>

        <p className={styles.toggleText}>
          {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
          <span onClick={() => setIsLogin(!isLogin)} className={styles.toggleLink}>
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </span>
        </p>
      </div>
    </div>
  );
}
