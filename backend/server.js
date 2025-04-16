const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');


// 使用 cors 中间件
app.use(cors());

// 解析 JSON 格式的请求体
app.use(bodyParser.json());

// 数据库连接配置，需要根据你的实际情况修改
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mj',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// 测试数据库连接
pool.getConnection()
    .then(connection => {
        console.log('数据库连接成功');
        connection.release();
    })
    .catch(error => {
        console.error('数据库连接失败:', error);
    });

// 登录接口
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 查询数据库中是否存在匹配的用户
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (rows.length > 0) {
            // 登录成功
            res.json({ success: true });
        } else {
            // 登录失败
            res.json({ success: false });
        }
    } catch (error) {
        console.error('登录查询出错:', error.sqlMessage);
        res.status(500).json({ success: false, message: '服务器内部错误' });
    }
});

// 注册接口
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            res.json({ success: false, message: '用户名已存在' });
        } else {
            await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
            res.json({ success: true });
        }
    } catch (error) {
        console.error('注册插入出错:', error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

// 获取所有患者数据的接口
app.get('/api/getPatients', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM patients');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('获取患者数据出错:', error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});


// 患者信息编辑接口
app.post('/api/savePatient', async (req, res) => {
    const { id, name, age, gender, hpi, diagnosisResult } = req.body;
    try {
        // 插入患者信息到 patients 表
        await pool.execute('INSERT INTO patients (id,name, age, gender, hpi, diagnosisResult) VALUES( ?, ?, ?, ?, ?, ?)', [id,name, age, gender, hpi, diagnosisResult]);
        res.json({ success: true });
    } catch (error) {
        console.error('患者信息编辑出错:', error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});


// 新建专属的诊断信息更新接口
app.post('/api/updateDiagnosis', async (req, res) => {
    const { id, hpi, diagnosisResult } = req.body;

    try {
        console.log('接收到的参数：', { id, hpi, diagnosisResult });
        await pool.execute(`
            UPDATE patients 
            SET 
                hpi = ?,
                diagnosisResult = ?
            WHERE id = ?
        `, [hpi, diagnosisResult, id]);

        res.json({ success: true });
    } catch (error) {
        console.error('更新诊断信息出错:', error);
        res.status(500).json({
            success: false,
            message: error.sqlMessage
        });
    }
});

// 启动服务器
app.listen(port, '0.0.0.0',() => {
    console.log(`服务器运行在端口${port}`);
});

