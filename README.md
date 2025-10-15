# manage
一个基于 Vue3 + Node.js + MySQL 的全栈应用。
### 前端
- Vue 3 - 构建用户界面的渐进式框架
- Vue Router - 路由管理
- Pinia - 状态管理
- Axios - HTTP客户端
- [其他前端依赖，Element Plus、Tailwind CSS、富文本编辑器]

### 后端
- Node.js
- Express - Web框架
- JWT - 身份验证
- [前端有良好的ts支持，后端可以用ts]

### 数据库
- MySQL - 关系型数据库

### 开发工具
- Vite - 前端构建工具
- Nodemon - 后端热重载工具
- ESLint - 代码检查工具
- Prettier - 代码格式化工具

## 本地部署

### 前置条件
确保你的开发环境安装了以下工具：
- Node.js v20+
- MySQL 8.0+
- Git
- npm 或 pnpm

### 步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/[你的用户名]/[你的仓库名].git
   cd [你的仓库名]
   ```
   
2. **数据库配置**
   导入sql文件，在后端db.js中修改用户名和密码
   
4. **后端启动**
   ```
   npm install
   nodemon app
   ```
5. **前端**
   ```
   npm run dev
   ```
