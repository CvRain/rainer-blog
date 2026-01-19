# Theme/Chapter/Article 封面图片管理 API 文档

## 📋 概述

你的项目已经实现了完整的封面图片管理系统！通过 **Cover** 模型，可以为 Theme、Chapter 和 Article 设置封面图片。

### 🎯 核心功能

- ✅ 为 Theme、Chapter、Article 设置/更新封面
- ✅ 上传图片并自动设置为封面
- ✅ 获取封面的预签名URL
- ✅ 批量获取封面信息
- ✅ 删除封面

### 💾 数据存储方式

封面图片存储在 **S3对象存储** 中，通过 `Cover` 模型关联：
```
Cover (封面记录)
  ├── owner_type: "theme" | "chapter" | "article"
  ├── owner_id: 对应的 UUID
  └── resource_id: 指向 Resource (S3文件记录)
```

---

## 🚀 API 接口说明

### 1. 上传图片并设置为封面 ⭐ (推荐)

**最简单的方式**：一次请求完成上传和设置封面。

#### 请求信息
```
POST /api/cover/upload_set
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### 参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `file` | File | ✅ | 图片文件 |
| `owner_type` | string | ✅ | 类型：`theme`、`chapter`、`article` |
| `owner_id` | string | ✅ | 对应的UUID |
| `name` | string | ❌ | 资源名称（默认为文件名） |
| `description` | string | ❌ | 描述信息 |
| `collection_id` | string | ❌ | 所属收藏集ID |

---

## 💻 前端请求示例

### 方式1️⃣：使用 FormData (推荐)

```javascript
// JavaScript/React 示例
async function uploadCoverImage(file, ownerType, ownerId) {
  const formData = new FormData();
  
  // 添加文件（Blob对象）
  formData.append('file', file);
  
  // 添加其他参数
  formData.append('owner_type', ownerType);  // 'theme', 'chapter', 或 'article'
  formData.append('owner_id', ownerId);       // UUID
  
  // 可选参数
  formData.append('name', file.name);
  formData.append('description', '封面图片');
  
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:4000/api/cover/upload_set', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // 注意：不要设置 Content-Type，让浏览器自动设置
      },
      body: formData
    });
    
    const result = await response.json();
    console.log('上传成功:', result);
    return result;
  } catch (error) {
    console.error('上传失败:', error);
    throw error;
  }
}

// 使用示例
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    await uploadCoverImage(file, 'theme', 'theme-uuid-here');
  }
});
```

### 方式2️⃣：使用 Axios

```javascript
import axios from 'axios';

async function uploadThemeCover(file, themeId) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('owner_type', 'theme');
  formData.append('owner_id', themeId);
  formData.append('name', file.name);
  
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.post(
      'http://localhost:4000/api/cover/upload_set',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Axios 会自动设置 Content-Type: multipart/form-data
        }
      }
    );
    
    console.log('上传成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('上传失败:', error.response?.data);
    throw error;
  }
}
```

---

## 📱 React 完整示例组件

### 封面上传组件

```jsx
import React, { useState } from 'react';
import axios from 'axios';

function CoverUploader({ ownerType, ownerId, currentCoverUrl, onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentCoverUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // 文件选择处理
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('请选择有效的图片文件 (JPG, PNG, GIF, WebP)');
      return;
    }

    // 验证文件大小 (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过5MB');
      return;
    }

    setFile(selectedFile);
    setError('');

    // 生成预览
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  // 上传封面
  const handleUpload = async () => {
    if (!file) {
      setError('请先选择图片');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('owner_type', ownerType);
    formData.append('owner_id', ownerId);
    formData.append('name', `${ownerType}-cover-${Date.now()}`);
    formData.append('description', `${ownerType} 封面图片`);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:4000/api/cover/upload_set',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.code === 201) {
        alert('封面上传成功！');
        onSuccess?.(response.data.data);
        setFile(null);
      } else {
        setError(response.data.message || '上传失败');
      }
    } catch (err) {
      setError(err.response?.data?.message || '上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="cover-uploader">
      <h3>上传封面图片</h3>
      
      {/* 预览区域 */}
      <div className="preview-area">
        {preview ? (
          <img src={preview} alt="封面预览" style={{ maxWidth: '300px' }} />
        ) : (
          <div className="placeholder">暂无封面</div>
        )}
      </div>

      {/* 文件选择 */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {/* 上传按钮 */}
      <button 
        onClick={handleUpload} 
        disabled={!file || uploading}
      >
        {uploading ? '上传中...' : '上传封面'}
      </button>

      {/* 错误信息 */}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

// 使用示例
function ThemeEditPage({ themeId }) {
  const handleCoverSuccess = (data) => {
    console.log('封面设置成功:', data);
    // 刷新页面或更新状态
  };

  return (
    <div>
      <h2>编辑主题</h2>
      <CoverUploader
        ownerType="theme"
        ownerId={themeId}
        currentCoverUrl={null}
        onSuccess={handleCoverSuccess}
      />
    </div>
  );
}

export default CoverUploader;
```

---

## 🔍 获取封面图片

### 1. 获取单个封面信息

```javascript
// 获取 Theme 的封面
async function getThemeCover(themeId) {
  try {
    const response = await axios.get(
      `http://localhost:4000/api/cover/theme/${themeId}`
    );
    
    if (response.data.code === 200) {
      const coverInfo = response.data.data;
      // coverInfo 包含：owner_type, owner_id, resource, url
      console.log('封面URL:', coverInfo.url);
      return coverInfo;
    }
  } catch (error) {
    console.error('获取封面失败:', error);
    return null;
  }
}

// 获取 Chapter 的封面
async function getChapterCover(chapterId) {
  const response = await axios.get(
    `http://localhost:4000/api/cover/chapter/${chapterId}`
  );
  return response.data;
}

// 获取 Article 的封面
async function getArticleCover(articleId) {
  const response = await axios.get(
    `http://localhost:4000/api/cover/article/${articleId}`
  );
  return response.data;
}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "ok",
  "data": {
    "owner_type": "theme",
    "owner_id": "uuid-here",
    "resource": {
      "id": "resource-uuid",
      "name": "theme-cover.jpg",
      "file_type": "image/jpeg",
      "file_size": 102400,
      "aws_key": "resources/xxx.jpg"
    },
    "url": "https://s3.amazonaws.com/bucket/resources/xxx.jpg?signature=..."
  }
}
```

### 2. 获取封面URL（快速方式）

```javascript
// 只获取预签名URL
async function getCoverUrl(ownerType, ownerId) {
  const response = await axios.get(
    `http://localhost:4000/api/cover/url`,
    {
      params: {
        owner_type: ownerType,
        owner_id: ownerId
      }
    }
  );
  
  if (response.data.code === 200) {
    return response.data.data.url;
  }
  return null;
}

// 使用
const themeUrl = await getCoverUrl('theme', 'theme-uuid');
const chapterUrl = await getCoverUrl('chapter', 'chapter-uuid');
const articleUrl = await getCoverUrl('article', 'article-uuid');
```

### 3. 批量获取封面

```javascript
// 获取 Theme 下所有 Chapter 的封面
async function getThemeChapterCovers(themeId) {
  const response = await axios.get(
    `http://localhost:4000/api/cover/theme/${themeId}/chapters`
  );
  return response.data.data; // 返回 chapters 列表，每个包含封面信息
}

// 获取 Chapter 下所有 Article 的封面
async function getChapterArticleCovers(chapterId) {
  const response = await axios.get(
    `http://localhost:4000/api/cover/chapter/${chapterId}/articles`
  );
  return response.data.data;
}

// 分页获取所有 Article 的封面
async function getAllArticleCovers(page = 1, pageSize = 10) {
  const response = await axios.get(
    `http://localhost:4000/api/cover/articles`,
    {
      params: { page, page_size: pageSize }
    }
  );
  return response.data.data;
}
```

---

## 🔄 更新封面

### 方式1：重新上传（推荐）

直接使用 `upload_set` 接口重新上传，会自动覆盖旧封面。

```javascript
async function updateCover(file, ownerType, ownerId) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('owner_type', ownerType);
  formData.append('owner_id', ownerId);
  
  const token = localStorage.getItem('token');
  
  const response = await axios.post(
    'http://localhost:4000/api/cover/upload_set',
    formData,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  return response.data;
}
```

### 方式2：使用已有资源

如果已经上传了资源文件，可以直接设置为封面：

```javascript
async function setCoverFromResource(ownerType, ownerId, resourceId) {
  const token = localStorage.getItem('token');
  
  const response = await axios.post(
    'http://localhost:4000/api/cover/set',
    {
      owner_type: ownerType,
      owner_id: ownerId,
      resource_id: resourceId
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data;
}
```

---

## 🗑️ 删除封面

```javascript
async function deleteCover(ownerType, ownerId) {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.delete(
      'http://localhost:4000/api/cover/',
      {
        params: {
          owner_type: ownerType,
          owner_id: ownerId
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (response.data.code === 200) {
      console.log('封面删除成功');
      return true;
    }
  } catch (error) {
    console.error('删除失败:', error);
    return false;
  }
}
```

---

## 📊 完整的 Theme/Chapter/Article 编辑示例

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EntityEditor({ type, id }) {
  // type: 'theme', 'chapter', 或 'article'
  const [coverUrl, setCoverUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // 加载现有封面
  useEffect(() => {
    loadCover();
  }, [id]);

  const loadCover = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/cover/${type}/${id}`
      );
      
      if (response.data.code === 200) {
        setCoverUrl(response.data.data.url);
      }
    } catch (error) {
      console.log('暂无封面');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('owner_type', type);
    formData.append('owner_id', id);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:4000/api/cover/upload_set',
        formData,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.code === 201) {
        alert('封面更新成功！');
        loadCover(); // 重新加载封面
      }
    } catch (error) {
      alert('上传失败: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除封面吗？')) return;

    const token = localStorage.getItem('token');

    try {
      await axios.delete(
        'http://localhost:4000/api/cover/',
        {
          params: { owner_type: type, owner_id: id },
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      alert('封面已删除');
      setCoverUrl('');
    } catch (error) {
      alert('删除失败: ' + error.message);
    }
  };

  return (
    <div className="entity-editor">
      <h3>{type.charAt(0).toUpperCase() + type.slice(1)} 封面管理</h3>
      
      {/* 显示当前封面 */}
      {coverUrl && (
        <div className="current-cover">
          <img src={coverUrl} alt="当前封面" style={{ maxWidth: '400px' }} />
          <button onClick={handleDelete}>删除封面</button>
        </div>
      )}

      {/* 上传新封面 */}
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
        />
        {uploading && <span>上传中...</span>}
      </div>
    </div>
  );
}

export default EntityEditor;
```

---

## ⚠️ 重要说明

### 发送的数据格式

**问：前端需要发送 Blob、二进制流还是什么？**

**答：使用 `FormData` 发送 Blob 对象（File 是 Blob 的子类）**

```javascript
// ✅ 正确方式
const formData = new FormData();
formData.append('file', file);  // file 是 File 对象（继承自 Blob）

// ❌ 错误方式
// 不要手动转换为 base64 或二进制流
// 不要设置 Content-Type 为 application/json
```

### 文件类型支持

- ✅ JPG/JPEG
- ✅ PNG
- ✅ GIF
- ✅ WebP
- ✅ 其他图片格式

### 文件大小建议

- 推荐：< 2MB（加载快）
- 最大：< 5MB
- 对于封面图片，建议在前端压缩后上传

### 预签名URL有效期

- 默认：3600秒（1小时）
- URL过期后需要重新获取

---

## 🎯 典型使用场景

### 场景1：创建Theme时上传封面

```javascript
// 1. 先创建 Theme
const theme = await createTheme({ name: '技术博客', description: '...' });

// 2. 上传封面
await uploadCoverImage(coverFile, 'theme', theme.id);
```

### 场景2：编辑时更换封面

```javascript
// 直接上传新图片，会自动替换旧封面
await uploadCoverImage(newCoverFile, 'theme', existingThemeId);
```

### 场景3：展示列表时获取封面

```javascript
// 获取所有 theme 的封面
const themes = await getThemes();
const themesWithCovers = await Promise.all(
  themes.map(async (theme) => {
    const coverUrl = await getCoverUrl('theme', theme.id);
    return { ...theme, coverUrl };
  })
);
```

---

## ✨ 总结

**你的项目完全支持封面图片管理！**

✅ **上传方式**：使用 `FormData` + `multipart/form-data`  
✅ **数据格式**：发送 File/Blob 对象，不是base64  
✅ **存储方式**：S3对象存储（通过Resource模型）  
✅ **获取方式**：预签名URL（临时访问链接）  
✅ **支持类型**：Theme、Chapter、Article  
✅ **操作**：上传、获取、更新、删除  

前端只需使用 `FormData` 发送文件，后端会自动处理上传到S3和创建封面记录！
