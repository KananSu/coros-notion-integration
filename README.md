# Coros Notion Integration

Coros运动记录同步Notion，目前仅支持概括性信息，运动时间，距离，心率，配速等，后续会扩展到更详细的信息。

## 基本使用说明

### 1. 申请 Notion Integration

参考 [Notion API 官网](https://developers.notion.com/docs/create-a-notion-integration#getting-started)获取并保存 Notion Integration secret，并修改.env文件中的NOTION_KEY

### 2. 授予 Notion Page 权限

参考 [Notion 官网](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions) 给予 integration 权限;

### 3. 创建 Notion 数据库

* 复制此[模版](https://wonderful-almandine-1e2.notion.site/f63a5e48bcec4d15a11c1885caa27b37?v=5e8d1743e94e42e09977ae341a977a4b&pvs=4)

```
建议不要修改模版
```

* 打开Notion数据库，点击右上角Share, 复制数据库Link;
* 获取链接比如 https://www.notion.so/f63a5e48bcec4d15a11c1885caa27b37?v=5e8d1743e94e42exxxxxxxxxxxxx&pvs=4, 中间的f63a5e48bcec4d15a11c1885caa27b37就是数据库id
* .env文件中配置NOTION_DATABASE_ID

### 4. 配置coros网页账号密码

在.env文件中配置coros的账号COROS_ACCOUNT邮箱和密码COROS_PASSWORD

### 5. 运行脚本

```shell
npm install

npm run build

npm run start
```
