export const GITHUB_REPO_BASE = 'https://github.com/wqnmlgb151/study/blob/main/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%8A%80%E6%9C%AF%E5%AD%A6%E4%B9%A0/web%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95'
export const RAW_BASE = 'https://raw.githubusercontent.com/wqnmlgb151/study/main/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%8A%80%E6%9C%AF%E5%AD%A6%E4%B9%A0/web%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95'

export const FILE_LIST_FALLBACK = [
  '01 代理配置和IP地址.md', '02 web运行原理与操作系统.md', '03.快速搭建渗透测试环境.md',
  '04.渗透常见的DOS命令.md', '05.Linux基础操作与配置.md', '06.Linux用户权限管理.md',
  '07.Linux系统状态管理、安全加固.md', '08.Kali.md', '09.抓包工具介绍.md',
  '10.http协议.md', '11.BurpSuite详解.md', '12.数据传输与加密算法.md',
  '13.信息收集.md', '14.MySQL基础.md', '15.PHP基础.md', '16.前后端交互.md',
  '17.身份验证原理.md', '18.SQL注入.md', '19.SQL注入利用方式.md'
]

const API_URL = 'https://api.github.com/repos/wqnmlgb151/study/contents/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%8A%80%E6%9C%AF%E5%AD%A6%E4%B9%A0/web%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95'

export async function fetchFileList() {
  try {
    const res = await fetch(API_URL, { headers: { Accept: 'application/vnd.github.v3+json' } })
    if (!res.ok) throw new Error('API fail')
    const data = await res.json()
    const names = data
      .filter(f => f.type === 'file' && f.name.toLowerCase().includes('.md'))
      .map(f => f.name)
    return names.length > 0 ? names : FILE_LIST_FALLBACK
  } catch {
    return FILE_LIST_FALLBACK
  }
}

export function parseFileName(rawName) {
  const m = rawName.match(/^(\d+)[.\s]*(.+)\.md$/i)
  const title = m ? m[2] : rawName.replace(/\.md$/i, '')
  return {
    rawName,
    num: m ? parseInt(m[1], 10) : 0,
    title,
    downloadUrl: RAW_BASE + '/' + encodeURIComponent(rawName),
    htmlUrl: GITHUB_REPO_BASE + '/' + encodeURIComponent(rawName),
    icon: getIcon(title)
  }
}

const ICON_RULES = [
  { keys: ['sql', '注入'], icon: '🗄️' },
  { keys: ['burp', '代理', '抓包'], icon: '🔍' },
  { keys: ['kali', 'linux'], icon: '💻' },
  { keys: ['dos', '命令'], icon: '⌨️' },
  { keys: ['http', '协议'], icon: '🌐' },
  { keys: ['认证', '身份'], icon: '🔑' },
  { keys: ['加密'], icon: '🔐' },
  { keys: ['收集'], icon: '📋' },
  { keys: ['基础', '入门', '搭建'], icon: '📖' },
  { keys: ['工具'], icon: '🛠️' },
  { keys: ['mysql', 'php'], icon: '🖥️' },
  { keys: ['前后端', '交互'], icon: '🔗' },
  { keys: ['运行', '操作系统'], icon: '⚙️' },
  { keys: ['权限'], icon: '🛡️' },
  { keys: ['状态', '安全加固'], icon: '📊' },
  { keys: ['数据传输', '加密算法'], icon: '💎' }
]

function getIcon(title) {
  const t = title.toLowerCase()
  return ICON_RULES.find(r => r.keys.some(k => t.includes(k)))?.icon ?? '📝'
}
