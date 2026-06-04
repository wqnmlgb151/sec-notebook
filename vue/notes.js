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

export function fetchFileList(callback) {
  fetch(API_URL, { headers: { Accept: 'application/vnd.github.v3+json' } })
    .then(res => {
      if (!res.ok) throw new Error('API fail')
      return res.json()
    })
    .then(data => {
      const names = data
        .filter(f => f.type === 'file' && f.name.toLowerCase().includes('.md'))
        .map(f => f.name)
      callback(names.length > 0 ? names : FILE_LIST_FALLBACK)
    })
    .catch(() => callback(FILE_LIST_FALLBACK))
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

function getIcon(t) {
  t = t.toLowerCase()
  if (t.includes('sql') || t.includes('注入')) return '🗄️'
  if (t.includes('burp') || t.includes('代理') || t.includes('抓包')) return '🔍'
  if (t.includes('kali') || t.includes('linux')) return '💻'
  if (t.includes('dos') || t.includes('命令')) return '⌨️'
  if (t.includes('http') || t.includes('协议')) return '🌐'
  if (t.includes('认证') || t.includes('身份')) return '🔑'
  if (t.includes('加密')) return '🔐'
  if (t.includes('收集')) return '📋'
  if (t.includes('基础') || t.includes('入门') || t.includes('搭建')) return '📖'
  if (t.includes('工具')) return '🛠️'
  if (t.includes('mysql') || t.includes('php')) return '🖥️'
  if (t.includes('前后端') || t.includes('交互')) return '🔗'
  if (t.includes('运行') || t.includes('操作系统')) return '⚙️'
  if (t.includes('权限')) return '🛡️'
  if (t.includes('状态') || t.includes('安全加固')) return '📊'
  if (t.includes('数据传输') || t.includes('加密算法')) return '💎'
  return '📝'
}
