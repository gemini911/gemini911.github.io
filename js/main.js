// 汇率变量：1亿RB = 160人民币
let rmbToRbRate = 160;
// 汇率变量：218人民币 = 100000MB
const MB_PER_RMB = 100000 / 218;
// 人民币兑泰铢汇率
let rmbToThbRate = null;

// 获取实时汇率
async function fetchExchangeRate() {
  const rateElement = document.getElementById('thb-rate');
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/CNY');
    const data = await response.json();
    if (data && data.rates && data.rates.THB) {
      rmbToThbRate = data.rates.THB;
      const date = new Date(data.time_last_update_utc);
      rateElement.textContent = `当前汇率：1 CNY = ${rmbToThbRate.toFixed(4)} THB (${date.toLocaleDateString()})`;
      rateElement.className = 'exchange-rate-info success';
      // 如果有输入值，重新计算
      const rmbInput = document.getElementById('rmb').value;
      if (rmbInput) {
        convertCurrency('rmb');
      }
    } else {
      throw new Error('无法获取汇率数据');
    }
  } catch (error) {
    console.error('获取汇率失败:', error);
    rateElement.textContent = '汇率获取失败，使用默认汇率：1 CNY = 4.738 THB';
    rateElement.className = 'exchange-rate-info error';
    rmbToThbRate = 4.738; // 使用默认汇率
  }
}

// 页面加载时获取汇率
fetchExchangeRate();
// 每小时更新一次汇率
setInterval(fetchExchangeRate, 3600000);

// 更新汇率
document
  .getElementById("rmb-to-rb-rate")
  .addEventListener("input", function () {
    const value = parseFloat(this.value);
    if (value > 0) {
      rmbToRbRate = value;
      const rmbValue = document.getElementById("rmb").value;
      if (rmbValue) {
        convertCurrency("rmb");
      }
    }
  });

// 格式化数字
function formatNumber(number, decimals = 2) {
  if (isNaN(number) || number === "") return "";
  return number.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// 转换为中文数字表示
function formatChineseNumber(number) {
  if (isNaN(number) || number < 10000) return "";
  
  if (number >= 100000000) { // 亿
    return (number / 100000000).toFixed(2).replace(/\.?0+$/, '') + "亿";
  } else if (number >= 10000000) { // 千万
    return (number / 10000000).toFixed(2).replace(/\.?0+$/, '') + "千万";
  } else if (number >= 1000000) { // 百万
    return (number / 1000000).toFixed(2).replace(/\.?0+$/, '') + "百万";
  } else if (number >= 10000) { // 万
    return (number / 10000).toFixed(2).replace(/\.?0+$/, '') + "万";
  }
  return "";
}

// 清除单个输入框
function clearInput(id) {
  document.getElementById(id).value = "";
  // 清除其他输入框和中文显示
  const inputs = ["rmb", "rb", "mb", "thb"];
  const displays = ["rb-chinese", "mb-chinese"];
  
  inputs.forEach(input => {
    if (input !== id) {
      document.getElementById(input).value = "";
    }
  });
  
  displays.forEach(display => {
    document.getElementById(display).textContent = "";
  });
}

// 重置所有输入框
function resetAll() {
  document.getElementById("rmb").value = "";
  document.getElementById("rb").value = "";
  document.getElementById("mb").value = "";
  document.getElementById("thb").value = "";
  document.getElementById("rb-chinese").textContent = "";
  document.getElementById("mb-chinese").textContent = "";
}

// 货币换算函数
function convertCurrency(sourceId) {
  // 获取输入框的值
  const inputValue = document.getElementById(sourceId).value;

  // 如果输入为空，清除其他输入框
  if (!inputValue) {
    clearInput(sourceId);
    return;
  }

  // 解析输入值
  const value = parseFloat(inputValue.replace(/,/g, ""));

  // 验证输入值
  if (isNaN(value) || value < 0) {
    alert("请输入有效的正数");
    return;
  }

  // 进行换算
  switch (sourceId) {
    case "rmb":
      // 人民币转RB：1亿RB = rmbToRbRate人民币
      const rbValue = (value * 1e8) / rmbToRbRate;
      document.getElementById("rb").value = formatNumber(rbValue, 0);
      document.getElementById("rb-chinese").textContent = formatChineseNumber(rbValue);
      
      // 人民币转MB：218人民币 = 100000MB
      const mbValue = Math.floor(value * MB_PER_RMB);
      document.getElementById("mb").value = formatNumber(mbValue, 0);
      document.getElementById("mb-chinese").textContent = formatChineseNumber(mbValue);

      // 人民币转泰铢
      if (rmbToThbRate !== null) {
        const thbValue = value * rmbToThbRate;
        document.getElementById("thb").value = formatNumber(thbValue, 2);
      }
      break;

    case "rb":
      // RB转人民币
      const rmbValue = (value * rmbToRbRate) / 1e8;
      document.getElementById("rmb").value = formatNumber(rmbValue, 2);
      
      // 通过人民币计算MB
      const mbFromRb = Math.floor(rmbValue * MB_PER_RMB);
      document.getElementById("mb").value = formatNumber(mbFromRb, 0);
      
      // 通过人民币计算泰铢
      if (rmbToThbRate !== null) {
        const thbFromRb = rmbValue * rmbToThbRate;
        document.getElementById("thb").value = formatNumber(thbFromRb, 2);
      }
      
      // 更新中文显示
      document.getElementById("rb-chinese").textContent = formatChineseNumber(value);
      document.getElementById("mb-chinese").textContent = formatChineseNumber(mbFromRb);
      break;

    case "mb":
      // MB转人民币：218人民币 = 100000MB
      const rmbFromMb = value / MB_PER_RMB;
      document.getElementById("rmb").value = formatNumber(rmbFromMb, 2);
      
      // 通过人民币计算RB
      const rbFromMb = (rmbFromMb * 1e8) / rmbToRbRate;
      document.getElementById("rb").value = formatNumber(rbFromMb, 0);
      
      // 通过人民币计算泰铢
      if (rmbToThbRate !== null) {
        const thbFromMb = rmbFromMb * rmbToThbRate;
        document.getElementById("thb").value = formatNumber(thbFromMb, 2);
      }
      
      // 更新中文显示
      document.getElementById("rb-chinese").textContent = formatChineseNumber(rbFromMb);
      document.getElementById("mb-chinese").textContent = formatChineseNumber(value);
      break;

    case "thb":
      if (rmbToThbRate !== null) {
        // 泰铢转人民币
        const rmbFromThb = value / rmbToThbRate;
        document.getElementById("rmb").value = formatNumber(rmbFromThb, 2);
        
        // 通过人民币计算RB
        const rbFromThb = (rmbFromThb * 1e8) / rmbToRbRate;
        document.getElementById("rb").value = formatNumber(rbFromThb, 0);
        
        // 通过人民币计算MB
        const mbFromThb = Math.floor(rmbFromThb * MB_PER_RMB);
        document.getElementById("mb").value = formatNumber(mbFromThb, 0);
        
        // 更新中文显示
        document.getElementById("rb-chinese").textContent = formatChineseNumber(rbFromThb);
        document.getElementById("mb-chinese").textContent = formatChineseNumber(mbFromThb);
      }
      break;
  }
}

// 复制淘宝文本
function copyTaobaoText() {
  const text = `【淘宝】45%买家复购 http://e.tb.cn/h.TcnLe2dHa6F5c0r?tk=tKCL3tk8ZUo CZ0001 「自动发卡 雷蛇充值卡(泰国)Razer Gold PIN [TH] 1000THB」\n点击链接直接打开 或者 淘宝搜索直接打开`;
  
  // 创建临时文本区域
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  
  // 选择文本并复制
  textarea.select();
  document.execCommand('copy');
  
  // 移除临时文本区域
  document.body.removeChild(textarea);
  
  // 显示 toast
  showToast();
}

// 显示 toast 提示
function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  
  // 3秒后隐藏
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
