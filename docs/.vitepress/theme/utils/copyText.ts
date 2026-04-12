/**
 * 文本复制函数
 * @param text - 需要复制的纯文本内容
 * @returns Promise<boolean> - 复制成功返回 true，失败返回 false
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  // 首选方案：使用现代的 Clipboard API (需处于安全上下文)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.warn('Clipboard API 失败，尝试使用降级方案...', err)
      // 失败后不 return，继续执行降级方案
    }
  }

  // 降级方案：使用 document.execCommand
  try {
    const textArea: HTMLTextAreaElement = document.createElement('textarea')
    textArea.value = text
    
    // 隐藏文本域，防止页面滚动或闪烁
    textArea.style.position = 'fixed'
    textArea.style.top = '-9999px'
    textArea.style.left = '-9999px'
    textArea.style.opacity = '0'
    
    document.body.appendChild(textArea)
    
    textArea.focus()
    textArea.select()
    
    // execCommand 在未来的标准中会被废弃，但在旧浏览器/特殊环境中依然是唯一的 fallback
    const successful: boolean = document.execCommand('copy')
    
    document.body.removeChild(textArea)
    
    return successful
  } catch (err) {
    console.error('降级复制方案失败:', err)
    return false
  }
}