# 🚂 Railway 部署指南

## ✅ 已完成

1. **GitHub Repo 創建成功**
   - URL: https://github.com/marcozku/nova-jarvis
   - 所有代碼已推送
   - Railway 配置文件已添加：
     - `nixpacks.toml` - 構建配置
     - `railway.json` - 部署配置

## 🎯 Railway 部署步驟（需要手動完成）

### 方法 1: Railway Web Dashboard（推薦）

1. **訪問 Railway**
   - 打開：https://railway.app/
   - 登入你的帳號

2. **創建新項目**
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub repo"
   - 選擇 `marcozku/nova-jarvis`

3. **配置部署**
   - Railway 會自動檢測到 `nixpacks.toml` 和 `railway.json`
   - 確認構建命令：`npm run build`
   - 確認啟動命令：`npm run preview`

4. **生成域名**
   - 在 Settings → Networking
   - 點擊 "Generate Domain"
   - 獲得類似：`nova-jarvis-production.up.railway.app`

5. **部署**
   - 點擊 "Deploy"
   - 等待構建完成（約 2-3 分鐘）

### 方法 2: Railway CLI（需要互動式登入）

```bash
cd /Users/myclawbot/.openclaw/workspace/nova-jarvis

# 登入 Railway（會打開瀏覽器）
railway login

# 初始化項目
railway init

# 連接到 GitHub repo
railway link

# 部署
railway up
```

## 📋 部署檢查清單

- [x] GitHub repo 創建
- [x] 代碼推送到 GitHub
- [x] Railway 配置文件創建
- [ ] Railway 項目創建
- [ ] 部署成功
- [ ] 獲得 public URL
- [ ] 測試訪問

## 🔧 配置文件說明

### nixpacks.toml
```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm run preview -- --host 0.0.0.0 --port $PORT"
```

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run preview",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 🎨 項目特點

- **3D 可視化**：Three.js + React Three Fiber
- **即時數據**：連接 MEMORY.md
- **響應式設計**：支持手機和桌面
- **自動刷新**：每 30 秒更新一次

## 📱 部署後測試

1. 訪問生成的 Railway URL
2. 檢查 3D 場景是否正常渲染
3. 測試節點點擊交互
4. 驗證手機端響應式布局

## 🐛 常見問題

**Q: 部署失敗？**
- 檢查 Railway 日誌
- 確認 Node.js 版本（需要 20+）
- 驗證 build 命令成功

**Q: 頁面空白？**
- 檢查瀏覽器控制台錯誤
- 確認 API 端點 `/api/memory` 可訪問
- 驗證 Three.js 資源加載

**Q: 手機顯示異常？**
- 清除瀏覽器緩存
- 檢查 viewport meta 標籤
- 測試不同瀏覽器

## 📞 支持

如有問題，檢查：
- Railway 部署日誌
- GitHub Actions（如果配置了 CI/CD）
- 本地 `npm run build` 是否成功

---

**下一步：** 使用 Railway Web Dashboard 完成部署！
