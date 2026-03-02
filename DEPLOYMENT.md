# GitHub Pages 部署指南

## 🚀 自动部署已配置

项目已配置 GitHub Actions 自动部署到 GitHub Pages！

## 📋 启用步骤（只需操作一次）

### 方式一：通过 GitHub 网页启用

1. **打开仓库页面**
   ```
   https://github.com/longum/math-learning-app
   ```

2. **进入 Settings**
   - 点击顶部的 "Settings" 标签

3. **配置 Pages**
   - 左侧菜单找到 "Pages"
   - "Source" 选择：**GitHub Actions**
   - 点击 "Save" 保存

4. **等待自动部署**
   - 保存后，GitHub Actions 会自动运行部署流程
   - 大约 1-2 分钟后完成

5. **访问应用**
   ```
   https://longum.github.io/math-learning-app/
   ```

### 方式二：通过 GitHub CLI 启用

```bash
gh api \
  -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  repos/longum/math-learning-app/pages \
  -f build_type=legacy \
  -f 'source[branch]=master' \
  -f 'source[path]=/dist'
```

## 🔄 更新应用

每次推送到 `master` 分支会自动触发部署：

```bash
git add .
git commit -m "你的更新说明"
git push
```

GitHub Actions 会自动：
1. 安装依赖
2. 构建应用
3. 部署到 GitHub Pages

## 📊 查看部署状态

### 查看所有 workflow 运行
```bash
gh run list
```

### 查看最新部署日志
```bash
gh run view
```

### 在网页查看
```
https://github.com/longum/math-learning-app/actions
```

## 🌐 访问地址

部署成功后，应用将在以下地址可用：

**主地址**: https://longum.github.io/math-learning-app/

## 🐛 故障排除

### 部署失败

1. 检查 workflow 日志
   ```bash
   gh run view --log-failed
   ```

2. 常见问题：
   - **Pages 未启用**：按照上述步骤先启用 Pages
   - **构建错误**：检查 `npm run build` 是否本地成功
   - **权限问题**：确保仓库有 Actions 权限

### 本地测试

部署前先本地测试：
```bash
npm run build
npm run preview
```

访问 http://localhost:4173 确认应用正常

## 📝 测试账号

- **用户名**: student1
- **密码**: math123

或

- **用户名**: student2
- **密码**: learn456

## 🎉 完成！

现在你的数学学习应用已经部署到 GitHub Pages，任何人都可以通过链接访问！

---

**仓库地址**: https://github.com/longum/math-learning-app
**问题反馈**: GitHub Issues
